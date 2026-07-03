import ar from '@/lang/ar.json';
import en from '@/lang/en.json';
import { router, usePage } from '@inertiajs/react';

export type Locale = 'en' | 'ar';

const dictionaries: Record<Locale, Record<string, string>> = { en, ar };

export function useTrans() {
    const { locale = 'ar' } = usePage().props as unknown as { locale?: Locale };

    const t = (key: string): string => dictionaries[locale]?.[key] ?? dictionaries.ar[key] ?? key;

    const setLocale = (next: Locale) => {
        if (next === locale) return;
        router.post(
            route('locale.set'),
            { locale: next },
            {
                preserveScroll: true,
                onSuccess: () => {
                    document.documentElement.setAttribute('dir', next === 'ar' ? 'rtl' : 'ltr');
                    document.documentElement.setAttribute('lang', next);
                },
            },
        );
    };

    return { t, locale, isRtl: locale === 'ar', setLocale };
}
