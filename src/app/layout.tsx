// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import MainLayout from "./Components/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Aquí renderizamos un componente cliente para manejar la sidebar */}
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
