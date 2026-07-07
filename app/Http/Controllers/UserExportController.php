<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Facades\Excel;

class UserExportController extends Controller
{
    public function __invoke(Request $request)
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'start' => ['nullable', 'date'],
            'end' => ['nullable', 'date'],
            'login_filter' => ['nullable', 'boolean'],
            'tz' => ['nullable', 'timezone:all'],
            'period' => ['nullable', 'in:today,7d,30d,custom'],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $export = new UsersExport(
            search: $validated['q'] ?? null,
            start: isset($validated['start']) ? Carbon::parse($validated['start']) : null,
            end: isset($validated['end']) ? Carbon::parse($validated['end']) : null,
            loginFilter: (bool) ($validated['login_filter'] ?? false),
            timezone: $validated['tz'] ?? config('app.timezone'),
            locale: app()->getLocale(),
            period: $validated['period'] ?? null,
            from: $validated['from'] ?? null,
            to: $validated['to'] ?? null,
        );

        return Excel::download($export, 'users-' . now()->format('Y-m-d_His') . '.xlsx');
    }
}
