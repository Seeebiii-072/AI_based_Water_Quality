import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Water Quality AI Monitor",
  description: "Research prototype: AI soft sensor for Total Nitrogen estimation (simulated data).",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
