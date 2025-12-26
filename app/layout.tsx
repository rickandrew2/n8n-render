import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Automation Agency Philippines | Digital Transformation Solutions",
  description:
    "Transform your business with AI-powered automation, digital marketing solutions, and custom integrations. Expert automation agency serving the Philippines.",
  keywords: [
    "AI automation",
    "workflow automation",
    "digital marketing",
    "business automation",
    "Philippines",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}



