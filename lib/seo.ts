export const SITE_NAME = "BNI Lucky Draw";
export const SITE_NAME_ZH = "免費線上抽獎器";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://introvista.ai";

export const SEO_KEYWORDS = [
  "抽獎",
  "獎項",
  "獎品",
  "抽獎APP",
  "抽獎器",
  "線上抽獎",
  "免費抽獎",
  "幸運轉盤",
  "轉盤抽獎",
  "現場抽獎",
  "抽獎工具",
  "抽獎軟體",
  "抽獎程式",
  "摸彩",
  "BNI抽獎",
  "商務例會抽獎",
  "活動抽獎",
  "婚禮抽獎",
  "尾牙抽獎",
  "lucky draw",
  "lottery wheel",
  "prize draw",
] as const;

export const SEO_DESCRIPTION =
  "免費線上抽獎器與幸運轉盤抽獎 APP：支援獎項、獎品設定與名單匯入，一鍵現場抽獎。適合例會、活動、尾牙、婚禮的轉盤抽獎工具，無需安裝、開啟即用。";

export const SEO_TITLE =
  "免費線上抽獎器｜幸運轉盤抽獎 APP — 獎項、獎品、名單現場抽獎";

export const SEO_FEATURES = [
  "幸運轉盤視覺化抽獎",
  "自訂抽獎獎項與獎品圖片",
  "名單匯入（空格、換行、標點分隔）",
  "已得獎者自動排除",
  "1080p 投影友善版面",
  "純前端免安裝，關閉分頁即重置",
  "慶祝煙火與得獎彈窗",
] as const;

export function buildWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME_ZH,
    alternateName: [SITE_NAME, "抽獎器", "抽獎APP", "幸運轉盤抽獎"],
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TWD",
    },
    featureList: SEO_FEATURES,
    inLanguage: "zh-Hant",
    keywords: SEO_KEYWORDS.join(", "),
    author: {
      "@type": "Organization",
      name: "introvista",
      url: "https://introvista.ai",
    },
    publisher: {
      "@type": "Organization",
      name: "introvista",
      url: "https://introvista.ai",
    },
    audience: {
      "@type": "Audience",
      audienceType: "活動主辦人、主持人、BNI 例會、企業尾牙",
    },
  };
}

export function buildWebPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "zh-Hant",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: [
      { "@type": "Thing", name: "抽獎" },
      { "@type": "Thing", name: "獎項" },
      { "@type": "Thing", name: "獎品" },
      { "@type": "Thing", name: "抽獎器" },
    ],
  };
}
