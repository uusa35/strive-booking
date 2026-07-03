<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Apply the session-selected locale (defaults to Arabic).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get('locale', 'ar');
        app()->setLocale(in_array($locale, ['en', 'ar']) ? $locale : 'ar');

        return $next($request);
    }
}
