import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./components/Providers";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pawsky Wawsky | Premium Pet Adoption Platform",
  description: "Find your perfect, fluffy soulmate today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#EAD7C3] relative`}
      >
        {/* Forces the browser to hand scroll restoration duties fully back to Next.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }`
          }}
        />

        {/* Global Cozy Cozy-Web Grid */}
        <div 
          className="fixed inset-0 opacity-[0.06] pointer-events-none z-0 bg-[linear-gradient(to_right,#3C3232_1px,transparent_1px),linear-gradient(to_bottom,#3C3232_1px,transparent_1px)] bg-[size:28px_28px]" 
        />
        
        <AuthProvider>
          <Providers>
            <div className="relative z-10 min-h-screen flex flex-col">
              <Navbar />
              <div className="flex-1">
                {children}
                <Toaster position="top-center" reverseOrder={false} />
              </div>
            </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}