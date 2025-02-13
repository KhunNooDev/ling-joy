'use client'
import { Children, isValidElement, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { Table as TableProvider, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MenuIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PencilIcon,
} from 'lucide-react'
import { cn, keyValueTemplate } from '@/lib/utils'
import { AppButton, IAppButton } from './AppButton'

interface IAppDataTable<T> {
  data: T[]
  children: React.ReactNode //only name "Column"
  noSelectRow?: boolean
  actions?: (Omit<IAppButton, 'onClick'> & {
    icon?: React.ReactNode
    onClick: (rowData: T) => void
  })[]
}

export default function AppDataTable<T>({ data, children, noSelectRow, actions }: IAppDataTable<T>) {
  // Map Column children to columns
  const childColumns: ColumnDef<T>[] = Children.toArray(children).flatMap((child) => {
    if (isValidElement(child) && (child.type as any).displayName === 'Column') {
      const {
        field,
        title,
        useKeyValue,
        sortable = false,
        resizable = true,
        size,
        minSize,
        maxSize,
        className,
      } = child.props as IColumn<T>
      return [
        {
          accessorKey: field,
          header: ({ column }) =>
            !column.getCanSort() ? (
              <div className={cn('flex', className)}>{title}</div>
            ) : (
              <>
                <Button
                  className={cn('flex w-full justify-between gap-2 px-2', className)}
                  variant='ghost'
                  onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                  <span>{title}</span>
                  {column.getIsSorted() === 'desc' ? (
                    <ArrowDownIcon />
                  ) : column.getIsSorted() === 'asc' ? (
                    <ArrowUpIcon />
                  ) : (
                    <ArrowUpDownIcon />
                  )}
                </Button>
              </>
            ),
          cell: ({ row }) => {
            const rowData = row.original

            return (
              <div>
                {useKeyValue
                  ? keyValueTemplate(rowData as Record<string, any>, field as string, useKeyValue)
                  : row.getValue(field as string)}
              </div>
            )
          },
          enableSorting: sortable,
          enableResizing: resizable,
          size: size,
          minSize: minSize,
          maxSize: maxSize,
        },
      ]
    }
    console.warn('Only Column components are allowed as children.')
    return []
  })

  const columns: ColumnDef<T>[] = []
  if (!noSelectRow) {
    columns.push({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      // enableSorting: false,
      // enableHiding: false,
      enableResizing: false,
      size: 32,
      // minSize: 36,
      // maxSize: 36,
    })
  }

  if (actions) {
    columns.push({
      id: 'actions',
      cell: ({ row }) => {
        const rowData = row.original
        return (
          <div className='flex gap-2'>
            {actions?.map(({ icon, onClick, ...buttonProps }, idx) => (
              <AppButton key={idx} onClick={() => onClick(rowData)} size='iconSm' {...buttonProps}>
                {icon}
              </AppButton>
            ))}
          </div>
        )
      },
      enableResizing: false,
      size: actions.length * 27 + (actions.length - 1) * 8 + 16, // Calculate total width: (number of buttons * button width) + (number of gaps between buttons) + (padding)
    })
  }

  columns.push(...childColumns)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div>
      {/* <pre style={{ minHeight: '10rem' }}>
        {JSON.stringify(
          {
            columnSizing: table.getState().columnSizing,
            tableWidth: table.getTotalSize(),
          },
          null,
          2,
        )}
      </pre> */}
      <div className='flex items-center gap-2 py-4'>
        {/* <Input
          placeholder='Filter emails...'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        /> */}
        <DataTableViewOptions table={table} />
      </div>
      <div>
        <TableProvider
          style={{
            // ...columnSizeVars, //Define column sizes on the <table> element
            width: table.getTotalSize(),
            // width: '100%',
          }}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : header.getSize(),
                        maxWidth: header.column.columnDef.size,
                        whiteSpace: 'nowrap',
                        overflow: 'auto',
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={cn({
                          resizer: header.column.getCanResize(),
                          isResizing: header.column.getIsResizing(),
                        })}
                      />
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize() === Number.MAX_SAFE_INTEGER ? 'auto' : cell.column.getSize(),
                        maxWidth: cell.column.columnDef.size,
                        whiteSpace: 'nowrap',
                        overflow: 'auto',
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableProvider>
      </div>
      <div className='py-4'>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}

interface IColumn<T> {
  field: keyof T
  title: string
  useKeyValue?: { value: string; label: string }[]
  sortable?: boolean
  resizable?: boolean
  size?: number
  minSize?: number
  maxSize?: number
  className?: string
}

// This component is used only for declaration
const Column = <T,>(props: IColumn<T>) => null
Column.displayName = 'Column'
export { Column }

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='ml-auto h-8 lg:flex'>
          <MenuIcon className='mr-2 h-4 w-4' />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DataTablePaginationProps<T> {
  table: Table<T>
}

function DataTablePagination<T>({ table }: DataTablePaginationProps<T>) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex-1 text-sm text-muted-foreground'>
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronsLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronsRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
