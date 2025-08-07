import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { ReduxProvider } from "@/store/provider";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Home page | FurStore",
  description: "FurStore is a platform for selling luxury furniture products",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jost.className} antialiased`}>
        <ReduxProvider>
          <ToastContainer/>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
