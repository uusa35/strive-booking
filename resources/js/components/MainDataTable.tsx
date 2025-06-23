import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowPathIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Deferred, Link } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { capitalize, toNumber } from 'lodash';
import { ArrowLeft, LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { getImage, isLocal, toEn } from './../constants';
import TextInput from './TextInput';
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    resetPath?: string;
    invisible?: { [key: string]: boolean };
    searchable?: boolean;
}

export function MainDataTable<TData, TValue>({
    columns,
    data,
    resetPath,
    invisible = { desription: false },
    searchable = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(invisible);
    const [gFilter, setGlobalFilter] = useState<string>('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 12,
    });

    const table = useReactTable({
        data,
        columns,
        initialState: {
            columnVisibility,
        },
        enableHiding: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            globalFilter: gFilter,
            pagination,
            columnVisibility,
        },
        debugTable: isLocal,
        debugHeaders: isLocal,
        debugColumns: isLocal,
        enableColumnResizing: true,
    });

    return (
        <div className="flex w-full flex-col gap-y-6">
            {searchable && (
                <div className="flex w-full items-center justify-end gap-x-3">
                    <div className="relative mt-2 w-[300px] rounded-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                        <TextInput
                            placeholder={`${capitalize('search')}..`}
                            value={gFilter}
                            onChange={(e) => setGlobalFilter(toEn(e.target.value))}
                            className="block h-12 w-full rounded-3xl bg-gray-50 ps-10 sm:text-sm sm:leading-6"
                        />
                    </div>

                    {resetPath ? (
                        <Link
                            preserveScroll
                            className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:border-red-50 hover:bg-red-300 hover:text-white"
                            href={resetPath}
                        >
                            <ArrowPathIcon className="h-6 w-6" />
                        </Link>
                    ) : null}
                </div>
            )}
            <div className="!min-h-[500px] !rounded-xl border border-gray-200 dark:border-gray-600">
                <Deferred
                    data="elements"
                    fallback={
                        <div className="flex h-56 w-full items-center justify-center">
                            <LoaderIcon className="animate-spin" />
                        </div>
                    }
                >
                    <Table className={'!rounded-t-xl'}>
                        <TableHeader className={'!rounded-t-xl border-b border-b-gray-300 !bg-gray-100 py-4 dark:border-b-gray-800'}>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={`h-14 first:!rounded-tl-xl last:!rounded-tr-xl ltr:text-left rtl:text-right dark:bg-gray-800 dark:text-white`}
                                            >
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="h-14 ps-4">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className=" ">
                                    <TableCell colSpan={columns.length} className="mx-auto h-full w-200 self-center">
                                        <img src={getImage('no_results.png')} className="mx-auto h-auto w-80 object-cover" />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Deferred>
            </div>
            {/* pagination */}
            <div className="flex items-center justify-end gap-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    <div className="flex flex-row items-center justify-center gap-x-2 capitalize">
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                    </div>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <div className="flex flex-row items-center justify-center gap-x-2 capitalize">
                        <div>
                            <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
                        </div>
                        <div>previous</div>
                    </div>
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg">
                    {`${toNumber(table.options?.state?.pagination?.pageIndex) + 1} / ${table.getPageCount()}`}
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-lg">
                    <div className="flex flex-row items-center justify-center gap-x-2 capitalize">
                        <div>next</div>
                        <div>
                            <ArrowLeft className="h-3 w-3 ltr:rotate-180" />
                        </div>
                    </div>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    <div className="flex flex-row items-center justify-center gap-x-2 capitalize">
                        <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
                    </div>
                </Button>
            </div>
        </div>
    );
}
