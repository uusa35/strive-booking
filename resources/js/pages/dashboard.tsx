import { MainDataTable } from '@/components/MainDataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
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
                accessorKey: 'name',
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
                        <div className="sm-text flex max-w-40 flex-col items-start justify-start gap-y-2 truncate capitalize">
                            <div>{`${row.original.first_name} ${row.original.last_name}`}</div>
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
                        <div className="sm-text flex max-w-40 flex-col items-start justify-start gap-y-2 truncate">
                            <div>{row.original.email}</div>
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

            // {
            //     accessorKey: 'actions',
            //     header: () => <div className="!p-0 capitalize">actions</div>,
            //     enableColumnFilter: false,
            //     enableGlobalFilter: false,
            //     enableSorting: false,
            //     cell: ({ row }) => {
            //         const element: any = row.original;
            //         return (
            //             <DropdownMenu>
            //                 <DropdownMenuTrigger asChild>
            //                     <MoreHorizontalIcon className="h-4 w-4 text-gray-600" />
            //                 </DropdownMenuTrigger>
            //             </DropdownMenu>
            //         );
            //     },
            // },
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
