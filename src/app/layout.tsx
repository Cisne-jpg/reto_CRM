// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import MainLayout from "./Components/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  const isHome = typeof window !== "undefined" && window.location.pathname === "/";

  return (
    <html lang="en">
      <body className={inter.className}>
        {isHome ? children :<MainLayout>{children}</MainLayout>}
        
      </body>
    </html>
  );
}
