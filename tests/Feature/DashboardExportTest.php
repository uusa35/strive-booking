<?php

use App\Exports\UsersExport;
use App\Models\User;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Facades\Excel;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page from the export', function () {
    $this->get(route('dashboard.export'))->assertRedirect('/login');
});

test('non-admin users cannot download the export', function () {
    User::factory()->create(); // id 1 => admin
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('dashboard.export'))->assertRedirect('/');
});

test('admin can download the users excel export', function () {
    Excel::fake();
    Carbon::setTestNow('2026-07-07 12:00:00');
    $admin = User::factory()->create();

    $this->actingAs($admin)->get(route('dashboard.export'))->assertOk();

    Excel::assertDownloaded('users-2026-07-07_120000.xlsx');
});

test('invalid filter params are rejected', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->from(route('dashboard'))
        ->get(route('dashboard.export', ['start' => 'not-a-date', 'tz' => 'Not/AZone']))
        ->assertRedirect(route('dashboard'))
        ->assertSessionHasErrors(['start', 'tz']);
});

test('export applies search and login-period filters from the request', function () {
    Excel::fake();
    Carbon::setTestNow('2026-07-07 12:00:00');
    $admin = User::factory()->create();
    $match = User::factory()->create([
        'first_name' => 'Zzyzx',
        'last_name' => 'Match',
        'last_login_at' => '2026-07-05 10:00:00',
    ]);
    User::factory()->create([
        'first_name' => 'Zzyzx',
        'last_name' => 'Neverlogged',
        'last_login_at' => null,
    ]);
    User::factory()->create([
        'first_name' => 'Qqrst',
        'last_name' => 'Wrongname',
        'last_login_at' => '2026-07-05 10:00:00',
    ]);
    User::factory()->create([
        'first_name' => 'Zzyzx',
        'last_name' => 'Tooold',
        'last_login_at' => '2026-06-01 10:00:00',
    ]);

    $this->actingAs($admin)->get(route('dashboard.export', [
        'q' => 'zzyzx',
        'login_filter' => 1,
        'start' => '2026-07-01T00:00:00.000Z',
        'end' => '2026-07-06T00:00:00.000Z',
        'tz' => 'Asia/Kuwait',
    ]))->assertOk();

    Excel::assertDownloaded('users-2026-07-07_120000.xlsx', function (UsersExport $export) use ($match) {
        return $export->collection()->pluck('id')->all() === [$match->id];
    });
});

test('export collection excludes the admin user and orders newest first', function () {
    User::factory()->create(); // id 1 => admin, excluded like the dashboard
    $a = User::factory()->create();
    $b = User::factory()->create();

    $ids = (new UsersExport())->collection()->pluck('id')->all();

    expect($ids)->toBe([$b->id, $a->id]);
});

test('export search normalizes arabic digits like the dashboard', function () {
    User::factory()->create();
    $match = User::factory()->create(['mobile' => 96555123]);
    User::factory()->create(['mobile' => 12345678]);

    $ids = (new UsersExport(search: '٩٦٥٥٥'))->collection()->pluck('id')->all();

    expect($ids)->toBe([$match->id]);
});

test('login period bounds are inclusive, matching the dashboard filter', function () {
    User::factory()->create();
    $onStart = User::factory()->create(['last_login_at' => '2026-07-01 00:00:00']);
    $onEnd = User::factory()->create(['last_login_at' => '2026-07-06 00:00:00']);
    User::factory()->create(['last_login_at' => '2026-06-30 23:59:59']);
    User::factory()->create(['last_login_at' => '2026-07-06 00:00:01']);
    User::factory()->create(['last_login_at' => null]);

    $export = new UsersExport(
        start: Carbon::parse('2026-07-01T00:00:00.000Z'),
        end: Carbon::parse('2026-07-06T00:00:00.000Z'),
        loginFilter: true,
    );

    expect($export->collection()->pluck('id')->all())->toBe([$onEnd->id, $onStart->id]);
});

