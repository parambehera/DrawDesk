"use client";

import React, { useEffect, useState } from "react";

export default function MobileBlocker({ children }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024); // less than desktop (lg)
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-[#f5f9ff] via-[#eef4ff] to-[#f7fbff] px-6">
        <div className="max-w-md w-full rounded-3xl bg-white/70 border border-white shadow-xl p-8 text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Desktop Required 💻
          </h1>

          <p className="mt-3 text-gray-600">
            CollabBoard works best on Desktop. Please open this website on a
            laptop/PC to unlock all whiteboard features.
          </p>

          <div className="mt-6 text-sm text-gray-500">
            Tip: Use Chrome on desktop for best performance ⚡
          </div>
        </div>
      </div>
    );
  }

  return children;
}
