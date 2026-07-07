<?php

namespace App\Exports;

use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithCustomValueBinder;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Cell\Cell;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Cell\DefaultValueBinder;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UsersExport extends DefaultValueBinder implements FromCollection, WithHeadings, WithMapping, WithTitle, ShouldAutoSize, WithColumnFormatting, WithCustomValueBinder, WithStyles
{
    // Mirrors the labels in resources/js/lang/{en,ar}.json (no server-side lang dir exists)
    private const LABELS = [
        'en' => [
            'title' => 'Users',
            'headings' => ['#', 'Full name', 'Mobile', 'Email', 'Account type', 'Educational stage', 'Created at', 'Modified at', 'Last login'],
            'never_logged_in' => 'Never logged in',
            'login_period' => 'Login period',
            'today' => 'Today',
            '7d' => 'Last 7 days',
            '30d' => 'Last 30 days',
            'custom_range' => 'Custom range',
            'from' => 'From',
            'to' => 'To',
        ],
        'ar' => [
            'title' => 'المستخدمين',
            'headings' => ['م', 'الاسم بالكامل', 'الموبايل', 'ايميل', 'نوع الحساب', 'المرحلة التعليمية', 'تاريخ التسجيل', 'آخر تعديل', 'آخر دخول'],
            'never_logged_in' => 'لم يسجل الدخول بعد',
            'login_period' => 'فترة تسجيل الدخول',
            'today' => 'اليوم',
            '7d' => 'آخر ٧ أيام',
            '30d' => 'آخر ٣٠ يوم',
            'custom_range' => 'فترة مخصصة',
            'from' => 'من',
            'to' => 'إلى',
        ],
    ];

    public function __construct(
        private ?string $search = null,
        private ?CarbonInterface $start = null,
        private ?CarbonInterface $end = null,
        private bool $loginFilter = false,
        private string $timezone = 'UTC',
        private string $locale = 'en',
        private ?string $period = null,
        private ?string $from = null,
        private ?string $to = null,
    ) {}

    /**
     * Mirrors the client-side filter in resources/js/pages/dashboard.tsx:
     * same base query as the dashboard route, search over the same haystack,
     * and epoch comparison against the client-computed period bounds.
     */
    public function collection(): Collection
    {
        $q = mb_strtolower(trim($this->normalizeDigits($this->search ?? '')));

        return User::where('id', '!=', 1)
            ->orderByDesc('id')
            ->get()
            ->filter(function (User $user) use ($q) {
                if ($q !== '') {
                    $haystack = mb_strtolower(implode(' ', [
                        $user->full_name,
                        $user->first_name,
                        $user->last_name,
                        $user->mobile,
                        $user->email,
                    ]));
                    if (!str_contains($haystack, $q)) {
                        return false;
                    }
                }
                if (!$this->loginFilter) {
                    return true;
                }
                if (!$user->last_login_at) {
                    return false;
                }
                $loggedAt = $user->last_login_at->getTimestamp();
                if ($this->start && $loggedAt < $this->start->getTimestamp()) {
                    return false;
                }
                if ($this->end && $loggedAt > $this->end->getTimestamp()) {
                    return false;
                }

                return true;
            })
            ->values();
    }

    /**
     * Formula-injection guard: user-controlled values (names, email, mobile)
     * starting with =, +, -, @, tab or CR are bound as literal strings so
     * Excel never evaluates them. Column C (mobile) is always bound as text —
     * numeric binding would corrupt mobiles longer than Excel's 15 significant digits.
     */
    public function bindValue(Cell $cell, $value)
    {
        if (is_string($value) && ($cell->getColumn() === 'C' || preg_match('/^[=+\-@\t\r]/', $value))) {
            $cell->setValueExplicit($value, DataType::TYPE_STRING);

            return true;
        }

        return parent::bindValue($cell, $value);
    }

    public function title(): string
    {
        return $this->labels()['title'];
    }

    public function headings(): array
    {
        $rows = [[$this->labels()['title']]];
        if ($line = $this->periodLine()) {
            $rows[] = [$line];
        }
        $rows[] = $this->labels()['headings'];

        return $rows;
    }

    public function periodLine(): ?string
    {
        if (!$this->period) {
            return null;
        }
        $labels = $this->labels();
        $value = match ($this->period) {
            'today', '7d', '30d' => $labels[$this->period],
            'custom' => $this->customRangeLine($labels),
            default => null,
        };

        return $value === null ? null : $labels['login_period'] . ': ' . $value;
    }

    /**
     * @param  User  $user
     */
    public function map($user): array
    {
        return [
            $user->id,
            $user->full_name,
            (string) $user->mobile,
            (string) ($user->email ?? ''),
            $this->stringify($user->type),
            $this->stringify($user->stage),
            $this->formatDate($user->created_at),
            $this->formatDate($user->updated_at),
            $user->last_login_at ? $this->formatDate($user->last_login_at) : $this->labels()['never_logged_in'],
        ];
    }

    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_TEXT,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        if ($this->locale === 'ar') {
            $sheet->setRightToLeft(true);
        }

        $lastColumn = Coordinate::stringFromColumnIndex(count($this->labels()['headings']));
        $hasPeriodRow = $this->periodLine() !== null;
        $headingRow = $hasPeriodRow ? 3 : 2;

        $sheet->mergeCells("A1:{$lastColumn}1");
        if ($hasPeriodRow) {
            $sheet->mergeCells("A2:{$lastColumn}2");
        }

        $styles = [
            1 => [
                'font' => ['bold' => true, 'size' => 14],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
            $headingRow => ['font' => ['bold' => true]],
        ];
        if ($hasPeriodRow) {
            $styles[2] = [
                'font' => ['italic' => true],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ];
        }

        return $styles;
    }

    private function customRangeLine(array $labels): string
    {
        $from = $this->from ? Carbon::parse($this->from)->format('d/m/Y') : null;
        $to = $this->to ? Carbon::parse($this->to)->format('d/m/Y') : null;

        return match (true) {
            $from && $to => $labels['from'] . ' ' . $from . ' ' . mb_strtolower($labels['to']) . ' ' . $to,
            (bool) $from => $labels['from'] . ' ' . $from,
            (bool) $to => $labels['to'] . ' ' . $to,
            default => $labels['custom_range'],
        };
    }

    private function stringify(mixed $value): string
    {
        if ($value instanceof \BackedEnum) {
            return (string) $value->value;
        }
        if ($value instanceof \UnitEnum) {
            return $value->name;
        }

        return (string) ($value ?? '');
    }

    private function labels(): array
    {
        return self::LABELS[$this->locale] ?? self::LABELS['en'];
    }

    // Same digit normalization as toEn() in resources/js/constants.ts
    private function normalizeDigits(string $value): string
    {
        return strtr($value, [
            '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
            '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
            '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4',
            '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
        ]);
    }

    private function formatDate(?CarbonInterface $value): string
    {
        if (!$value) {
            return '';
        }

        // Same format as formatDateTime() in resources/js/constants.ts, in the admin's browser timezone
        return $value->copy()->setTimezone($this->timezone)->format('d/m/Y - h:i A');
    }
}
