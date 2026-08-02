import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  "https://mahboubgs1.github.io/Ahmed-Mahboub-Enterprise-Portfolio";
const ogImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ahmed Mahboub | Enterprise Transformation Portfolio",
  description:
    "ERP leadership, finance systems, executive analytics, digital transformation, and technology cost optimization.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Ahmed Mahboub | Enterprise Transformation Portfolio",
    description:
      "Turning ERP, finance, analytics, and technology investments into measurable business value.",
    type: "website",
    url: siteUrl,
    images: [{ url: ogImage, width: 1672, height: 941 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Mahboub | Enterprise Transformation Portfolio",
    description:
      "ERP leadership, finance systems, executive analytics, and technology value.",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
