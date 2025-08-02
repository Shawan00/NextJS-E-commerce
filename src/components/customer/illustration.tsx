"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';

function Illustration() {
  return (
    <>
      <Swiper
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        speed={1500}
        loop={true}
        modules={[Autoplay]}
        className='flex-1'
      >
        <SwiperSlide className='relative w-full aspect-108/170'>
          <Image
            src={"/illustration-1.webp"}
            alt="illustration"
            fill
            sizes="(min-width: 640px) 100vw, 25vw"
            className="object-cover hover:scale-105 transition-all duration-1000"
          />
        </SwiperSlide>
        <SwiperSlide className='relative w-full aspect-108/170'>
          <Image
            src={"/illustration-2.webp"}
            alt="illustration"
            fill
            sizes="(min-width: 640px) 100vw, 25vw"
            className="object-cover hover:scale-105 transition-all duration-1000"
          />
        </SwiperSlide>
        <SwiperSlide className='relative w-full aspect-108/170'>
          <Image
            src={"/illustration-3.webp"}
            alt="illustration"
            fill
            sizes="(min-width: 640px) 100vw, 25vw"
            className="object-cover hover:scale-105 transition-all duration-1000"
          />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default Illustration;