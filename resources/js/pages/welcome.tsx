import AppFrontHeader from '@/components/AppFrontHeader';
import UserCard from '@/components/UserCard';
import { getImage } from '@/constants';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ({ auth }: SharedData) {
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
            <Head title="معهد سترايف">
                <meta name="description" content={'معهد سترايف التعليمي'} />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <AppFrontHeader />
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[400px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex flex-1 flex-col items-center justify-center space-y-6 bg-white text-[13px] lg:px-20 lg:pt-0 dark:bg-transparent dark:text-white">
                            <img src={getImage('choose_right.jpeg')} className="h-auto w-40 rounded-lg border border-gray-200 object-cover" />
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]"></p>
                            {auth.user && !auth.user?.is_admin ? (
                                <UserCard user={auth.user} />
                            ) : (
                                <Link href={route('register')} target="_blank" className="btn-default px-4 text-xl">
                                    {auth?.user?.is_admin ? 'لوحة التحكم' : ' امسح الكود للتسجيل مباشرة'}
                                </Link>
                            )}
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden bg-transparent lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[400px]">
                            {qr && <div dangerouslySetInnerHTML={{ __html: qr }} className="flex h-full w-full" />}
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
