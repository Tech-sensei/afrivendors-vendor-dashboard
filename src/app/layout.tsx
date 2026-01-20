import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const unboundedSans = localFont({
  src: [
    { path: "../../public/fonts/Unbounded/Unbounded-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Unbounded/Unbounded-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Unbounded/Unbounded-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Unbounded/Unbounded-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Unbounded/Unbounded-Black.ttf", weight: "900", style: "normal" },
    { path: "../../public/fonts/Unbounded/Unbounded-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-unbounded-sans",
  display: "swap",
});

const unageo = localFont({
  src: [
    { path: "../../public/fonts/Unageo/Unageo-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Semibold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Extrabold.ttf", weight: "800", style: "normal" },
    { path: "../../public/fonts/Unageo/Unageo-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-unageo-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Afrivendors ",
  description: "Connecting African Vendors to the World",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${unboundedSans.variable} ${unageo.variable} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
