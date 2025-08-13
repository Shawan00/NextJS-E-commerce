import { Award, Hammer, Leaf, Shield, Truck } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Our story, mission and values: sustainable design, natural materials, refined craftsmanship.",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <article className="container-custom-lg pt-10 pb-15">
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div className="space-y-6 animate-enter">
          <p className="uppercase tracking-widest text-muted-foreground">Brand story</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            About FurStore
          </h1>
          <p className="text-lg text-muted-foreground">
            We craft sustainable, minimalist, and emotive furniture, combining natural materials and fine craftsmanship to elevate your living space.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/" className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium bg-accent text-white border-2 border-accent hover:bg-transparent hover:text-accent transition-color duration-300">
              Explore products
            </Link>
            <a href="#craft" className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium border border-input hover:bg-accent hover:text-white transition">
              Learn the process
            </a>
          </div>
        </div>

        <div className="relative">
          <div
            className="rounded-sm overflow-hidden shadow-xl hover-scale"
            style={{ transform: "perspective(1000px)" }}
            aria-hidden
          >
            <Image
              src="/about-hero.webp"
              alt="FurStore showroom with oak furniture, linen sofa, and warm lighting"
              width={1600}
              height={896}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <main>
        <section aria-labelledby="values-heading" className="py-12 lg:py-16">
          <h2 id="values-heading" className="sr-only">Core values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="hover-scale p-6 rounded-lg border">
              <h3 className="flex items-center gap-3 text-lg font-semibold">
                <Leaf className="text-primary" /> Sustainable design
              </h3>
              <p className="text-muted-foreground mt-2">
                Optimize product lifecycle, using responsibly sourced and eco‑friendly materials.
              </p>
            </div>

            <div className="hover-scale p-6 rounded-lg border">
              <h3 className="flex items-center gap-3 text-lg font-semibold">
                <Hammer className="text-primary" /> Refined craftsmanship
              </h3>
              <p className="text-muted-foreground mt-2">
                Every detail is carefully finished by seasoned artisans for outstanding quality.
              </p>
            </div>

            <div className="hover-scale p-6 rounded-lg border">
              <h3 className="flex items-center gap-3 text-lg font-semibold">
                <Shield className="text-primary" /> Transparent warranty
              </h3>
              <p className="text-muted-foreground mt-2">
                Clear after‑sales policy, safe delivery, and dedicated customer care.
              </p>
            </div>
          </div>
        </section>

        <section id="craft" aria-labelledby="craft-heading" className="pb-12">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="order-2 md:order-1 space-y-4 animate-enter">
              <h2 id="craft-heading" className="text-3xl font-semibold">Craft process</h2>
              <p className="text-muted-foreground">
                We select oak, walnut, and other natural materials, finishing surfaces with safe oils
                to preserve the wood grain and enhance durability. Every product passes rigorous
                quality checks before reaching you.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><Award className="size-4 text-primary" /> Certified material provenance</li>
                <li className="flex items-center gap-2"><Hammer className="size-4 text-primary" /> Modular assembly by hand</li>
                <li className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Delivery and installation</li>
              </ul>
            </div>
            <figure className="order-1 md:order-2 rounded-lg overflow-hidden shadow-xl hover-scale">
              <Image
                src="/craft-detail.webp"
                alt="Close-up of artisan hands finishing an oak surface with metal detailing"
                width={1024}
                height={640}
                className="w-full h-auto"
              />
            </figure>
          </div>
        </section>
      </main>

      <aside>
        <div className="hover-scale p-8 rounded-lg border flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">Ready to elevate your living space?</h3>
            <p className="text-muted-foreground">Explore our newest collection.</p>
          </div>
          <Link href="/product" className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium bg-primary text-primary-foreground shadow hover:opacity-90 transition">
            Shop now
          </Link>
        </div>
      </aside>
    </article>
  )
}