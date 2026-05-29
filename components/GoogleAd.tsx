"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const AD_CLIENT = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT;
const AD_SLOT = process.env.NEXT_PUBLIC_GOOGLE_ADS_SLOT;

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function GoogleAd() {
  const pushed = useRef(false);

  const pushAd = () => {
    if (pushed.current || !AD_CLIENT || !AD_SLOT) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blocker or script not ready
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle) {
      pushAd();
    }
  }, []);

  if (!AD_CLIENT || !AD_SLOT) {
    return (
      <div
        className="flex min-h-[90px] w-full items-center justify-center border border-dashed border-gray-300 bg-gray-50 text-xs text-[var(--text-muted)]"
        aria-label="廣告版位"
      >
        Google 廣告版位
      </div>
    );
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={pushAd}
      />
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-label="lucky下方"
      />
    </>
  );
}