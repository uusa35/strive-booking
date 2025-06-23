<?php

namespace App\Http\Controllers\Auth;

use App\Enums\AcademicInterestEnum;
use App\Enums\StageEnum;
use App\Enums\UserTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $types =  collect(UserTypeEnum::cases())->pluck('value');
        $stages =  collect(StageEnum::cases())->pluck('value');
        $interests =  collect(AcademicInterestEnum::cases())->pluck('value');
        return Inertia::render('auth/register', compact('types', 'stages', 'interests'));
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|string|lowercase|email',
            'mobile' => 'required|min:8|max:16|regex:/[0-9]/|unique:users,mobile',
            'type' => ['nullable', 'string', Rule::in(UserTypeEnum::cases())],
            'stage' => ['nullable', 'string', Rule::in(StageEnum::cases())],
            'academic_interest' => ['nullable', 'string', Rule::in(AcademicInterestEnum::cases())],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'mobile' => $request->mobile,
            'email' => $request->email,
            'type' => $request->type,
            'academic_interest' => $request->academic_interest,
            'stage' => $request->stage,
            'password' => Hash::make($request->password),
            'email_verified_at' => now()
        ]);
        if ($request->email) {
            event(new Registered($user));
        }
        Auth::login($user);
        if ($user->is_admin) {
            return redirect()->intended(route('dashboard', absolute: false));
        }
        return redirect()->intended(route('home', absolute: false));
    }
}
