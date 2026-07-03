import { Button } from '@/components/ui/button';
import { useTrans } from '@/lib/i18n';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher({ className }: { className?: string }) {
    const { locale, setLocale } = useTrans();
    return (
        <Button type="button" variant="ghost" size="sm" className={className} onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}>
            <Languages className="h-4 w-4" />
            <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
        </Button>
    );
}
