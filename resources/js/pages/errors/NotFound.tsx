import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { UserRoundCheck } from 'lucide-react';

export default function (props: any) {    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
        router.reload();
    };

    return (
        <>
            <Head title="تذكرتي" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl"></header>
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[400px] flex-col items-center justify-center gap-6 lg:max-w-xl">
                        <Link href={route('home')}>العودة للرئيسية</Link>
                        {props.title && (
                            <Alert variant="default" className="w-full gap-y-4 bg-red-600 text-white">
                                <UserRoundCheck className="size-12" />
                                <AlertTitle>{props.title}</AlertTitle>
                                <AlertDescription className="text-white">معلومات غير صحيحة</AlertDescription>
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
