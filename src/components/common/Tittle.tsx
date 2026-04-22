const Tittle = () => {
  return (
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
            <path className="opacity-95" d="M92,24 L10,24" />
            <path className="opacity-90" d="M8,38 L95,34" />
          </svg>
          <span className="relative z-10 text-[#15110e] px-1 flex items-center">
            <span className="text-purple-600">TiendiZi</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export default Tittle
