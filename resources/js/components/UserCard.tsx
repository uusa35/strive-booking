import { whatsappUrl } from '@/constants';
import { User } from '@/types';

export default function ({ user }: { user: User }) {
    return (
        <div className="w-full space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-30 text-teal-800 dark:text-white">الاسم بالكامل:</div>
                <div>{user.full_name}</div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-30 text-teal-800 dark:text-white">الموبايل:</div>
                <a href={whatsappUrl(user.mobile)}>{user.mobile}</a>
            </div>
            {user.email && (
                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="w-30 text-teal-800 dark:text-white">الايميل:</div>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-30 text-teal-800 dark:text-white">نوع الحساب:</div>

                <div>{user.type}</div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-30 text-teal-800 dark:text-white">المرحلة التعليمية:</div>

                <div>{user.academic_interest}</div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-30 text-teal-800 dark:text-white">اهتمامك الدراسي:</div>

                <div>{user.stage}</div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-30 text-teal-800 dark:text-white"> مسلسل الحساب:</div>
                <div>{user.id}</div>
            </div>
        </div>
    );
}
