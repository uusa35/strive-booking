<?php

namespace App\Enums;

enum AcademicInterestEnum: string
{
    case INSIDE = 'داخل الكويت';
    case OUTSIDE = 'خارج الكويت';


    // extra helper to allow for greater customization of displayed values, without disclosing the name/value data directly
    public function label(): string
    {
        return match ($this) {
            static::INSIDE => 'داخل الكويت',
            static::OUTSIDE => 'خارج الكويت',
        };
    }

    public function keyLabels(): array
    {
        return array_reduce(self::cases(), function ($carry,  $item) {
            $carry[$item->value] = $item->label();
            return $carry;
        }, []);
    }
}
