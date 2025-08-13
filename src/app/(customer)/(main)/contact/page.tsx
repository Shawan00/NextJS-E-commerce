import SubmitButton from "@/components/admin/SubmitButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact us | FurStore",
  description: "Contact page"
}

export default function ContactPage() {
  return (
    <div className="container-custom-lg pt-5 pb-10">
      <h1 className="text-2xl font-bold">Contact Us</h1>
      <p className="text-sm text-muted-foreground">
        Contact us for any questions or feedback.
      </p>
      <form className="w-160 mx-auto flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your email or phone"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <textarea
          placeholder="Enter your message"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          rows={6}
        />
        <SubmitButton label="Send" />
      </form>
    </div>
  )
}