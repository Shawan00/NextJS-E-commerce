"use client";

import { useEffect, useRef } from "react";
import lottie from 'lottie-web';


function AnimationNotFound() {
  const containerRef = useRef(null);
  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/404notfound.json',
    });

    return () => anim.destroy();
  }, []);

  return <div ref={containerRef} style={{ width: 450, height: 360 }} />;
}

export default AnimationNotFound;