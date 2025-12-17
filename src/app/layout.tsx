import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

// Single place to change primary font - Noto Sans (Hindi + English friendly)
const notoSans = Noto_Sans({
  variable: "--font-primary",
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IFMIS - Integrated Financial Management System",
  description: "Madhya Pradesh Integrated Financial Management Information System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} font-primary antialiased`}>
        {children}
      </body>
    </html>
  );
}
