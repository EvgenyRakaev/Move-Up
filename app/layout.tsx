import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/lora/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "movebase",
  description: "Dispatch and crew app for moving companies",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
