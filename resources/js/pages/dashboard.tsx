import { MainDataTable } from '@/components/MainDataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateTime } from '@/constants';
import AppLayout from '@/layouts/app-layout';
import { useTrans } from '@/lib/i18n';
import { User, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
    ArrowUpDown,
    CalendarArrowDown,
    CalendarArrowUp,
    CalendarCheck,
    CalendarClock,
    CalendarDays,
    CalendarRange,
    Eye,
    ListFilter,
    UserCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Period = 'all' | 'today' | '7d' | '30d' | 'custom';

export default function Dashboard({ elements }: { elements: User[] }) {
    const {
        ziggy: { location },
    }: any = usePage().props;
    const { t, locale } = useTrans();
    const [period, setPeriod] = useState<Period>('all');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('dashboard'),
            href: '/dashboard',
        },
    ];
    const filtered = useMemo(() => {
        const users = elements ?? [];
        if (period === 'all') return users;
        const now = new Date();
        let start: Date | null = null;
        let end: Date | null = null;
        if (period === 'today') {
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
        } else if (period === '7d') {
            start = new Date(now.getTime() - 7 * 86400000);
        } else if (period === '30d') {
            start = new Date(now.getTime() - 30 * 86400000);
        } else {
            start = from ? new Date(from) : null;
            end = to ? new Date(`${to}T23:59:59`) : null;
        }
        return users.filter((u) => {
            if (!u.last_login_at) return false;
            const loggedAt = new Date(u.last_login_at);
            if (start && loggedAt < start) return false;
            if (end && loggedAt > end) return false;
            return true;
        });
    }, [elements, period, from, to]);
    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('id')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="flex flex-row items-center justify-start">
                            <div className="text-xxs truncate px-2">{row.original.id}</div>
                            <div></div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'full_name',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('full_name')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="sm-text flex max-w-60 flex-col items-start justify-start gap-y-2 truncate capitalize">
                            <div>{`${row.original.full_name} `}</div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'mobile',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('mobile')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="sm-text flex max-w-40 flex-col items-start justify-start gap-y-2 truncate capitalize">
                            <div>{row.original.mobile}</div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'email',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('email')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="sm-text flex max-w-60 flex-col items-start justify-start gap-y-2 truncate">
                            {row.original.email ? (
                                <div>{row.original.email}</div>
                            ) : (
                                <Badge variant="secondary" className="rounded-lg px-4">
                                    {t('not_available')}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'type',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('account_type')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="sm-text flex max-w-40 flex-col items-start justify-start gap-y-2 truncate capitalize">
                            <div>{row.original.type}</div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'stage',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('stage')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="sm-text flex max-w-40 flex-col items-start justify-start gap-y-2 truncate capitalize">
                            <div>{row.original.stage}</div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'created_at',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('created_at')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return <div className="sm-text max-w-40 truncate" dir="ltr">{formatDateTime(row.original.created_at)}</div>;
                },
            },
            {
                accessorKey: 'updated_at',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('updated_at')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return <div className="sm-text max-w-40 truncate" dir="ltr">{formatDateTime(row.original.updated_at)}</div>;
                },
            },
            {
                accessorKey: 'last_login_at',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('last_login_at')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <div className="sm-text max-w-40 truncate">
                            {row.original.last_login_at ? (
                                <span dir="ltr">{formatDateTime(row.original.last_login_at)}</span>
                            ) : (
                                <Badge variant="secondary" className="rounded-lg px-4">
                                    {t('never_logged_in')}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'view',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            {t('ticket')}
                            <ArrowUpDown className="mx-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }: any) => {
                    return (
                        <Link
                            prefetch
                            cacheFor={500}
                            href={route('user.show', row.original.id)}
                            className="sm-text flex max-w-40 flex-col items-start justify-start gap-y-2 truncate capitalize"
                        >
                            <Eye className="size-6 text-gray-600 dark:text-gray-200" />
                        </Link>
                    );
                },
            },
        ],
        [locale],
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3 rounded-2xl border border-gray-200 bg-gray-50/60 p-4 dark:border-gray-700 dark:bg-gray-800/40">
                    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
                        <div className="flex flex-col gap-y-1.5">
                            <Label className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                                <ListFilter className="h-3.5 w-3.5" />
                                {t('login_period')}
                            </Label>
                            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
                                <SelectTrigger className="h-11 w-[200px] rounded-xl bg-white dark:bg-gray-900">
                                    <div className="flex items-center gap-x-2">
                                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder={t('login_period')} />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        <div className="flex items-center gap-x-2">
                                            <ListFilter className="h-4 w-4 text-muted-foreground" />
                                            {t('all')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="today">
                                        <div className="flex items-center gap-x-2">
                                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                                            {t('today')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="7d">
                                        <div className="flex items-center gap-x-2">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            {t('last_7_days')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="30d">
                                        <div className="flex items-center gap-x-2">
                                            <CalendarRange className="h-4 w-4 text-muted-foreground" />
                                            {t('last_30_days')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="custom">
                                        <div className="flex items-center gap-x-2">
                                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                            {t('custom_range')}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {period === 'custom' && (
                            <>
                                <div className="flex flex-col gap-y-1.5">
                                    <Label htmlFor="login-from" className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                                        <CalendarArrowDown className="h-3.5 w-3.5" />
                                        {t('from')}
                                    </Label>
                                    <Input
                                        id="login-from"
                                        type="date"
                                        className="h-11 w-[170px] rounded-xl bg-white dark:bg-gray-900"
                                        value={from}
                                        max={to || undefined}
                                        onChange={(e) => setFrom(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-y-1.5">
                                    <Label htmlFor="login-to" className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                                        <CalendarArrowUp className="h-3.5 w-3.5" />
                                        {t('to')}
                                    </Label>
                                    <Input
                                        id="login-to"
                                        type="date"
                                        className="h-11 w-[170px] rounded-xl bg-white dark:bg-gray-900"
                                        value={to}
                                        min={from || undefined}
                                        onChange={(e) => setTo(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    {period !== 'all' && (
                        <Badge className="flex h-11 items-center gap-x-2 rounded-xl border border-teal-200 bg-teal-50 px-4 text-sm text-teal-800 dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-200">
                            <UserCheck className="h-4 w-4" />
                            <span className="text-base font-semibold tabular-nums">{filtered.length}</span>
                            {t('users_logged_in_period')}
                        </Badge>
                    )}
                </div>
                <MainDataTable columns={columns} data={filtered} resetPath={location} searchable />
            </div>
        </AppLayout>
    );
}