test('export rows format dates in the given timezone and localize never logged in', function () {
    $user = User::factory()->make([
        'first_name' => 'Ali',
        'last_name' => 'Hassan',
        'last_login_at' => '2026-07-05 10:00:00',
    ]);
    $user->created_at = Carbon::parse('2026-07-01 08:30:00');
    $user->updated_at = Carbon::parse('2026-07-02 20:15:00');

    $row = (new UsersExport(timezone: 'Asia/Kuwait'))->map($user);

    expect($row[1])->toBe('Ali Hassan')
        ->and($row[6])->toBe('01/07/2026 - 11:30 AM')
        ->and($row[7])->toBe('02/07/2026 - 11:15 PM')
        ->and($row[8])->toBe('05/07/2026 - 01:00 PM');

    $neverLogged = User::factory()->make(['last_login_at' => null]);
    $rowEn = (new UsersExport())->map($neverLogged);
    $rowAr = (new UsersExport(locale: 'ar'))->map($neverLogged);

    expect($rowEn[8])->toBe('Never logged in')
        ->and($rowAr[8])->toBe('لم يسجل الدخول بعد');
});

test('formula-like values are neutralized in the generated spreadsheet', function () {
    User::factory()->create(); // id 1 => admin, excluded
    User::factory()->create([
        'first_name' => '=HYPERLINK("https://evil.test","click")',
        'last_name' => 'Inject',
        'mobile' => '9999999999999999',
    ]);

    $raw = Excel::raw(new UsersExport(), \Maatwebsite\Excel\Excel::XLSX);
    $path = tempnam(sys_get_temp_dir(), 'export') . '.xlsx';
    file_put_contents($path, $raw);
    $sheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($path)->getActiveSheet();
    unlink($path);

    // Row 1 = title, row 2 = headings, row 3 = first data row; column B = full_name
    $cell = $sheet->getCell('B3');
    expect($cell->getDataType())->toBe(\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING)
        ->and($cell->getValue())->toStartWith('=HYPERLINK');

    // Mobile stays text: a numeric cell would lose digits past Excel's 15-digit limit
    $mobile = $sheet->getCell('C3');
    expect($mobile->getDataType())->toBe(\PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING)
        ->and($mobile->getValue())->toBe('9999999999999999');
});

test('headings include a localized title row and column labels', function () {
    $en = (new UsersExport())->headings();
    $ar = (new UsersExport(locale: 'ar'))->headings();

    expect($en)->toHaveCount(2)
        ->and($en[0])->toBe(['Users'])
        ->and($en[1][1])->toBe('Full name')
        ->and($ar[0])->toBe(['المستخدمين'])
        ->and($ar[1][1])->toBe('الاسم بالكامل');

    expect((new UsersExport())->title())->toBe('Users')
        ->and((new UsersExport(locale: 'ar'))->title())->toBe('المستخدمين');
});

test('a period row is added when a login period is selected', function () {
    expect((new UsersExport())->periodLine())->toBeNull()
        ->and((new UsersExport(period: 'today'))->periodLine())->toBe('Login period: Today')
        ->and((new UsersExport(period: '7d'))->periodLine())->toBe('Login period: Last 7 days')
        ->and((new UsersExport(period: '30d', locale: 'ar'))->periodLine())->toBe('فترة تسجيل الدخول: آخر ٣٠ يوم')
        ->and((new UsersExport(period: 'custom', from: '2026-07-01', to: '2026-07-06'))->periodLine())
        ->toBe('Login period: From 01/07/2026 to 06/07/2026')
        ->and((new UsersExport(period: 'custom', from: '2026-07-01', to: '2026-07-06', locale: 'ar'))->periodLine())
        ->toBe('فترة تسجيل الدخول: من 01/07/2026 إلى 06/07/2026')
        ->and((new UsersExport(period: 'custom', from: '2026-07-01'))->periodLine())
        ->toBe('Login period: From 01/07/2026')
        ->and((new UsersExport(period: 'custom'))->periodLine())->toBe('Login period: Custom range');

    $withPeriod = (new UsersExport(period: 'today'))->headings();
    expect($withPeriod)->toHaveCount(3)
        ->and($withPeriod[1])->toBe(['Login period: Today']);
});
