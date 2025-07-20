"use client";

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';

function Banner() {
  return (
    <>
      <Swiper
        pagination={true} modules={[Pagination]}
        modules={[Autoplay]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        speed={2500}
        loop={true}
      >
        <SwiperSlide className='relative w-screen aspect-[21/10] flex items-center justify-center'>
          <Image
            src={"/banner-1.png"}
            alt='Luxury interior'
            sizes='100vw'
            fill
            className='object-cover'
          />
        </SwiperSlide>
        <SwiperSlide className='relative w-screen aspect-[21/10] flex items-center justify-center'>
          <Image
            src={"/banner-2.png"}
            alt='Furniture'
            sizes='100vw'
            fill
            className='object-cover'
          />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default Banner;