import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchWithToken } from '@/helpers/fetch';
import { format, parse, parseISO } from 'date-fns';

type AppointmentData = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    doctor: {
        fullName: string;
    };
};

const columns: ColumnDef<AppointmentData>[] = [
    {
        accessorKey: 'id',
        cell: ({ row }) => row.getValue<number>('id'),
        enableHiding: false,
    },
    {
        accessorKey: 'date',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Date
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const raw = row.getValue<string>('date');
            const date = parseISO(raw);
            return (
                <div className="pl-3 capitalize">
                    {format(date, 'EEE dd MMM')}
                </div>
            );
        },
    },
    {
        accessorKey: 'startTime',
        header: 'Start time',
        cell: ({ row }) => {
            const raw = row.getValue<string>('startTime');
            const date = parse(raw, 'HH:mm:ss', new Date());
            return <div className="lowercase">{format(date, 'hh:mm a')}</div>;
        },
    },
    {
        accessorKey: 'endTime',
        header: 'End time',
        cell: ({ row }) => {
            const raw = row.getValue<string>('endTime');
            const date = parse(raw, 'HH:mm:ss', new Date());
            return <div className="lowercase">{format(date, 'hh:mm a')}</div>;
        },
    },
    {
        id: 'doctor',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Doctor
                    <ArrowUpDown />
                </Button>
            );
        },
        accessorFn: (row) => row.doctor.fullName,
        cell: ({ getValue }) => {
            return <div className="pl-3 capitalize">{getValue<string>()}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Status
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue<string>('status');
            return (
                <div
                    className={`pl-3 capitalize ${
                        status === 'COMPLETED'
                            ? 'text-green-600'
                            : status === 'CANCELLED'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                    }`}
                >
                    {status}
                </div>
            );
        },
    },

    {
        id: 'actions',
        header: 'Actions',
        enableHiding: false,
        cell: ({ row }) => {
            const status = row.getValue<string>('status');
            const disableOpenMenu = status === 'COMPLETED';
            const disableCancel = status === 'CANCELLED';

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 cursor-pointer"
                            disabled={disableOpenMenu}
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {}}
                        >
                            Pay Appointment Fee
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {}}
                            disabled={disableCancel}
                        >
                            Cancel Appointment
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

const Appointments = () => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        id: false,
    });

    const { data: appointmentsData, isLoading } = useQuery({
        queryKey: [
            'appointments',
            pagination.pageIndex + 1,
            pagination.pageSize,
        ],
        queryFn: () =>
            fetchWithToken(
                `/appointment?page=${pagination.pageIndex + 1}&limit=${
                    pagination.pageSize
                }`
            ),
        placeholderData: keepPreviousData,
    });

    const table = useReactTable({
        data: appointmentsData?.data ?? [],
        columns,
        manualPagination: true,
        pageCount: appointmentsData?.totalPages ?? 0,
        state: {
            pagination,
            globalFilter,
            sorting,
            columnFilters,
            columnVisibility,
        },
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = String(filterValue).toLowerCase();
            return row.getVisibleCells().some((cell) => {
                const id = cell.column.id;
                let text = '';

                // for "date", format ISO → "Sat 26 Jul"
                if (id === 'date') {
                    const raw = row.getValue<string>('date');
                    text = format(parseISO(raw), 'EEE dd MMM').toLowerCase();
                }
                // for times, format "HH:mm:ss" → "01:00 PM"
                else if (id === 'startTime' || id === 'endTime') {
                    const raw = row.getValue<string>(id);
                    text = format(
                        parse(raw, 'HH:mm:ss', new Date()),
                        'hh:mm a'
                    ).toLowerCase();
                }
                // everything else use the raw cell value
                else {
                    text = String(cell.getValue()).toLowerCase();
                }

                return text.includes(search);
            });
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 py-4">
                <Input
                    placeholder="Filter appointments…"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm border border-gray-400 bg-white"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="ml-auto bg-white border-gray-400"
                        >
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border border-gray-400 bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="border-b border-gray-400"
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {appointmentsData
                        ? `Showing ${
                              pagination.pageIndex * pagination.pageSize + 1
                          }–${
                              pagination.pageIndex * pagination.pageSize +
                              table.getRowModel().rows.length
                          } of ${appointmentsData.total} appointments`
                        : 'Loading...'}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
