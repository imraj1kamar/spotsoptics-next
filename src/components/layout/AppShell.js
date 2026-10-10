'use client';

import { usePathname } from "next/navigation";
import BootstrapClient from "@/components/BootstrapClient";
import CookieConsent from "@/components/CookieConsentClient";
import Preloader from "@/components/common/Preloader";
import ScrollToTop from "@/components/common/ScrollToTop";
import Chatbot from "@/components/common/Chatbot";
import Navbar from "@/components/layout/Navbar";
import FooterSection from "@/components/layout/FooterSection";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAccountRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (isAccountRoute) {
    return children;
  }

  return (
    <>
      <BootstrapClient />
      <Preloader />
      <CookieConsent />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <FooterSection />
      <ScrollToTop />
      <Chatbot />
    </>
  );
}
