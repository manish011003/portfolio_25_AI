import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE, SITE_NAME, TWITTER_HANDLE } from "@/lib/seo";
import { Bebas_Neue, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/pm/ThemeProvider";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

const dm = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://manishbiswashere.vercel.app"),
  title: "Manish Biswas | AI Engineer & Product Manager",
  description: "AI Engineer & Product Manager portfolio.",
  applicationName: SITE_NAME,
  authors: [{ name: "Manish Biswas", url: SITE }],
  creator: "Manish Biswas",
  manifest: "/site.webmanifest",
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", creator: TWITTER_HANDLE, site: TWITTER_HANDLE, images: [DEFAULT_OG_IMAGE.url] },
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("pm-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className={`${bebas.variable} ${plex.variable} ${dm.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
