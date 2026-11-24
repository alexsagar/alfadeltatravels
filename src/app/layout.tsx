import type { Metadata, Viewport } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

// Milestone 9.1: Manrope for display, headings and navigation; DM Sans for
// body copy and captions. Both are variable fonts, self-hosted by next/font
// with size-adjusted fallbacks, so the swap causes no layout shift.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Treks, Adventures & Journeys in Nepal`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, title: site.name, description: site.description },
};

export const viewport: Viewport = { themeColor: "#141c25" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning covers only <html>'s own attributes: browser
    // extensions (e.g. Google Tag Assistant's data-tag-assistant-prod-present)
    // write to it before React hydrates. Mismatches in children still report.
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${dmSans.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-cloud-50 focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
