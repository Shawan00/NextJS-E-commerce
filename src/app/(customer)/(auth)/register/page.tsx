import Link from "next/link";
import RegisterForm from "./registerForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | FurStore",
};

export default function RegisterPage() {
  return (
    <>
      <div className="w-full max-w-md justify-center items-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Register your account</h2>
          <p className="text-sm text-gray-600">
            Have an account?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
        <RegisterForm/>
      </div>
    </>
  )
}