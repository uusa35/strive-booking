import AppFrontHeader from '@/components/AppFrontHeader';
import UserCard from '@/components/UserCard';
import { getImage } from '@/constants';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTrans } from '@/lib/i18n';
import { type SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ({ auth }: SharedData) {
    const { t } = useTrans();
    const [qr, setQr] = useState<any>(null);
    const cleanup = useMobileNavigation();

    useEffect(() => {
        getQr();
    }, [auth.user?.id]);

    const handleLogout = () => {
        cleanup();
        router.flushAll();
        router.reload();
    };

    const getQr = async () =>
        await axios
            .get('/api/qr', { params: { link: auth.user && !auth.user?.is_admin ? route('user.show', auth.user.id) : route('register') } })
            .then((r) => {
                setQr(r.data);
            });

    return (
        <>
            <Head title={t('strive_institute')}>
                <meta name="description" content={t('strive_institute_desc')} />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-4 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <AppFrontHeader />
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[400px] flex-col-reverse">
                        <div className="mt-2 flex flex-col items-center justify-center space-y-3 bg-white text-[13px] sm:mt-4 sm:space-y-6 dark:bg-transparent dark:text-white">
                            <img
                                src={getImage('choose_right.jpeg')}
                                className="h-auto w-28 rounded-lg border border-gray-200 object-cover sm:w-40"
                            />
                            {auth.user && !auth.user?.is_admin ? (
                                <UserCard user={auth.user} />
                            ) : (
                                <Link href={route('register')} target="_blank" className="btn-default px-4 text-lg sm:text-xl">
                                    {auth?.user?.is_admin ? t('dashboard') : t('scan_to_register')}
                                </Link>
                            )}
                        </div>
                        <div className="relative flex w-full items-center justify-center bg-transparent">
                            {qr && (
                                <div
                                    dangerouslySetInnerHTML={{ __html: qr }}
                                    className="flex w-full max-w-[290px] items-center justify-center [&>svg]:h-auto [&>svg]:w-full sm:max-w-[360px]"
                                />
                            )}
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
