import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toEn } from '@/constants';
import AuthLayout from '@/layouts/auth-layout';
import { useTrans } from '@/lib/i18n';
import { Head, useForm } from '@inertiajs/react';
import { first, map, values } from 'lodash';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, Fragment } from 'react';
import { toast } from 'sonner';

type RegisterForm = {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    type?: string;
    stage?: string;
    academic_interest?: string;
    password: string;
    password_confirmation: string;
};

export default function Register({ types, stages, interests }: any) {
    const { t } = useTrans();
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        first_name: '',
        last_name: '',
        email: '',
        mobile: '',
        type: first(types),
        stage: first(stages),
        academic_interest: first(interests),
        password: 'password',
        password_confirmation: 'password',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void => {
        setData((values: any) => ({
            ...values,
            [e.target.id]: e.target.value,
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onSuccess: () => toast.success(t('register_success')),
            onError: (e) => toast.error(first(values(e))),
        });
    };

    return (
        <AuthLayout title={t('create_new_ticket')} description="">
            <Head title={t('register_your_info')} />
            <form className="flex flex-col gap-3" onSubmit={submit}>
                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="first_name" className="required">
                            {t('first_name')}
                        </Label>
                        <Input
                            id="first_name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="first_name"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            disabled={processing}
                            placeholder={t('first_name')}
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>
                    <div className="grid hidden gap-2">
                        <Label htmlFor="last_name">{t('last_name')}</Label>
                        <Input
                            id="last_name"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            autoComplete="last_name"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            disabled={processing}
                            placeholder={t('last_name')}
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mobile" className="required">
                            {t('mobile_number')}
                        </Label>
                        <Input
                            id="mobile"
                            type="number"
                            required
                            autoFocus
                            minLength={6}
                            tabIndex={1}
                            autoComplete="mobile"
                            value={data.mobile}
                            onChange={(e) => setData('mobile', toEn(e.target.value))}
                            disabled={processing}
                            placeholder="965xxxxxxx"
                        />
                        <InputError message={errors.mobile} className="mt-2" />
                    </div>
                    <div className="grid hidden gap-2">
                        <Label htmlFor="email">{t('email_address')}</Label>
                        <Input
                            id="email"
                            type="email"
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="type">{t('ticket_type')}</Label>
                        <div className="flex w-auto flex-row gap-4 py-4">
                            {map(types, (t, i) => (
                                <Fragment key={i}>
                                    <input
                                        name="type"
                                        type="radio"
                                        value={t}
                                        onChange={() => setData('type', t)}
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
                        <Label htmlFor="stage">{t('study_stage')}</Label>
                        <div className="flex w-auto flex-row gap-4 py-4">
                            {map(stages, (t, i) => (
                                <Fragment key={i}>
                                    <input
                                        name="stage"
                                        type="radio"
                                        value={t}
                                        onChange={() => setData('stage', t)}
                                        defaultChecked={data.stage === t}
                                        className="text-prime-700 border-prime-300 rounded-full border bg-white"
                                    />
                                    <span>{t}</span>
                                </Fragment>
                            ))}
                        </div>
                        <InputError message={errors.academic_interest} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="academic_interest">{t('academic_interest')}</Label>
                        <div className="flex w-auto flex-row gap-4 py-4">
                            {map(interests, (t, i) => (
                                <Fragment key={i}>
                                    <input
                                        name="academic_interest"
                                        type="radio"
                                        value={t}
                                        onChange={() => setData('academic_interest', t)}
                                        defaultChecked={data.academic_interest === t}
                                        className="text-prime-700 border-prime-300 rounded-full border bg-white"
                                    />
                                    <span>{t}</span>
                                </Fragment>
                            ))}
                        </div>
                        <InputError message={errors.academic_interest} className="mt-2" />
                    </div>

                    <div className="grid hidden gap-2">
                        <Label htmlFor="password">{t('password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder={t('password')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid hidden gap-2">
                        <Label htmlFor="password_confirmation">{t('confirm_password')}</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder={t('confirm_password')}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="btn-default mt-2 w-full" tabIndex={5} disabled={processing}>
                        <div className="flex flex-row items-center justify-center gap-x-4">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            <div>{t('save_data')}</div>
                        </div>
                    </Button>
                </div>

                <div className="space-y-3 text-center text-sm text-muted-foreground">
                    <div>{t('already_have_account')}</div>
                    <TextLink href={route('login')} tabIndex={6} className="text-balance">
                        {t('enter_phone_to_load')}
                    </TextLink>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    <TextLink href={route('home')} tabIndex={5} className="mx-2">
                        {t('back_home')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
