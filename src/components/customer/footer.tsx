import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-accent-foreground container-custom-lg pt-10 pb-5 text-sm sm:text-base">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-10 mb-5">
        <section className="flex flex-col gap-5">
          <Logo />
          <p className="flex items-center gap-2">
            <MapPin /> Hà Nội, Việt Nam
          </p>
          <p className="flex items-center gap-2">
            <Phone /> +84 963 075 184
          </p>
          <p className="flex items-center gap-2">
            <Mail /> anviet0901@gmail.com
          </p>
        </section>

        <nav className="flex flex-col gap-5">
          <h5 className="text-xl sm:text-2xl font-medium my-1.5">About Us</h5>
          <ul className="flex flex-col gap-5">
            <li>
              <Link href="/about">Our Team</Link>
            </li>
            <li>
              <Link href="/about">Front-end Developer</Link>
            </li>
            <li>
              <Link href="/about">Back-end Developer</Link>
            </li>
          </ul>
        </nav>

        <nav className="flex flex-col gap-5">
          <h5 className="text-xl sm:text-2xl font-medium my-1.5">Customer Service</h5>
          <ul className="flex flex-col gap-5">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/product">Products</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </nav>

        <nav className="flex flex-col gap-5">
          <h5 className="text-xl sm:text-2xl font-medium my-1.5">Support</h5>
          <ul className="flex flex-col gap-5">
            <li>
              <Link href="#" className="pointer-events-none">FAQ</Link>
            </li>
            <li>
              <Link href="#" className="pointer-events-none">Privacy Policy</Link>
            </li>
            <li>
              <Link href="#" className="pointer-events-none">Terms & Conditions</Link>
            </li>
          </ul>
        </nav>
      </div>
      <section className="pt-5 border-t border-gray-500 text-center">
        Copyright © by An Quoc Viet & Ha Cuong Thinh. All rights reserved.
      </section>
    </footer>
  )
}