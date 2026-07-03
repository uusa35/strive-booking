# User Login Tracking, Dashboard Timestamps & en/ar i18n — Design

**Date:** 2026-07-03
**Status:** Approved (proceeded with recommended options; user was away — revisit on request)

## Goal

1. Show `created_at` and `updated_at` for every user in the dashboard table.
2. Track the last time each user logged into their account (`last_login_at`).
3. Add a period filter (dropdown + custom date range) so an admin can see which — and how many — users logged in between two dates.
4. All labels translated to English and Arabic via a proper i18n layer with a language switcher.

## Context

- Laravel 12 + Inertia + React (TanStack table), Arabic-only UI with hardcoded `dir="rtl"`.
- `users` already has `created_at`/`updated_at`; no `last_login_at` column.
- Dashboard loads all users at once (`User::where('id','!=',1)->get()`); search/sort/pagination are client-side.
- No i18n system exists; labels are hardcoded Arabic with stray English in `MainDataTable`.
- Two login paths: `AuthenticatedSessionController::store` (Auth::attempt via LoginRequest) and `RegisteredUserController::store` (Auth::login after register).

## Decisions

### 1. Last-login tracking — event listener

`app/Listeners/UpdateLastLoginAt.php` handles `Illuminate\Auth\Events\Login`, which fires for `Auth::attempt`, `Auth::login`, and remember-me logins — one listener covers all paths. Laravel 12 auto-discovers listeners by type-hint.

The update uses the query builder (`User::whereKey(...)->toBase()->update(...)`) so it does **not** bump `updated_at` — otherwise every login would overwrite "modified at" and make that column meaningless.

Migration: `last_login_at` nullable timestamp on `users`. Cast to `datetime` in the model.

Rejected: stamping in each controller (duplication, misses future paths); middleware (tracks activity, not login; write per request).

### 2. Dashboard columns

Three new sortable columns in `dashboard.tsx`: Created at (تاريخ التسجيل), Modified at (آخر تعديل), Last login (آخر دخول). Format `YYYY-MM-DD HH:mm`. Null `last_login_at` renders a "never logged in" badge.

### 3. Login-period filter

Above the table: a dropdown with presets — All, Today, Last 7 days, Last 30 days, Custom range. "Custom" reveals from/to date inputs. Filtering is client-side (`useMemo` over `elements` before passing to the table), consistent with the existing table architecture and composes with the existing global text search. A live count shows "N users logged in in this period".

Rejected: server-side query-param filtering — unnecessary while the dashboard already ships all users to the client; revisit if the user count grows enough to paginate server-side.

### 4. i18n — lightweight custom provider

- `resources/js/lang/en.json` and `ar.json` flat-key dictionaries.
- `resources/js/lib/i18n.tsx`: `I18nProvider` + `useTrans()` hook returning `t(key)`, `locale`, `setLocale`. SSR-safe (no bare `document` access at module scope).
- Initial locale comes from the Inertia shared prop `locale`; switching calls `POST /locale` (session-persisted) and updates `document.documentElement.dir`/`lang` immediately. ar → rtl, en → ltr.
- Server: `SetLocale` middleware applies session locale; `HandleInertiaRequests` shares `locale`.
- `app.blade.php` `dir` becomes dynamic from locale instead of hardcoded `rtl`.
- Language switcher (EN/ع toggle) in the app header and auth layout.
- Surfaces translated: dashboard, MainDataTable, nav/sidebar/header, auth pages (login, register, forgot/reset password, verify email, confirm password), UserShow, welcome. Every new label ships in both languages.

Rejected: `laravel-react-i18n` package — extra dependency + Vite plugin for what ~60 lines cover.

## Error handling

- Listener failure must not block login: wrap update in try/catch (a missed stamp is preferable to a failed login).
- Invalid custom date range (from > to) → treated as no matches; inputs constrain each other via min/max.
- Missing translation key → fall back to the key itself (visible in dev, harmless in prod).

## Testing

- Pest feature test: logging in sets `last_login_at`, and does not change `updated_at`.
- Pest feature test: registering (auto-login) sets `last_login_at`.
- Existing auth tests keep passing.
- Manual: dashboard shows the three columns; period presets and custom range filter correctly; count updates; language toggle flips labels and direction.
