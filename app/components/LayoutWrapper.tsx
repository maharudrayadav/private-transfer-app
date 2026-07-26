'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admintransfer');

  return (
    <body className="flex flex-col min-h-screen" suppressHydrationWarning>
      {!isAdminPage && <Header />}
      <main className={isAdminPage ? 'w-full flex-grow' : 'flex-grow'}>{children}</main>
      {!isAdminPage && <Footer />}
    </body>
  );
}
