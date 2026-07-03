# User Login Tracking, Dashboard Timestamps & en/ar i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Track each user's last login, show created/modified/last-login timestamps in the dashboard with a login-period filter, and translate all UI labels to en/ar with a language switcher.

**Architecture:** A `Login`-event listener stamps `users.last_login_at` (query-builder update so `updated_at` is untouched). The dashboard's TanStack table gains three timestamp columns and a client-side period filter (`useMemo` over the already-fully-loaded `elements`). i18n is a dependency-free layer: flat en/ar JSON dictionaries + a `useTrans()` hook reading the Inertia-shared `locale` prop; locale persists in the Laravel session via a `POST /locale` route and a `SetLocale` middleware; `dir` flips rtl/ltr.

**Tech Stack:** Laravel 12, Inertia v2, React 19, TanStack react-table, Pest, shadcn/ui components (`ui/select`, `ui/input`, `ui/badge`).

## Global Constraints

- Every user-visible label must exist in BOTH `resources/js/lang/en.json` and `resources/js/lang/ar.json`.
- `last_login_at` writes must never bump `updated_at` and must never block login (wrap in try/catch).
- Filtering stays client-side (data is already fully loaded client-side).
- No new npm/composer dependencies.
- Default locale is `ar` (RTL); `en` is LTR.
- Tests: Pest. Login uses `mobile` + `password` (NOT email).

---

### Task 1: `last_login_at` column, listener, model cast

**Files:**
- Create: `database/migrations/2026_07_03_000001_add_last_login_at_to_users_table.php`
- Create: `app/Listeners/UpdateLastLoginAt.php`
- Modify: `app/Models/User.php` (casts())
- Test: `tests/Feature/Auth/LastLoginTest.php`

**Interfaces:**
- Produces: `users.last_login_at` (nullable timestamp, serialized as ISO string in the `User` JSON payload consumed by dashboard tasks).

- [ ] **Step 1: Write the failing tests**

`tests/Feature/Auth/LastLoginTest.php`:

```php
<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('logging in records last_login_at without touching updated_at', function () {
    $user = User::factory()->create();
    $originalUpdatedAt = $user->updated_at;

    $this->travel(5)->minutes();

    $response = $this->post('/login', [
        'mobile' => $user->mobile,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $user->refresh();
    expect($user->last_login_at)->not->toBeNull();
    expect($user->updated_at->equalTo($originalUpdatedAt))->toBeTrue();
});

test('registering stamps last_login_at via auto-login', function () {
    $this->post('/register', [
        'first_name' => 'Test',
        'mobile' => '96555555',
    ]);

    $user = User::where('mobile', '96555555')->first();
    expect($user)->not->toBeNull();
    expect($user->last_login_at)->not->toBeNull();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `php artisan test tests/Feature/Auth/LastLoginTest.php`
Expected: FAIL (column `last_login_at` does not exist / null).

- [ ] **Step 3: Migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_login_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('last_login_at');
        });
    }
};
```

- [ ] **Step 4: Listener (auto-discovered by type-hint in Laravel 12)**

`app/Listeners/UpdateLastLoginAt.php`:

```php
<?php

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Login;

class UpdateLastLoginAt
{
    public function handle(Login $event): void
    {
        try {
            // Query-builder update: must not bump updated_at or fire model events.
            User::whereKey($event->user->getAuthIdentifier())
                ->toBase()
                ->update(['last_login_at' => now()]);
        } catch (\Throwable) {
            // A missed stamp must never block login.
        }
    }
}
```

- [ ] **Step 5: Model cast** — in `App\Models\User::casts()` add `'last_login_at' => 'datetime',`

- [ ] **Step 6: Run migration + tests**

Run: `php artisan migrate && php artisan test tests/Feature/Auth/LastLoginTest.php`
Expected: PASS (2 tests)

- [ ] **Step 7: Commit** — `git commit -m "Feat: track last_login_at on every login via Login event listener"`

---

### Task 2: Server-side locale (session + middleware + shared prop + dynamic dir)

**Files:**
- Create: `app/Http/Middleware/SetLocale.php`
- Modify: `bootstrap/app.php` (register middleware), `routes/web.php` (locale route), `app/Http/Middleware/HandleInertiaRequests.php` (share `locale`), `resources/views/app.blade.php` (dynamic `dir`)

