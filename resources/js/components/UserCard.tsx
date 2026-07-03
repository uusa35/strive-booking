import { whatsappUrl } from '@/constants';
import { useTrans } from '@/lib/i18n';
import { User } from '@/types';

export default function ({ user }: { user: User }) {
    const { t } = useTrans();
    return (
        <div className="w-full space-y-3">
            <div className="flex flex-row gap-3">
                <div className="w-30 text-teal-800 dark:text-white">{t('full_name')}:</div>
                <div>{user.full_name}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30 text-teal-800 dark:text-white">{t('mobile')}:</div>
                <a href={whatsappUrl(user.mobile)}>{user.mobile}</a>
            </div>
            {user.email && (
                <div className="flex flex-row gap-3">
                    <div className="w-30 text-teal-800 dark:text-white">{t('email')}:</div>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </div>
            )}
            <div className="flex flex-row gap-3">
                <div className="w-30 text-teal-800 dark:text-white">{t('account_type')}:</div>

                <div>{user.type}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30 text-teal-800 dark:text-white">{t('stage')}:</div>

                <div>{user.stage}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30 text-teal-800 dark:text-white">{t('academic_interest')}:</div>

                <div>{user.academic_interest}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30 text-teal-800 dark:text-white">{t('account_serial')}:</div>
                <div>{user.id}</div>
            </div>
        </div>
    );
}
