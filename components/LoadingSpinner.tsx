'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-[#00ffcc] animate-spin" />
    </div>
  );
}