**Interfaces:**
- Produces: Inertia shared prop `locale: 'en' | 'ar'`; route `locale.set` (POST `/locale`, body `{locale}`); `<html dir>` derived from locale.

- [ ] **Step 1: Middleware**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get('locale', 'ar');
        app()->setLocale(in_array($locale, ['en', 'ar']) ? $locale : 'ar');

        return $next($request);
    }
}
```

- [ ] **Step 2: Register in `bootstrap/app.php`** web group BEFORE `HandleInertiaRequests::class`:

```php
$middleware->web(append: [
    HandleAppearance::class,
    \App\Http\Middleware\SetLocale::class,
    HandleInertiaRequests::class,
    AddLinkHeadersForPreloadedAssets::class,
]);
```

- [ ] **Step 3: Route in `routes/web.php`** (top level, not auth-gated):

```php
Route::post('locale', function (\Illuminate\Http\Request $request) {
    $request->validate(['locale' => 'required|in:en,ar']);
    $request->session()->put('locale', $request->locale);
    return back();
})->name('locale.set');
```

- [ ] **Step 4: Share locale** in `HandleInertiaRequests::share()`: `'locale' => app()->getLocale(),`

- [ ] **Step 5: Dynamic dir** in `resources/views/app.blade.php`: replace `dir="rtl"` with `dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}"`

- [ ] **Step 6: Verify** — `php artisan test tests/Feature/Auth/LastLoginTest.php` still PASS; `curl -s localhost` renders `dir="rtl"`.

- [ ] **Step 7: Commit** — `git commit -m "Feat: session-persisted locale (en/ar) shared via Inertia, dynamic dir"`

---

### Task 3: i18n dictionaries, useTrans hook, LanguageSwitcher

**Files:**
- Create: `resources/js/lang/en.json`, `resources/js/lang/ar.json`, `resources/js/lib/i18n.tsx`, `resources/js/components/LanguageSwitcher.tsx`
- Modify: `resources/js/types/index.d.ts` (add `locale` to SharedData, `last_login_at` to User)

**Interfaces:**
- Produces: `useTrans(): { t(key: string): string; locale: 'en'|'ar'; isRtl: boolean; setLocale(l): void }`; `<LanguageSwitcher className?>` component. All later tasks consume `t()` with the dictionary keys defined here.

- [ ] **Step 1: `resources/js/lib/i18n.tsx`**

```tsx
import ar from '@/lang/ar.json';
import en from '@/lang/en.json';
import { router, usePage } from '@inertiajs/react';

export type Locale = 'en' | 'ar';

const dictionaries: Record<Locale, Record<string, string>> = { en, ar };

export function useTrans() {
    const { locale = 'ar' } = usePage().props as unknown as { locale?: Locale };

    const t = (key: string): string => dictionaries[locale]?.[key] ?? dictionaries.ar[key] ?? key;

    const setLocale = (next: Locale) => {
        if (next === locale) return;
        router.post(
            route('locale.set'),
            { locale: next },
            {
                preserveScroll: true,
                onSuccess: () => {
                    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
                    document.documentElement.setAttribute('lang', next);
                },
            },
        );
    };

    return { t, locale, isRtl: locale === 'ar', setLocale };
}
```

- [ ] **Step 2: `resources/js/components/LanguageSwitcher.tsx`**

```tsx
import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/i18n';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher({ className }: { className?: string }) {
    const { locale, setLocale } = useTrans();
    return (
        <Button type="button" variant="ghost" size="sm" className={className} onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}>
            <Languages className="h-4 w-4" />
            <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
        </Button>
    );
}
```

- [ ] **Step 3: Dictionaries** — full key set (used across Tasks 4–6). `en.json` / `ar.json` pairs:

