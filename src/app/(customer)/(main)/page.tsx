import Banner from "@/components/customer/banner";
import BestSellers from "@/components/customer/bestSellers";
import Illustration from "@/components/customer/illustration";
import NewProducts from "@/components/customer/newProducts";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Banner />
      <div className="py-10 container-custom">
        <Image
          src={"/welcome.webp"}
          alt="welcome"
          width="206"
          height="50"
          className="block mx-auto mt-10 md:mt-15"
        />
        <p className="text-center text-muted-foreground my-6 md:my-8">
          We are a team of passionate people who are dedicated to providing the best possible experience for our customers.
        </p>

        <section className="grid grid-cols-12 gap-3 md:gap-6 mb-5 md:mb-15">
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 relative w-full aspect-90/49">
            <Image
              src={"/plant.webp"}
              alt="plant"
              fill
              sizes="(min-width: 640px) 40vw, 30vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 px-3 md:px-6 py-6 lg:py-3 xl:py-10 z-10 h-full flex flex-col justify-between">
              <h2 className="text-2xl sm:text-3xl lg:text-2xl xl:text-4xl font-semibold">
                NEW <strong className="font-semibold bg-linear-to-r from-green-400 to-green-800 text-transparent bg-clip-text">PLANTS</strong>
              </h2>
              <p className="text-muted-foreground mb-[20%]">Sale up to 30% off</p>
              <Link href="/category/11"
                className="block w-fit text-green-600 font-medium border-2 border-green-600 
                  px-4 py-2 rounded-sm hover:bg-green-600 hover:text-white transition-color duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 relative w-full aspect-90/49">
            <Image
              src={"/lamp.webp"}
              alt="lamp"
              fill
              sizes="(min-width: 640px) 40vw, 30vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 px-3 md:px-6 py-6 lg:py-3 xl:py-10 z-10 h-full flex flex-col justify-between">
              <h2 className="text-2xl sm:text-3xl lg:text-2xl xl:text-4xl font-semibold text-tertiary">
                CHAIN <strong className="font-semibold bg-linear-to-r from-yellow-400 to-orange-600 text-transparent bg-clip-text">LAMP</strong>
              </h2>
              <p className="text-muted mb-[20%]">Sale up to 40% off</p>
              <Link href="/category/15"
                className="block w-fit text-yellow-600 font-medium border-2 border-yellow-600 
                  px-4 py-2 rounded-sm hover:bg-yellow-600 hover:text-white transition-color duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="col-span-3 hidden sm:block lg:hidden"></div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 relative w-full aspect-90/49">
            <Image
              src={"/chair.webp"}
              alt="chair"
              fill
              sizes="(min-width: 640px) 40vw, 30vw"
              className="object-cover"
            />
            <div className="absolute top-0 left-0 px-3 md:px-6 py-6 lg:py-3 xl:py-10 z-10 h-full flex flex-col justify-between">
              <h2 className="text-2xl sm:text-3xl lg:text-2xl xl:text-4xl font-semibold text-primary">
                SOFT <strong className="font-semibold bg-linear-to-r from-gray-400 to-gray-800 text-transparent bg-clip-text">SOFA</strong>
              </h2>
              <p className="text-primary mb-[20%]">Sale up to 20% off</p>
              <Link href="/category/6"
                className="block w-fit text-gray-600 font-medium border-2 border-gray-600 
                  px-4 py-2 rounded-sm hover:bg-gray-600 hover:text-white transition-color duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

      </div>

      <section className="w-full py-6 bg-secondary-background container-custom mb-15 md:mb-25">
        <h3 className="text-4xl font-normal text-center mb-6">New Features</h3>
        <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center">
          <Illustration />
          <NewProducts />
        </div>
      </section>

      <section className="container-custom mb-15 md:mb-25  w-full">
        <h3 className="text-4xl font-normal text-center mb-6">Best Sellers</h3>
        <BestSellers />
      </section>

      <section className="container-custom bg-[url('/outstanding-products.webp')] aspect-192/70 bg-cover bg-center bg-no-repeat mb-15 md:mb-25
                        flex flex-col justify-center gap-4 md:gap-10"
      >
        <strong className="hidden">Interior Decoration</strong>
        <Image
          src='/new-modern.webp'
          alt="decoration"
          width="180"
          height="28"
        />
        <p className="text-xl lg:text-4xl ">Some decorative items</p>
        <p className="text-muted-foreground hidden md:block w-3/5 -mt-7">
          Discover our exquisite collection of decorative furniture – where style meets sophistication! Each carefully curated piece is designed to bring elegance and personality to your home, helping you create a space that reflects your unique taste.
        </p>
        <Link href="/product"
          className="block w-fit text-yellow-800 font-medium border-2 border-yellow-800 
                  px-3 py-1 sm:px-6 sm:py-2 rounded-sm hover:bg-yellow-800 hover:text-white transition-color duration-300"
        >
          Shop now
        </Link>
      </section>

      <section className="container-custom-lg flex flex-col items-center gap-10 mb-15 md:mb-25">
        <h5 className="text-2xl font-normal">Newsletters</h5>
        <p className="text-muted-foreground -mt-8">
          Subscribe to our newsletter to get the latest news and updates.
        </p>
        <form className="flex items-center gap-2 w-full md:w-1/2">
          <input type="email" placeholder="Enter your email" className="w-full p-2 border-b border-yellow-800 focus:outline-none" />
          <button type="submit" className="bg-yellow-800 text-white px-4 py-2 rounded-sm hover:bg-yellow-900 transition-color duration-300 pointer-events-none">Subscribe</button>
        </form>
      </section>
    </>
  );
}