import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
    images: [{ url: "/og.png", width: 1672, height: 941 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Mahboub | Enterprise Transformation Portfolio",
    description:
      "ERP leadership, finance systems, executive analytics, and technology value.",
    images: ["/og.png"],
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