| key | en | ar |
|---|---|---|
| dashboard | Dashboard | لوحة التحكم |
| id | # | م |
| full_name | Full name | الاسم بالكامل |
| mobile | Mobile | الموبايل |
| email | Email | ايميل |
| account_type | Account type | نوع الحساب |
| stage | Educational stage | المرحلة التعليمية |
| ticket | Ticket | التذكرة |
| created_at | Created at | تاريخ التسجيل |
| updated_at | Modified at | آخر تعديل |
| last_login_at | Last login | آخر دخول |
| never_logged_in | Never logged in | لم يسجل الدخول بعد |
| login_period | Login period | فترة تسجيل الدخول |
| all | All | الكل |
| today | Today | اليوم |
| last_7_days | Last 7 days | آخر ٧ أيام |
| last_30_days | Last 30 days | آخر ٣٠ يوم |
| custom_range | Custom range | فترة مخصصة |
| from | From | من |
| to | To | إلى |
| users_logged_in_period | users logged in during this period | مستخدم سجّل الدخول خلال هذه الفترة |
| not_available | N/A | لا يوجد |
| search | Search.. | بحث.. |
| previous | Previous | السابق |
| next | Next | التالي |
| front_page | Front page | الواجهة الامامية |
| registered_users | Registered users | قائمة المسجلين |
| login_title | Log in to your account | الدخول لحسابك |
| login_description | Enter your mobile number | إدخل رقم هاتفك الآن |
| password | Password | كلمة المرور |
| forgot_password | Forgot your password? | نسيت كلمة المرور؟ |
| remember_me | Remember me | تذكرني |
| login_button | Log in | الدخول للحساب |
| login_success | Logged in successfully | تم الدخول بنجاح |
| no_account | Don't have an account or a ticket | لا تمتلك حساب أو تذكرة |
| register_now | Register now | سجل الآن |
| back_home | Back to home | العودة للرئيسية |

(Task 6 adds the remaining register/settings/welcome/UserShow keys with the same pattern — every literal it touches gets a row in BOTH files.)

- [ ] **Step 4: Types** — in `resources/js/types/index.d.ts` add `locale?: 'en' | 'ar';` to `SharedData` and `last_login_at?: string | null;` to `User`.

- [ ] **Step 5: Build check** — `yarn build` (or `npm run build`) compiles without TS errors.

- [ ] **Step 6: Commit** — `git commit -m "Feat: en/ar i18n layer (dictionaries, useTrans, LanguageSwitcher)"`

---

### Task 4: Dashboard timestamp columns

**Files:**
- Modify: `resources/js/pages/dashboard.tsx`, `resources/js/constants.ts` (add `formatDateTime`)

**Interfaces:**
- Consumes: `useTrans` (Task 3), `User.last_login_at` (Task 1).
- Produces: `formatDateTime(value?: string | null): string` in `constants.ts`.

- [ ] **Step 1: Helper in `constants.ts`**

```ts
export const formatDateTime = (value?: string | null): string => {
    if (!value) return '';
    const d = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
```

- [ ] **Step 2: Columns** — in `dashboard.tsx` add three sortable columns (same header Button pattern as existing columns, `useMemo` dependency `[t]`), inserted after `stage`:
  - `created_at` → header `t('created_at')`, cell `formatDateTime(row.original.created_at)`
  - `updated_at` → header `t('updated_at')`, cell `formatDateTime(row.original.updated_at)`
  - `last_login_at` → header `t('last_login_at')`, cell: `formatDateTime` value, or `<Badge variant="secondary">{t('never_logged_in')}</Badge>` when null. Translate all existing hardcoded column headers to `t()` keys at the same time.

- [ ] **Step 3: Verify** — `yarn build` passes; dashboard renders the columns.

- [ ] **Step 4: Commit** — `git commit -m "Feat: dashboard shows created/modified/last-login columns (en/ar)"`

---

### Task 5: Login-period filter (dropdown + custom range + live count)

**Files:**
- Modify: `resources/js/pages/dashboard.tsx`

**Interfaces:**
- Consumes: `formatDateTime`, `useTrans`, `User.last_login_at`.

- [ ] **Step 1: Filter state + logic** in `Dashboard` component:

