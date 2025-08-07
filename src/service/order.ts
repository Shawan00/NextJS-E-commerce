"use server";

import { http } from "@/lib/htpp";
import { OrderBodyType } from "@/schemaValidation/order.shema";
import { cookies } from "next/headers";

// Define interfaces for API responses
interface BooleanResponse {
  success: boolean;
  message: string;
  orderId?: number;
}

interface OrderResponse {
  message: string;
  order: {
    id: number;
    phone: string;
    address: string;
  }
}

export interface OrderType {
  id: number;
  customerId: number;
  phone: string;
  address: string;
  shippingCost: number;
  deliveryMethod: "standard" | "express" | "free";
  paymentMethod: "cash" | "paypal" | "card";
  status: "pending" | "processing" | "delivering" | "completed" | "cancelled";
  subTotal: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    fullName: string;
    email: string;
  };
  orderProducts: {
    quantity: number;
    product: {
      id: number;
      name: string;
      sku: string;
      thumbnail: string;
      price: number;
      discountPercent: number;
    };
  }[];
}

interface OrderResponseType {
  message: string;
  order: OrderType;
}

export interface OrderListResponseType {
  message: string;
  totalCount: number;
  page: number;
  pageSize: number;
  data: OrderType[];
}

type OrderParamsType = {
  page: number;
  pageSize: number;
  status?: "pending" | "processing" | "delivering" | "completed" | "cancelled";
  sortField?: "createdAt" | "status" | "grandTotal";
  sortBy?: "asc" | "desc";
}

export const createOrder = async (data: OrderBodyType): Promise<BooleanResponse> => {
  const res = await http.post<OrderResponse>("/order", data);
  if (res.status === 201 && 'order' in res.payload) {
    return {
      success: true,
      message: "Order made successfully",
      orderId: res.payload.order.id
    }
  }
  return {
    success: false,
    message: (res.payload as { message: string }).message || "Failed to make order"
  }
}

export const getOrderById = async (orderId: number): Promise<OrderType | null> => {
  const res = await http.get<OrderResponseType>(`/order/${orderId}`);
  if (res.status === 200 && 'order' in res.payload) {
    const cookieStore = await cookies();
    const data = cookieStore.get('customer')?.value;
    const currentCustomer = data ? JSON.parse(data) : null;
    // if the order is not belong to the current customer, return null
    if (currentCustomer?.id !== res.payload.order.customerId) {
      return null;
    }
    return res.payload.order;
  }
  return null;
}

export const getOrdersByCustomer = async (params?: OrderParamsType): Promise<OrderType[] | null> => {
  const cookieStore = await cookies();
  const data = cookieStore.get('customer')?.value;
  const currentCustomer = data ? JSON.parse(data) : null;
  if (!currentCustomer) {
    return null;
  }
  const res = await http.get<OrderListResponseType>(`/order/user/${currentCustomer.id}`, params);
  if (res.status === 200 && 'data' in res.payload) {
    return res.payload.data;
  }
  return null;
}

export const getOrders = async (params?: OrderParamsType): Promise<OrderListResponseType | null> => {
  const res = await http.get<OrderListResponseType>(`/order`, params);
  if (res.status === 200 && 'data' in res.payload) {
    return res.payload;
  }
  return null;
}

export const updateOrderStatus = async (orderId: number, status: "pending" | "processing" | "delivering" | "completed" | "cancelled"): Promise<BooleanResponse> => {
  const res = await http.patch<{message: string}>(`/order/${orderId}`, { status });
  if (res.status === 200 && 'message' in res.payload) {
    return {
      success: true,
      message: res.payload.message
    }
  }
  return {
    success: false,
    message: res.payload.message
  }
}