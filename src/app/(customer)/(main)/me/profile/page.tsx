import BreadcrumbCustom from "@/components/customer/breadcrumb";
import ProfileForm from "@/components/customer/ProfileForm";
import { getCustomerInfo } from "@/service/user";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile | FurStore"
}

const breadcrumb = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Profile",
  }
]

export default async function ProfilePage() {
  const customer = await getCustomerInfo();
  if (!customer) {
    notFound();
  }

  return (
    <div className="px-2 sm:px-7 md:px-9 lg:px-70 xl:px-100 py-8">
      <BreadcrumbCustom breadcrumb={breadcrumb}/>
      <div className="mt-8">
        <ProfileForm customer={customer} />
      </div>
    </div>
  )
}