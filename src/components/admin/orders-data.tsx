"use client";

import { OrderListResponseType, OrderType, updateOrderStatus, getOrders } from "@/service/order";
import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"; import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, Truck, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { formatNumberWithDots } from "@/helper/general";
import { showToast } from "@/helper/toast";
import { Skeleton } from "../ui/skeleton";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/store/features/breadcrumbSlice";
import OrderDetail from "./order-detail";
import { statusConfig, deliveryMethodConfig } from "@/helper/dataConfig";
import { Button } from "../ui/button";

interface Props {
  data: OrderListResponseType,
  variant: OrderStatus | "all"
}

type OrderStatus = "pending" | "processing" | "delivering" | "completed" | "cancelled";

const breadcrumb = [
  {
    label: "Management"
  },
  {
    label: "Order"
  }
]

export function OrdersData({ data, variant }: Props) {
  const [ordersData, setOrdersData] = useState<OrderType[]>(data.data);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [page, setPage] = useState(data.page);
  const [pageSize, setPageSize] = useState(data.pageSize);
  const [totalCount, setTotalCount] = useState(data.totalCount);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFirstRender = useRef(true);
  const dispatch = useDispatch();

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    setUpdatingStatus(orderId);
    const response = await updateOrderStatus(orderId, newStatus);
    if (response.success) {
      setOrdersData(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
      showToast('success', response.message);
    } else {
      showToast('error', response.message);
    }
    setUpdatingStatus(null);
  };

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const response = await getOrders({
      page,
      pageSize,
      sortField: "createdAt",
      sortBy: "desc",
      status: variant === "all" ? undefined : variant
    });

    if (response) {
      setOrdersData(response.data);
      setTotalCount(response.totalCount);
    }

    if (isRefresh) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  }, [page, pageSize, variant]);

  const handleRefresh = async () => {
    await fetchOrders(true);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      dispatch(setBreadcrumb(breadcrumb));
      return;
    }
    fetchOrders();
  }, [fetchOrders, dispatch]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <OrderDetail order={selectedOrder} setOrder={setSelectedOrder} />
      <div className="space-y-6">
        {/* Header with Refresh Button */}
        <Button
          variant="outline"
          className="flex items-center gap-2 ml-auto mb-4"
          onClick={handleRefresh}
          disabled={refreshing || loading}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Qty</TableHead>
                <TableHead>Delivery Method</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8  ">
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8  ">
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8  ">
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8  ">
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  </TableRow>
                </>
              ) : ordersData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                ordersData.map((order) => {
                  const statusConfigItem = statusConfig[order.status];
                  const deliveryConfig = deliveryMethodConfig[order.deliveryMethod];
                  const IconComponent = statusConfigItem.icon;
                  const totalItems = order.orderProducts.reduce((sum, item) => sum + item.quantity, 0);
                  const isCancelled = order.status === "cancelled";
                  const isCompleted = order.status === "completed";

                  return (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedOrder(order)}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.fullName}</div>
                          <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{totalItems} items</TableCell>
                      <TableCell>
                        <Badge className={`${deliveryConfig.color} text-xs`}>
                          {deliveryConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">
                        ${formatNumberWithDots(order.grandTotal)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.createdAt}
                      </TableCell>
                      <TableCell>
                        {!isCancelled && !isCompleted ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Badge
                                className={`${statusConfigItem.color} border flex items-center gap-1 w-fit cursor-pointer hover:opacity-80`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <IconComponent className="h-3 w-3" />
                                {statusConfigItem.label}
                              </Badge>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {order.status !== "pending" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(order.id, "pending");
                                  }}
                                  disabled={updatingStatus === order.id}
                                  className="text-yellow-800"
                                >
                                  <Clock className="h-4 w-4 " color="var(--color-yellow-800)" />
                                  Set to Pending
                                </DropdownMenuItem>
                              )}
                              {order.status !== "processing" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(order.id, "processing");
                                  }}
                                  disabled={updatingStatus === order.id}
                                  className="text-blue-800"
                                >
                                  <Package className="h-4 w-4 " color="var(--color-blue-800)" />
                                  Set to Processing
                                </DropdownMenuItem>
                              )}
                              {order.status !== "delivering" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(order.id, "delivering");
                                  }}
                                  disabled={updatingStatus === order.id}
                                  className="text-purple-800"
                                >
                                  <Truck className="h-4 w-4 " color="var(--color-purple-800)" />
                                  Set to Delivering
                                </DropdownMenuItem>
                              )}
                              {order.status !== "completed" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(order.id, "completed");
                                  }}
                                  disabled={updatingStatus === order.id}
                                  className="text-green-800"
                                >
                                  <CheckCircle className="h-4 w-4" color="var(--color-green-800)" />
                                  Mark as Completed
                                </DropdownMenuItem>
                              )}
                              {order.status !== "cancelled" && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(order.id, "cancelled");
                                  }}
                                  disabled={updatingStatus === order.id}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <XCircle className="h-4 w-4" color="var(--destructive)" />
                                  Cancel Order
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Badge className={`${statusConfigItem.color} border flex items-center gap-1 w-fit`}>
                            <IconComponent className="h-3 w-3" />
                            {statusConfigItem.label}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground whitespace-nowrap">Show per page</p>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
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
                      if (page > 1) setPage(page - 1);
                    }}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNum, index) => (
                  <PaginationItem key={index}>
                    {pageNum === '...' ? (
                      <span className="px-3 py-2 text-sm">...</span>
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={page === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNum as number);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Summary */}
        <div className="text-center text-sm text-muted-foreground">
          Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalCount)} of {totalCount} orders
        </div>
      </div>
    </>
  );
}