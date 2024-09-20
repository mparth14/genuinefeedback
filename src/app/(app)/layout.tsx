import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Genuine Feedback",
  description: "Real feedback from real people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={inter.className}>
          <Navbar></Navbar>
          {children}
        </body>
    </html>
  );
}
