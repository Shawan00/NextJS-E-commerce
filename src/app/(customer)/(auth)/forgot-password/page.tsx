import { Metadata } from "next";
import ForgotPassword from "./forgotPassword";

export const metadata: Metadata = {
  title: "Forgot Password | FurStore",
};

export default async function ForgotPasswordPage() {

  return (
    <ForgotPassword />
  )
}