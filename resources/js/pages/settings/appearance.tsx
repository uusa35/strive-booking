import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import { useTrans } from '@/lib/i18n';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    const { t } = useTrans();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('site_appearance'),
            href: '/settings/appearance',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('site_appearance')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title={t('appearance_title')} description={t('appearance_desc')} />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
