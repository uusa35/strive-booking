import { MainDataTable } from '@/components/MainDataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Eye } from 'lucide-react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'لوحة التحكم',
        href: '/dashboard',
    },
];

export default function Dashboard({ elements }: { elements: User[] }) {
    const {
        ziggy: { location },
    }: any = usePage().props;
    const columns: ColumnDef<User>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            م
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
                            الاسم بالكامل
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
                            الموبايل
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
                            ايميل
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
                                    لا يوجد
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
                            نوع الحساب
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
                            المرحلة التعليمية
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
                accessorKey: 'view',
                header: ({ column }: any) => {
                    return (
                        <Button variant="ghost" className="!p-0 capitalize" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            التذكرة
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
        [],
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="لوحة التحكم" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <MainDataTable columns={columns} data={elements} resetPath={location} searchable />
            </div>
        </AppLayout>
    );
}
