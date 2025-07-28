import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Feynman Book Store",
  description: "Pembelian Buku Feynman Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        <nav className="flex items-center gap-4 px-6 py-4 shadow-md bg-black text-white">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-feynmanbookstore.png"
                alt="Feynman Logo"
                width={36}
                height={36}
              />
              <span className="text-lg font-semibold">Feynman Bookstore</span>
            </div>
          </Link>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}
