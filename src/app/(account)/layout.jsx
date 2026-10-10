"use client";

import { useState, useEffect } from "react";
import "./account.css";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/NavBar";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setUser, clearUser } from "@/redux/slices/authSlice";
import { authApi } from "@/redux/api/authApi";

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const isLoginPage = pathname === "/login" || pathname?.startsWith("/login");

  // State to control sidebar open/closed state across all devices
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage && !currentUser);

  // Client-side session protection: Verify JWT session profile via Redux authApi
  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    let isMounted = true;
    async function verifySession() {
      try {
        const res = await authApi.getProfile();
        const userData = res?.data || res?.user || res;
        if (userData && (userData.name || userData.username || userData.email)) {
          if (isMounted) {
            dispatch(setUser(userData));
            setCheckingAuth(false);
          }
        } else {
          throw new Error("Invalid session payload");
        }
      } catch (err) {
        if (isMounted) {
          dispatch(clearUser());
          router.replace("/login");
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [isLoginPage, dispatch, router]);

  // Auto-detect viewport on mount: collapse sidebar by default on mobile/tablet (< 992px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // On Login page, render only children without Sidebar & Navbar
  if (isLoginPage) {
    return <div className="account-shell">{children}</div>;
  }

  // Show loading indicator while session is being authenticated
  if (checkingAuth && !currentUser) {
    return (
      <div className="account-shell d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Authenticating session...</span>
        </div>
      </div>
    );
  }

  // Dashboard Shell with dynamic sidebar toggle classes
  return (
    <div className="account-shell">
      <div className={`dashboard-shell ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        {/* Mobile/Tablet Backdrop Overlay */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay d-lg-none"
            onClick={closeSidebar}
            aria-label="Close Mobile Sidebar Backdrop"
          />
        )}

        {/* Sidebar Component */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Dashboard Content */}
        <div className="dashboard-content">
          <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          {children}
        </div>
      </div>
    </div>
  );
}
