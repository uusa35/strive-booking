import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, Fragment } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { first, map, values } from 'lodash';
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
            onSuccess: () => toast.success('تم التسجيل بنجاح'),
            onError: (e) => toast.error(first(values(e))),
        });
    };

    return (
        <AuthLayout title="إنشاء تذكرة جديدة" description=" إدخل بياناتك لتسجيل تذكرة جديدة">
            <Head title="سجل بياناتك" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="first_name" className="required">
                            الاسم الاول
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
                            placeholder="الاسم الاول"
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="last_name">الاسم الاخير</Label>
                        <Input
                            id="last_name"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            autoComplete="last_name"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            disabled={processing}
                            placeholder="الاسم الاول"
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
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
                        <Label htmlFor="mobile" className="required">
                            رقم الموبايل
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
                            onChange={(e) => setData('mobile', e.target.value)}
                            disabled={processing}
                            placeholder="965xxxxxxx"
                        />
                        <InputError message={errors.mobile} className="mt-2" />
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
                            {map(interests, (t, i) => (
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
                            {map(stages, (t, i) => (
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

                    <div className="grid hidden gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid hidden gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="btn-default mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        حفظ البيانات
                    </Button>
                </div>

                <div className="space-y-3 text-center text-sm text-muted-foreground">
                    <div>تمتلك حساب بالفعل؟</div>
                    <TextLink href={route('login')} tabIndex={6} className="text-balance">
                        إدخل هاتفك لتحميل بياناتك ومشاهدة التذكرة الخاصه بك
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
