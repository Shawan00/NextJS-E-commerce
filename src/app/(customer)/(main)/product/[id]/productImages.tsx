"use client";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import { useState, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProductImagesProps {
  thumbnail: string;
  images: string[];
}

function ProductImages({ thumbnail, images }: ProductImagesProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [imageOrientations, setImageOrientations] = useState<{[key: string]: 'landscape' | 'portrait' | 'square'}>({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const allImages = [thumbnail, ...images];
  const totalSlides = allImages.length;

  const handleImageLoad = (imageSrc: string, event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = img;
    
    let orientation: 'landscape' | 'portrait' | 'square';
    if (naturalWidth > naturalHeight) {
      orientation = 'landscape';
    } else if (naturalHeight > naturalWidth) {
      orientation = 'portrait';
    } else {
      orientation = 'square';
    }

    setImageOrientations(prev => ({
      ...prev,
      [imageSrc]: orientation
    }));
  };

  const getImageClass = (imageSrc: string) => {
    const orientation = imageOrientations[imageSrc];
    
    if (orientation === 'portrait') {
      return 'object-cover rounded-xs';
    }
    return 'object-contain rounded-xs';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const image = container.querySelector('img') as HTMLImageElement;
    if (!image) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    image.style.transformOrigin = `${x}% ${y}%`;
    image.style.transform = 'scale(1.5)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const image = container.querySelector('img') as HTMLImageElement;
    if (!image) return;
    
    image.style.transform = 'scale(1)';
    image.style.transformOrigin = 'center';
  };

  const goNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.realIndex);
  };

  return (
    <section className='w-full p-3 border border-border rounded-sm'>
      <div className='relative group mb-3'>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={handleSlideChange}
          loop={false}
          spaceBetween={10}
          navigation={false}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className='w-full'
        >
          <SwiperSlide className='relative w-full aspect-6/7 flex items-center justify-center overflow-hidden'>
            <div 
              className='relative w-full h-full cursor-zoom-in'
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={thumbnail}
                alt='Product thumbnail'
                fill
                sizes='100%'
                className={`${getImageClass(thumbnail)} transition-transform duration-300 ease-out`}
                onLoad={(e) => handleImageLoad(thumbnail, e)}
              />
            </div>
          </SwiperSlide>
          {images.map((image, index) => (
            <SwiperSlide key={index} className='relative w-full aspect-6/7 flex items-center justify-center overflow-hidden'>
              <div 
                className='relative w-full h-full cursor-zoom-in'
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={image}
                  alt='Product image'
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 33vw'
                  className={`${getImageClass(image)} transition-transform duration-300 ease-out`}
                  onLoad={(e) => handleImageLoad(image, e)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Previous Button - Hide khi ở slide đầu */}
        {currentSlide > 0 && (
          <button
            onClick={goPrev}
            className='lucide-nav-button nav-button-left cursor-pointer'
            aria-label='Previous image'
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
        )}
        
        {currentSlide < totalSlides - 1 && (
          <button
            onClick={goNext}
            className='lucide-nav-button nav-button-right cursor-pointer'
            aria-label='Next image'
          >
            <ArrowRight size={20} strokeWidth={2} />
          </button>
        )}
      </div>
      
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={false}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className='custom-thumb-swiper'
      >
        <SwiperSlide className='relative w-1/4 aspect-square flex items-center justify-center'>
          <Image
            src={thumbnail}
            alt='Product thumbnail'
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 33vw'
            className={getImageClass(thumbnail)}
            onLoad={(e) => handleImageLoad(thumbnail, e)}
          />
        </SwiperSlide>
        {images.map((image, index) => (
          <SwiperSlide key={index} className='relative w-full aspect-square flex items-center justify-center'>
            <Image
              src={image}
              alt='Product image'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 33vw'
              className={getImageClass(image)}
              onLoad={(e) => handleImageLoad(image, e)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default ProductImages;