"use server";

import { http } from "@/lib/htpp";
import { CustomerType } from "@/schemaValidation/auth.schema";
import { cookies } from "next/headers";

export const getCustomerInfo = async (): Promise<CustomerType | null> => {
  const cookieStore = await cookies();
  const data = cookieStore.get('customer')?.value;
  if (!data) return null;
  const customer = JSON.parse(data) as CustomerType;
  return customer;
}

export const updateCustomerInfo = async (id: number, data: CustomerType): Promise<CustomerType | null> => {
  const res = await http.patch<CustomerType>(`customers/${id}`, data);
  if (res.status === 200 && 'email' in res.payload) {
    const cookieStore = await cookies();
    cookieStore.set('customer', JSON.stringify(res.payload));
    return res.payload;
  }
  return null;
}