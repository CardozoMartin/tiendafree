import { useEffect, useRef } from 'react'
import ICON from '../../assets/Logo.svg'
import gsap from 'gsap';

const Logo = () => {
  const logoBrushRefs = useRef<SVGPathElement[]>([]);
  useEffect(() => {
    gsap.to(logoBrushRefs.current, {
      strokeDashoffset: 0,
      duration: 0.25,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.3, // esperá un poco a que el nav aparezca
    });
  }, []);
  return (
    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 transition-opacity hover:opacity-80">
      <img src={ICON} alt="TiendiZi" className="w-12 h-16 sm:w-16 sm:h-[80px] object-contain" />
      <div>
        <div className="text-lg sm:text-2xl font-black tracking-[-0.04em] flex items-center">
          <span className="relative inline-flex items-center justify-center isolate">
            {/* 3 Diagonal Brush Strokes */}
            <svg
              className="absolute inset-0 -z-10 mx-auto w-[150%] h-[160%] -translate-x-3 -translate-y-2"
              viewBox="0 0 100 48"
              fill="none"
              stroke="#fca326"
              strokeWidth="14"
              strokeLinecap="round"
            >
              <path
                ref={(el) => {
                  if (el) logoBrushRefs.current[1] = el;
                }}
                className="opacity-95"
                d="M92,24 L10,24"
                pathLength="100"
                strokeDasharray="100"
                strokeDashoffset="100"
              />
              <path
                ref={(el) => {
                  if (el) logoBrushRefs.current[2] = el;
                }}
                className="opacity-90"
                d="M8,38 L95,34"
                pathLength="100"
                strokeDasharray="100"
                strokeDashoffset="100"
              />
            </svg>
            <span className="relative z-10 text-[#15110e] px-1 flex items-center">
              <span className="text-purple-600">TiendiZi</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Logo
