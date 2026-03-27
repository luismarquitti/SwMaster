import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwMaster — Command Center",
  description:
    "Data-Driven Command Center for the SwMaster Autonomous Software Engineering Agent. Powered by SWEBOK v4, LangGraph, and Gemini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0" />
      </head>
      <body className="min-h-full flex">{children}</body>
    </html>
  );
}
