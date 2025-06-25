import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function () {
    const { auth } = usePage<SharedData>().props;
    return (
        <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
            <nav className="flex items-center justify-center gap-4">
                {auth.user ? (
                    <>
                        {auth.user.is_admin ? (
                            <>
                                <Link href={route('dashboard')} className="btn-outlined">
                                    لوحة التحكم
                                </Link>
                                <Link href={route('profile.edit')} className="btn-outlined">
                                    بيانات الحساب
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href={route('profile.edit')} className="rounded-md p-2 px-3 dark:bg-white">
                                    بياناتي
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="rounded-md border border-gray-100 bg-gray-100 p-2 px-3 hover:bg-gray-300"
                                >
                                    تسجيل الخروج
                                </Link>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex flex-row gap-x-1 sm:gap-x-2">
                        <Link href={route('login')} className="btn-default text-lg">
                            مسجل بالفعل
                        </Link>
                        <Link href={route('register')} className="btn-default !text-lg">
                            سجل حساب جديد
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
}
