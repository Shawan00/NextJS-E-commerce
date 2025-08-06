import Link from "next/link";
import LoginForm from "./loginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | FurStore",
};

const LoginPage = () => {
  return (
    <>
      <div className="w-full max-w-md justify-center items-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Log in to your account</h2>
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-green-600 font-semibold hover:underline">
              Get started
            </Link>
          </p>
        </div>

        <LoginForm />
      </div>
    </>
  );
};

export default LoginPage;
