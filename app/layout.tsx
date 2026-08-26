import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  "https://mahboubgs1.github.io/Ahmed-Mahboub-Enterprise-Portfolio";
const ogImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "أحمد محبوب | ملف التحول المؤسسي",
  description:
    "قيادة أنظمة ERP، والأنظمة المالية، والتحليلات التنفيذية، والتحول الرقمي، وتحسين التكاليف التقنية.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "أحمد محبوب | ملف التحول المؤسسي",
    description:
      "تحويل استثمارات ERP والمالية والتحليلات والتقنية إلى قيمة عملية قابلة للقياس.",
    type: "website",
    url: siteUrl,
    images: [{ url: ogImage, width: 1672, height: 941 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أحمد محبوب | ملف التحول المؤسسي",
    description:
      "قيادة ERP والأنظمة المالية والتحليلات التنفيذية والقيمة التقنية.",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
