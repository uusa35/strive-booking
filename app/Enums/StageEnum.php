<?php

namespace App\Enums;

enum StageEnum: string
{
    case SECONDARY = 'ثانوي';
    case UNIVERSITY = 'جامعي';
    case HIGH = 'دراسات عليا';

    // extra helper to allow for greater customization of displayed values, without disclosing the name/value data directly
    public function label(): string
    {
        return match ($this) {
            static::SECONDARY => 'ثانوي',
            static::UNIVERSITY => 'جامعي',
            static::HIGH => 'دراسات عليا',
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
