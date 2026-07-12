import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SomosUnefaEU",
  description: "Social media app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Header/Navbar */}
          <header className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 sticky top-0 z-50 shadow-sm">
            <Navbar />
          </header>
          {/* Main Content Area */}
          <main className="w-full min-h-[calc(100vh-64px)] bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 pb-10">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
