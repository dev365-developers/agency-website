// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "./providers/ClerkProvider";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import ConditionalLayout from "@/components/ConditionalLayout";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev365 | Get a Professional Website Built for Free",
  description:
    "Dev365 builds professional business websites at zero upfront cost. Pay a simple monthly fee. Design, hosting, maintenance included.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ReactQueryProvider>
            <ConditionalLayout>
              {children}
              <Toaster />
            </ConditionalLayout>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}