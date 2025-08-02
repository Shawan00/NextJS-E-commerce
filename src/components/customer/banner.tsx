"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';

function Banner() {
  return (
    <>
      <Swiper
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        speed={1500}
        loop={true}
        modules={[Autoplay]}
      >
        <SwiperSlide className='relative w-screen aspect-[21/10] flex items-center justify-center'>
          <Image
            src={"/banner-1.png"}
            alt='Luxury interior'
            sizes='100vw'
            fill
            className='object-cover'
          />
          <div className='absolute top-1/6 left-1/2 -translate-x-1/2 block mx-auto text-center text-secondary'>
            <h1 className='text-lg sm:text-4xl xl:text-6xl mb-1'>Modern Furniture</h1>
            <p className='text-sm sm:text-lg mb-5 whitespace-nowrap'>
              Discover our latest collection of luxury interior products
            </p>
            <Link href="/product"
              className='bg-transparent border-2 border-secondary text-secondary text-sm sm:text-lg font-medium
              px-4 py-2 block w-fit mx-auto rounded-sm hover:bg-secondary hover:text-tertiary transition-all duration-300'
            >
              Learn More
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide className='relative w-screen aspect-[21/10] flex items-center justify-center'>
          <Image
            src={"/banner-2.png"}
            alt='Furniture'
            sizes='100vw'
            fill
            className='object-cover'
          />
          <div className='absolute top-1/6 left-1/2 -translate-x-1/2 block mx-auto text-center text-secondary'>
            <h2 className='text-lg sm:text-4xl xl:text-6xl mb-1 text-green-200'>New Design Armchair</h2>
            <p className='text-sm sm:text-lg mb-5 whitespace-nowrap text-green-200'>
              Bring a touch of elegance to your home
            </p>
            <Link href="/product"
              className='bg-transparent border-2 border-green-200 text-green-200 text-sm sm:text-lg font-medium
              px-4 py-2 block w-fit mx-auto rounded-sm hover:bg-green-200 hover:text-primary transition-all duration-300'
            >
              Discover Now
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default Banner;