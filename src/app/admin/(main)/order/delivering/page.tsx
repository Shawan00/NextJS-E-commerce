import { OrdersData } from "@/components/admin/orders-data";
import { getOrders } from "@/service/order";
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delivering Orders | Manage FurStore",
};

export default async function OrdersPage() {
  const orders = await getOrders({
    page: 1,
    pageSize: 10,
    sortField: "createdAt",
    sortBy: "desc",
    status: "delivering"
  })

  if (!orders || orders.data.length === 0) return (
    <div className="text-center text-muted-foreground">No orders found</div>
  )

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">Delivering Orders</h1>
      <OrdersData
        data={orders}
        variant="delivering"
      />
    </>
  )
}