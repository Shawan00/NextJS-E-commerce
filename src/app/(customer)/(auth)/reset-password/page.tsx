import { Metadata } from "next";
import { notFound } from "next/navigation";
import ResetPassword from "./resetPassword";

export const metadata: Metadata = {
  title: "Reset Password | FurStore",
};

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ email: string }> }) {
  const { email } = await searchParams;

  if (email === undefined) {
    notFound();
  }
  
  return (
    <div className="w-full container-custom-xl">
      <h1 className="text-2xl font-medium mb-2">Reset Password</h1>
      <p className="text-muted-foreground mb-4">
        Check your email <span className="font-medium">{email}</span> for a 6-digit code to reset your password.
      </p>
      <ResetPassword email={email} />
    </div>
  )
}