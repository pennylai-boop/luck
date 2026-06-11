"use client";

import Script from "next/script";
import { GoogleAd } from "@/components/GoogleAd";

const KOFI_USERNAME = "T6T71VQ7LT";
const BNI_RED = "#c00000";

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, options: Record<string, string>) => void;
    };
  }
}

function initKofiWidget() {
  window.kofiWidgetOverlay?.draw(KOFI_USERNAME, {
    type: "floating-chat",
    "floating-chat.donateButton.text": "請我喝杯咖啡",
    "floating-chat.donateButton.background-color": BNI_RED,
    "floating-chat.donateButton.text-color": "#fff",
    "floating-chat.position": "right",
  });
}

export function SponsorFooter() {
  return (
    <>
      <Script
        src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
        strategy="afterInteractive"
        onLoad={initKofiWidget}
      />
      <footer className="w-full border-t border-gray-200 bg-white py-4">
        <a
          href="https://introvista.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 block text-center text-xs text-gray-400 transition hover:text-gray-600 lg:hidden"
        >
          © 2026 introvista x fore cons.
        </a>
        <GoogleAd />
      </footer>
    </>
  );
}
