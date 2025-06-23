<?php

namespace App\Http\Requests\Settings;

use App\Enums\AcademicInterestEnum;
use App\Enums\StageEnum;
use App\Enums\UserTypeEnum;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255', 'min:4'],
            'last_name' => ['nullable', 'string', 'max:255', 'min:4', 'max:255'],
            'email' => [
                'nullable',
                'string',
                'lowercase',
                'email',
                'max:255',

            ],
            'mobile' => ['required', 'min:6', 'regex:/[0-9]/', 'max:16', Rule::unique(User::class)->ignore($this->user()->id),],
            'type' => ['nullable', 'string', Rule::in(UserTypeEnum::cases())],
            'stage' => ['nullable', 'string', Rule::in(StageEnum::cases())],
            'academic_interest' => ['nullable', 'string', Rule::in(AcademicInterestEnum::cases())],

        ];
    }
}
