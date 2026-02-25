import { useEffect, useRef, type RefObject } from 'react';

export const useSmoothHorizontalScroll = (ref: RefObject<HTMLElement | null>) => {
  const animationId = useRef<number | null>(null);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const isAnimating = useRef(false);
  const lastWheelTime = useRef(0);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = () => {
      if (!isAnimating.current) return;

      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.2; 

      if (Math.abs(targetScroll.current - currentScroll.current) < 1) {
        currentScroll.current = targetScroll.current;
        isAnimating.current = false;
      } else {
        animationId.current = requestAnimationFrame(animate);
      }
      
      element.scrollLeft = currentScroll.current;
    };

    const startAnimation = () => {
      if (!isAnimating.current) {
        currentScroll.current = element.scrollLeft;
        isAnimating.current = true;
        animate();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastWheelTime.current < 10) return;
      lastWheelTime.current = now;
      
      targetScroll.current += e.deltaY * 2.5;
      
      const maxScroll = element.scrollWidth - element.clientWidth;
      targetScroll.current = Math.max(0, Math.min(targetScroll.current, maxScroll));
      
      startAnimation();
    };

    const handleTouchStart = (e: TouchEvent) => {
      isAnimating.current = false;
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
        animationId.current = null;
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [ref]);
};