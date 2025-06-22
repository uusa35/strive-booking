import UserCard from '@/components/UserCard';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function () {
    const { auth } = usePage<SharedData>().props;
    const [qr, setQr] = useState<any>(null);
    const cleanup = useMobileNavigation();

    useEffect(() => {
        getQr();
    }, []);

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const getQr = async () =>
        await axios
            .get('/api/qr', { params: { link: auth.user && !auth.user?.is_admin ? route('user.show', auth.user.id) : route('register') } })
            .then((r) => {
                setQr(r.data);
            });

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <>
                                {auth.user.is_admin ? (
                                    <>
                                        <Link href={route('dashboard')} className="btn-outlined">
                                            لوحة التحكم
                                        </Link>
                                        <Link href={route('profile.edit')} className="btn-default">
                                            بيانات الحساب
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('profile.edit')} className="btn-default">
                                            بياناتي
                                        </Link>

                                        <Link method="post" href={route('logout')} as="button" onClick={handleLogout} className="btn-outlined">
                                            تسجيل الخروج
                                        </Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn-default">
                                    مسجل بالفعل
                                </Link>
                                <Link href={route('register')} className="btn-outlined">
                                    إنشاء تذكرة جديدة
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[400px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex flex-1 flex-col items-center justify-center space-y-6 bg-white text-[13px] lg:px-20 lg:pt-0 dark:bg-black dark:text-white dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <img src="images/choose_right.jpeg" className="h-auto w-40 object-cover" />
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]"></p>
                            {auth.user && !auth.user?.is_admin ? (
                                <UserCard user={auth.user} />
                            ) : (
                                <Link href={route('register')} target="_blank" className="btn-default">
                                    {auth?.user?.is_admin ? 'لوحة التحكم' : ' سجل الآن'}
                                </Link>
                            )}
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden bg-transparent lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[400px] dark:bg-[#1D0002]">
                            {qr && <div dangerouslySetInnerHTML={{ __html: qr }} className="flex h-full w-full" />}
                            <div className="absolute inset-0 dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
