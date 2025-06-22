<?php

namespace App\Enums;

enum UserTypeEnum: string
{
    case STUDENT = 'طالب';
    case PARENT = 'ولي أمر';


    // extra helper to allow for greater customization of displayed values, without disclosing the name/value data directly
    public function label(): string
    {
        return match ($this) {
            static::STUDENT => 'طالب',
            static::PARENT => 'ولي أمر',
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
