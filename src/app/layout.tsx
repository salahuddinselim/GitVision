import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";

export const metadata: Metadata = {
  title: {
    default: "GitVision | Learn Git Visually",
    template: "%s | GitVision",
  },
  description:
    "The best Git visualization learning platform. Learn Git through interactive terminals, animated commit graphs, and comprehensive documentation.",
  keywords: [
    "git visualization",
    "learn git",
    "git tutorial",
    "git playground",
    "git commands",
    "git merge conflict",
    "version control",
    "git learning",
  ],
  authors: [{ name: "GitVision" }],
  creator: "SabrSoftware",
  publisher: "SabrSoftware",
  metadataBase: new URL("https://gitvision.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gitvision.dev",
    title: "GitVision | Learn Git Visually",
    description: "Interactive Git visualization, terminals, and tutorials.",
    siteName: "GitVision",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GitVision - Learn Git Visually",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitVision | Learn Git Visually",
    description: "Learn Git through interactive visualization.",
    creator: "@gitvision",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://gitvision.dev",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f11",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className="antialiased">
        <Providers>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <AIAssistant />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
