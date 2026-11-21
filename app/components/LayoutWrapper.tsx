'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import FloatingContact from "./FloatingContact";
import PageLoader from "./PageLoader";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admintransfer');
  const isDriverDashboard = pathname?.startsWith('/driver/dashboard');
  const isPortalPage = isAdminPage || isDriverDashboard;

  return (
    <body className="flex flex-col min-h-screen" suppressHydrationWarning>
      {!isPortalPage && <PageLoader />}
      {!isPortalPage && <Header />}
      <main className={isPortalPage ? 'w-full flex-grow' : 'flex-grow'}>{children}</main>
      {!isPortalPage && <Footer />}
      {!isPortalPage && <FloatingContact />}
    </body>
  );
}
