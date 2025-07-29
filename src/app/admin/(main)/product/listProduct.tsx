"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, Trash2, ArrowUpDown, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ProductType, ProductParamsType } from "@/schemaValidation/product.schema";
import { formatDateToString, formatNumberWithDots, resizeImage } from "@/helper/general";
import { getProducts } from "@/service/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/store/features/breadcrumbSlice";
import DeleteProduct, { DeleteProductRef } from "./deleteProduct";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ListProductProps {
  initialProductResponse: {
    data: ProductType[];
    total: number;
    page: number;
    pageSize: number;
  } | null;
}

function ListProduct({ initialProductResponse }: ListProductProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [data, setData] = React.useState<ProductType[]>(initialProductResponse?.data || []);
  const [loading, setLoading] = React.useState(false);
  const [pagination, setPagination] = React.useState({
    total: initialProductResponse?.total || 0,
    page: initialProductResponse?.page || 1,
    pageSize: initialProductResponse?.pageSize || 10,
  });
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [reload, setReload] = React.useState(false);

  const isFirstRender = React.useRef(true);
  const deleteProductRef = React.useRef<DeleteProductRef>(null);

  // Handle delete product click
  const handleDeleteClick = React.useCallback((product: ProductType) => {
    deleteProductRef.current?.setProduct(product);
  }, []);

  // Function to fetch products from API
  const fetchProducts = React.useCallback(async (params: ProductParamsType) => {
    setLoading(true);
    const response = await getProducts(params);
    if (response) {
      setData(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
      });
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    // Skip API call on first render, use initial data instead
    if (isFirstRender.current) {
      dispatch(setBreadcrumb([
        {
          label: "Management",
        },
        {
          label: "Product list",
        }
      ]
      ));
      isFirstRender.current = false;
      return;
    }

    const params: ProductParamsType = {
      page: pagination.page,
      pageSize: pagination.pageSize,
    };

    // Add sorting to params
    if (sorting.length > 0) {
      const sort = sorting[0];
      // Map column id to API field names
      const fieldMapping: Record<string, string> = {
        'product': 'name',
        'name': 'name',
        'stock': 'stock',
        'price': 'price',
        'discountPercent': 'discountPercent',
        'createdAt': 'createdAt'
      };

      const mappedField = fieldMapping[sort.id];
      if (mappedField) {
        params.sortField = mappedField as "name" | "createdAt" | "price" | "stock" | "discountPercent";
        params.sortBy = sort.desc ? 'desc' : 'asc';
      }
    }

    fetchProducts(params);
  }, [pagination.page, pagination.pageSize, sorting, fetchProducts, reload, dispatch]);

  const columns: ColumnDef<ProductType>[] = [
    {
      accessorKey: "name",
      id: "product",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent hover:text-primary cursor-pointer"
          >
            Product
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        const categoryNames = product.categories.map(cat => cat.name).join(", ");

        return (
          <div className="flex items-center space-x-3">
            <div className="w-[80px] h-[80px] rounded-md overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={resizeImage(product.thumbnail, 80)}
                alt={product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="font-medium text-base">{product.name}</div>
              <div className="text-sm text-muted-foreground">
                {categoryNames}
              </div>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => {
        return <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {row.getValue("sku")}
        </code>;
      },
      enableSorting: false,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent hover:text-primary cursor-pointer"
          >
            Stock
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return (
          <div
            className={`font-medium ${stock < 5 ? 'text-[var(--tertiary)]' : ''}`}
          >
            {stock}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent hover:text-primary cursor-pointer"
          >
            Price
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return <div className="font-medium">${formatNumberWithDots(price)}</div>;
      },
    },
    {
      accessorKey: "discountPercent",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent hover:text-primary cursor-pointer"
          >
            Discount
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const discount = row.getValue("discountPercent") as number;
        return discount > 0 ? (
          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {discount}%
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 hover:bg-transparent hover:text-primary cursor-pointer"
          >
            Created at
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {formatDateToString(row.getValue("createdAt"))}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/admin/product/edit/${product.id}`)}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(product)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" color="var(--destructive)" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualSorting: true,
    manualPagination: true,
    pageCount: Math.ceil(pagination.total / pagination.pageSize),
  });

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={pagination.page === i}
              onClick={(e) => {
                e.preventDefault();
                setPagination(prev => ({ ...prev, page: i }));
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={pagination.page === 1}
            onClick={(e) => {
              e.preventDefault();
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (pagination.page > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      // Show pages around current page
      const start = Math.max(2, pagination.page - 1);
      const end = Math.min(totalPages - 1, pagination.page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={pagination.page === i}
              onClick={(e) => {
                e.preventDefault();
                setPagination(prev => ({ ...prev, page: i }));
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is far from end
      if (pagination.page < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href="#"
              isActive={pagination.page === totalPages}
              onClick={(e) => {
                e.preventDefault();
                setPagination(prev => ({ ...prev, page: totalPages }));
              }}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Skeleton className="h-15 w-full my-4" />
                  <Skeleton className="h-15 w-full my-4" />
                  <Skeleton className="h-15 w-full my-4" />
                  <Skeleton className="h-15 w-full my-4" />
                  <Skeleton className="h-15 w-full my-4" />
                  <Skeleton className="h-15 w-full my-4" />
                </TableCell>
              </TableRow>
            ) : data?.length ? (
              data.map((product, index) => (
                <TableRow key={product.id}>
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell key={column.id}>
                      {flexRender(
                        column.columnDef.cell,
                        {
                          row: {
                            original: product,
                            getValue: (key: string) => product[key as keyof ProductType],
                            id: product.id.toString(),
                            index,
                            getIsSelected: () => false,
                            getCanSelect: () => true,
                          },
                          column,
                          table,
                          cell: { id: `${product.id}-${column.id}` },
                          getValue: () => product[column.id as keyof ProductType],
                          renderValue: () => product[column.id as keyof ProductType],
                        } as unknown as Parameters<typeof flexRender>[1]
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
                  You don&apos;t have any product yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap">Show per page</p>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => {
              setPagination(prev => ({
                ...prev,
                pageSize: Number(value),
                page: 1
              }));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.page > 1) {
                    setPagination(prev => ({ ...prev, page: prev.page - 1 }));
                  }
                }}
                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.page < totalPages) {
                    setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                  }
                }}
                className={pagination.page >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <DeleteProduct ref={deleteProductRef} onReload={() => setReload(!reload)} />
    </div>
  );
}

export default ListProduct;