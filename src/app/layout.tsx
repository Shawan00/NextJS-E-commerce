import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Home page | Furniture Store",
  description: "A simple furniture store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.variable} antialiased`}>
        <ToastContainer/>
        {children}
      </body>
    </html>
  );
}
