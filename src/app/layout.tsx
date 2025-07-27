// app/layout.tsx
import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google"; // Import EB Garamond
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Configure EB Garamond
const ebGaramond = EB_Garamond({
  subsets: ["latin"], // Specify the character set
  weight: ["700", "800"], // Include regular and bold weights
  variable: "--font-eb-garamond", // Optional: Define a CSS variable
});

export const metadata: Metadata = {
  title: "ReEnvision",
  description:
    "ReEnvision is a student-run nonprofit organization dedicated to bridging the digital divide by making technology accessible to underserved communities.",
  icons: {
    icon: "/favicon.png", // This tells Next.js to use your PNG favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ebGaramond.variable}`}>
      <body className="antialiased bg-[#F0F8FF]">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
