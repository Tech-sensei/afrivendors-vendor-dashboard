import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import ReduxProvider from "@/providers/ReduxProvider";
import AuthInitializer from "@/providers/AuthInitializer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const unbounded = localFont({
  src: [
    { path: "./fonts/Unbounded/Unbounded-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Unbounded/Unbounded-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Unbounded/Unbounded-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Unbounded/Unbounded-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Unbounded/Unbounded-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/Unbounded/Unbounded-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-unbounded-sans",
  display: "swap",
});

const unageo = localFont({
  src: [
    { path: "./fonts/Unageo/Unageo-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Unageo/Unageo-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Unageo/Unageo-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Unageo/Unageo-Semibold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Unageo/Unageo-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Unageo/Unageo-Extrabold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/Unageo/Unageo-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-unageo-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Afrivendors ",
  description: "Connecting African Vendors to the World.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable} ${unageo.variable} antialiased`}>
        <ReduxProvider>
          <AuthInitializer>
            <ReactQueryProvider>
              <Toaster />
              {children}
            </ReactQueryProvider>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