```tsx
type Period = 'all' | 'today' | '7d' | '30d' | 'custom';
const [period, setPeriod] = useState<Period>('all');
const [from, setFrom] = useState('');
const [to, setTo] = useState('');

const filtered = useMemo(() => {
    const users = elements ?? [];
    if (period === 'all') return users;
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;
    if (period === 'today') {
        start = new Date(now);
        start.setHours(0, 0, 0, 0);
    } else if (period === '7d') {
        start = new Date(now.getTime() - 7 * 86400000);
    } else if (period === '30d') {
        start = new Date(now.getTime() - 30 * 86400000);
    } else {
        start = from ? new Date(from) : null;
        end = to ? new Date(`${to}T23:59:59`) : null;
    }
    return users.filter((u) => {
        if (!u.last_login_at) return false;
        const loggedAt = new Date(u.last_login_at);
        if (start && loggedAt < start) return false;
        if (end && loggedAt > end) return false;
        return true;
    });
}, [elements, period, from, to]);
```

- [ ] **Step 2: Filter UI** above `MainDataTable` — a `Select` (from `@/components/ui/select`) with items `all|today|7d|30d|custom` labeled via `t()`; when `custom`, two `<Input type="date">` bound to `from`/`to` (`to` gets `min={from}`, `from` gets `max={to || undefined}`); when `period !== 'all'`, a `Badge` showing `{filtered.length} {t('users_logged_in_period')}`. Pass `data={filtered}` to `MainDataTable` instead of `elements`.

- [ ] **Step 3: Verify** — `yarn build`; manually: presets narrow the list, custom range works, count matches, text search still composes.

- [ ] **Step 4: Commit** — `git commit -m "Feat: dashboard login-period filter with presets, custom range, live count"`

---

### Task 6: Translate all remaining labels (en/ar sweep)

**Files:**
- Modify: `resources/js/components/MainDataTable.tsx` (search/previous/next → `t()`), `app-sidebar.tsx`, `nav-main.tsx`, `app-logo.tsx`, `AppFrontHeader.tsx`, `UserCard.tsx`, `user-menu-content.tsx`, `delete-user.tsx`, `appearance-tabs.tsx`, `layouts/settings/layout.tsx`, `pages/auth/login.tsx`, `pages/auth/register.tsx`, `pages/dashboard.tsx` (breadcrumbs/Head), `pages/user/UserShow.tsx`, `pages/welcome.tsx`, `pages/comming-soon.tsx`, `pages/errors/NotFound.tsx`, `pages/settings/{appearance,password,profile}.tsx`
- Modify: `resources/js/lang/en.json`, `resources/js/lang/ar.json` (add keys for every literal encountered)
- Modify: layout header (`app-sidebar-header.tsx` or equivalent) + `layouts/auth-layout.tsx` + `AppFrontHeader.tsx`: mount `<LanguageSwitcher />`

**Interfaces:**
- Consumes: `useTrans`, `LanguageSwitcher` (Task 3).

- [ ] **Step 1:** For each file above: read it, move every hardcoded Arabic/English user-facing literal into a new kebab/snake key in BOTH dictionaries (existing Arabic text becomes the `ar` value; write the `en` translation), replace the literal with `t('key')`. Components with module-level label arrays (e.g. `app-sidebar.tsx` `mainNavItems`) move the array inside the component so `t()` is available.
- [ ] **Step 2:** Mount `<LanguageSwitcher />` in the app sidebar header bar, the auth layout, and `AppFrontHeader`.
- [ ] **Step 3: Verify** — `yarn build` passes; `grep -rn "[؀-ۿ]" resources/js --include="*.tsx" | grep -v lang/` returns only dictionary/locale-name matches (the `'العربية'` toggle label in LanguageSwitcher is intentionally hardcoded).
- [ ] **Step 4: Commit** — `git commit -m "Feat: translate all UI labels to en/ar, add language switcher"`

---

### Task 7: Full verification

- [ ] **Step 1:** `php artisan test` — new tests pass; note any pre-existing failures (e.g. `AuthenticationTest` posts `email` while login uses `mobile`) and fix those that the spec's surfaces touch.
- [ ] **Step 2:** `yarn build` — clean production build.
- [ ] **Step 3:** Manual smoke via dev server: login stamps `last_login_at`; dashboard shows 3 new columns; period filter + count works; language toggle flips en/ar and ltr/rtl.
- [ ] **Step 4:** Final commit of any fixes.
