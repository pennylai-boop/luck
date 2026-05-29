import type { Metadata } from "next";
import { LuckyDrawApp } from "@/components/LuckyDrawApp";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/lib/seo";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
};

export default function Home() {
  return <LuckyDrawApp />;
}
