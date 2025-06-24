import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toEn } from '@/constants';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { first, values } from 'lodash';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

type LoginForm = {
    mobile: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        mobile: '',
        password: 'password',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => toast.success('تم الدخول بنجاح'),
            onError: (e) => toast.error(first(values(e))),
        });
    };

    return (
        <AuthLayout title="الدخول لحسابك" description="إدخل رقم هاتفك الآن">
            <Head title="الدخول لحسابك" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">الموبايل</Label>
                        <Input
                            id="mobile"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="mobile"
                            value={data.mobile}
                            onChange={(e) => setData('mobile', toEn(e.target.value))}
                            placeholder="965xxxxxx"
                        />
                        <InputError message={errors.mobile} />
                    </div>
                    <div className="grid hidden gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    نسيت كلة المرور؟
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">تذكرني</Label>
                    </div>

                    <Button type="submit" className="btn-default mt-4 w-full" tabIndex={4} disabled={processing}>
                        <div className="flex flex-row items-center justify-center gap-x-4">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            <div>الدخول للحساب</div>
                        </div>
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    لا تمتلك حساب أو تذكرة
                    <TextLink href={route('register')} tabIndex={5} className="mx-2">
                        سجل الآن
                    </TextLink>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    <TextLink href={route('home')} tabIndex={5} className="mx-2">
                        العودة للرئيسية
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
