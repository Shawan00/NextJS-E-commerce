import BreadcrumbCustom from "@/components/customer/breadcrumb"
import { getOrdersByCustomer } from "@/service/order"
import { Metadata } from "next"
import OrderList from "./orderList"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Order history | FurStore"
}

const breadcrumb = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "Order history"
  }
]

export default async function OrderHistory() {
  const orders = await getOrdersByCustomer({
    page: 1,
    pageSize: 30
  })

  return (
    <>
      <div className="container-custom-lg pt-5 pb-10">
        <BreadcrumbCustom breadcrumb={breadcrumb} />
        {orders !== null ? <OrderList orders={orders}/> : (
          <>
            <div className="flex gap-4 flex-col justify-center items-center h-60">
              <p className="text-gray-500">No orders found</p>
              <Button>Continue shopping</Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}