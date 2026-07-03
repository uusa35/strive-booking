import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTrans } from '@/lib/i18n';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function () {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTrans();
    return (
        <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
            <nav className="flex items-center justify-center gap-4">
                {auth.user ? (
                    <>
                        {auth.user.is_admin ? (
                            <>
                                <Link href={route('dashboard')} className="btn-outlined" prefetch>
                                    {t('dashboard')}
                                </Link>
                                <Link href={route('profile.edit')} className="btn-outlined" prefetch>
                                    {t('account_details')}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('profile.edit')}
                                    className="rounded-md border border-gray-100 p-2 px-3 hover:bg-gray-200 dark:bg-white"
                                >
                                    {t('edit_my_info')}
                                </Link>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="rounded-md border border-gray-100 bg-gray-100 p-2 px-3 hover:bg-gray-300"
                                >
                                    {t('logout')}
                                </Link>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex flex-row gap-x-1 sm:gap-x-2">
                        <Link href={route('login')} className="btn-default text-md sm:text-lg">
                            {t('already_registered')}
                        </Link>
                        <Link href={route('register')} className="btn-default text-md sm:text-lg">
                            {t('register_new_account')}
                        </Link>
                    </div>
                )}
                <LanguageSwitcher />
            </nav>
        </header>
    );
}
