import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { first, map, values } from 'lodash';
import { FormEventHandler, Fragment } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'بياناتي',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    first_name: string;
    last_name: string | undefined;
    email: string | undefined;
    mobile: string;
    type?: string | undefined;
    stage?: string | undefined;
    academic_interest?: string | undefined;
};

export default function Profile({
    mustVerifyEmail,
    status,
    types,
    stages,
    interests,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    types?: string[];
    stages?: string[];
    interests?: string[];
}) {
    const { auth } = usePage<any>().props;
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        first_name: auth.user?.first_name ?? '',
        last_name: auth.user?.last_name ?? '',
        mobile: auth.user.mobile ?? '',
        type: auth.user?.type ?? first(types),
        stage: auth.user?.stage ?? first(stages),
        academic_interest: auth.user?.academic_interest ?? first(interests),
        email: auth.user?.email ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
        setData((values: any) => ({
            ...values,
            [e.target.id]: e.target.value,
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('تم تحديث البيانات بنجاح');
            },
            onError: () => toast.error(first(values(errors))),
            onFinish: () => router.reload({ only: ['auth'] }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="بيانات الحساب" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="معلومات الحساب" description=" يمكنك تحديث معلومات حسابك" />
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="first_name" className="required">
                                الاسم الاول
                            </Label>

                            <Input
                                id="first_name"
                                className="mt-1 block w-full"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                required
                                autoComplete="first_name"
                                placeholder="First name"
                            />

                            <InputError className="mt-2" message={errors.first_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last_name" className="required">
                                الاسم الاخير
                            </Label>

                            <Input
                                id="last_name"
                                className="mt-1 block w-full"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                autoComplete="last_name"
                                placeholder="Last name"
                            />

                            <InputError className="mt-2" message={errors.last_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="mobile" className="required">
                                الموبايل
                            </Label>

                            <Input
                                id="mobile"
                                className="mt-1 block w-full"
                                value={data.mobile}
                                onChange={(e) => setData('mobile', e.target.value)}
                                required
                                autoComplete="mobile"
                                placeholder="Last name"
                            />

                            <InputError className="mt-2" message={errors.last_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">نوع التذكرة</Label>
                            <div className="flex w-auto flex-row gap-4 py-4">
                                {map(types, (t, i) => (
                                    <Fragment key={i}>
                                        <input
                                            name="type"
                                            type="radio"
                                            value={t}
                                            onChange={handleChange}
                                            defaultChecked={data.type === t}
                                            className="text-prime-700 border-prime-300 mx-2 rounded-full border bg-white"
                                        />
                                        <span>{t}</span>
                                    </Fragment>
                                ))}
                            </div>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stage">المرحلة الدراسية</Label>
                            <div className="flex w-auto flex-row gap-4 py-4">
                                {map(stages, (t, i) => (
                                    <Fragment key={i}>
                                        <input
                                            name="stage"
                                            type="radio"
                                            value={t}
                                            onChange={handleChange}
                                            defaultChecked={data.stage === t}
                                            className="text-prime-700 border-prime-300 rounded-full border bg-white"
                                        />
                                        <span>{t}</span>
                                    </Fragment>
                                ))}
                            </div>
                            <InputError message={errors.stage} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="academic_interest">إهتمامك الدراسي</Label>
                            <div className="flex w-auto flex-row gap-4 py-4">
                                {map(interests, (t, i) => (
                                    <Fragment key={i}>
                                        <input
                                            name="academic_interest"
                                            type="radio"
                                            value={t}
                                            onChange={handleChange}
                                            defaultChecked={data.academic_interest === t}
                                            className="text-prime-700 border-prime-300 rounded-full border bg-white"
                                        />
                                        <span>{t}</span>
                                    </Fragment>
                                ))}
                            </div>
                            <InputError message={errors.academic_interest} className="mt-2" />
                        </div>
                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>حفظ البيانات</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">تم تحديث البيانات بنجاح</p>
                            </Transition>
                        </div>
                    </form>
                </div>
                {/* <DeleteUser /> */}
            </SettingsLayout>
        </AppLayout>
    );
}
