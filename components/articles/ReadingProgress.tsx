"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateProgress() {
      const maximumScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximumScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maximumScroll) * 100)) : 0);
    }
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return <div aria-label="Okuma ilerlemesi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} role="progressbar" className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"><div className="h-full bg-[#C9A14A] transition-[width] duration-100" style={{ width: `${progress}%` }} /></div>;
}
