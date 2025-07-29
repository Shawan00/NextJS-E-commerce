import BreadcrumbCustom from "@/components/customer/breadcrumb"
import { Metadata } from "next"
import Stepper from "./stepper"

const breadcrumb = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "Cart & Checkout"
  }
]

export const metadata: Metadata = {
  title: "Cart & Checkout | FurStore"
}

export default function CartPage() {
  return (
    <>
      <div className="container-custom-lg pt-5 pb-10">
        <BreadcrumbCustom breadcrumb={breadcrumb} />
        <Stepper />
      </div>
    </>
  )
}