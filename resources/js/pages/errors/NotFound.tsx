import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTrans } from '@/lib/i18n';
import { Head, Link } from '@inertiajs/react';
import { UserRoundCheck } from 'lucide-react';

export default function (props: any) {
    const { t } = useTrans();
    return (
        <>
            <Head title={t('my_ticket')} />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl"></header>
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[400px] flex-col items-center justify-center gap-6 lg:max-w-xl">
                        <Link href={route('home')}>{t('back_home')}</Link>
                        {props.title && (
                            <Alert variant="default" className="w-full gap-y-4 bg-red-600 text-white">
                                <UserRoundCheck className="size-12" />
                                <AlertTitle>{t('not_found_title')}</AlertTitle>
                                <AlertDescription className="text-white">{t('invalid_info')}</AlertDescription>
                            </Alert>
                        )}
                        <img src="/images/not_found.png" className="h-auto w-full" />
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
