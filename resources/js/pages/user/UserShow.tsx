import AppFrontHeader from '@/components/AppFrontHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import UserCard from '@/components/UserCard';
import { getImage } from '@/constants';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { UserRoundCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ({ user }: { user: User }) {
    const [qr, setQr] = useState<any>(null);

    useEffect(() => {
        getQr();
    }, [user?.id]);

    const getQr = async () =>
        await axios.get('/api/qr', { params: { link: route('user.show', user.id) } }).then((r) => {
            setQr(r.data);
        });

    return (
        <>
            <Head title="معهد سترايف - بيانات المستخدم">
                <meta name="description" content={'معهد سترايف التعليمي'} />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <AppFrontHeader />
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[400px] flex-col-reverse">
                        <div className="mt-4 flex flex-col items-center justify-center space-y-6 bg-white text-[13px] dark:bg-transparent dark:text-white">
                            {user && (
                                <Alert variant="default" className="w-full gap-y-2 bg-green-600 text-white">
                                    <UserRoundCheck className="size-12" />
                                    <AlertTitle>المستخدم مسجل لدينا بالفعل</AlertTitle>
                                    <AlertDescription className="text-white">بيانات هذا المستخدم مسجلة بالنظام بطريقة صحيحة</AlertDescription>
                                </Alert>
                            )}
                            <img src={getImage('choose_right.jpeg')} className="h-auto w-40 object-cover" />
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]"></p>
                            {user ? (
                                <UserCard user={user} />
                            ) : (
                                <Link
                                    href={route('register')}
                                    target="_blank"
                                    className="inline-block rounded-sm border border-teal-400 bg-teal-600 px-5 py-1.5 text-sm leading-normal text-white hover:border-teal-400 hover:bg-teal-900 dark:border-teal-400 dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                >
                                    سجل الآن
                                </Link>
                            )}
                        </div>
                        <div className="relative flex aspect-[150/100] w-full items-center justify-center bg-transparent lg:aspect-auto">
                            {qr && <div dangerouslySetInnerHTML={{ __html: qr }} className="flex h-auto w-full items-center justify-center" />}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
