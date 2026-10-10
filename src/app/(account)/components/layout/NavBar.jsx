"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setUser, clearUser } from "@/redux/slices/authSlice";
import { clearMenus } from "@/redux/slices/menuSlice";
import { authApi } from "@/redux/api/authApi";
import { Menu, Bell } from "lucide-react";

export default function NavBar({ onToggleSidebar, isSidebarOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Fetch profile via Redux authApi if not present in state
  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      try {
        const res = await authApi.getProfile();
        const userData = res?.data || res?.user || res;
        if (isMounted && userData && (userData.name || userData.username || userData.email)) {
          dispatch(setUser(userData));
        }
      } catch (err) {
        console.warn("Failed to fetch user profile via authApi:", err);
      }
    }

    if (!currentUser) {
      fetchProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [currentUser, dispatch]);

  // Extract user details from Redux store currentUser
  const userName = currentUser?.name || currentUser?.username || currentUser?.email || "Admin User";
  const userRole = currentUser?.role?.name || currentUser?.role || "Administrator";
  const userEmail = currentUser?.email || `${currentUser?.username || 'admin'}@spotoptics.com`;

  const userInitials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  // Generate dynamic breadcrumb items based on current path
  const getBreadcrumb = () => {
    if (!pathname || pathname === "/dashboard") {
      return { category: "Workspace", page: "Overview" };
    }
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "Overview";
    const formattedPage = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    return { category: "Workspace", page: formattedPage };
  };

  const breadcrumb = getBreadcrumb();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("API logout error, completing local Redux session logout", err);
    } finally {
      dispatch(clearUser());
      dispatch(clearMenus());
      router.replace("/login");
    }
  };

  return (
    <header className="dashboard-topbar">
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-sm btn-light border d-inline-flex align-items-center justify-content-center p-2 me-1"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Navigation"
          title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          <Menu size={18} className="text-dark" />
        </button>

        <div className="dashboard-breadcrumb">
          {breadcrumb.category} <span>/</span> {breadcrumb.page}
        </div>
      </div>

      <div className="dashboard-topbar-actions">
        {/* Notifications Button & Dropdown */}
        <div className="dashboard-user-wrapper" ref={notificationRef}>
          <button
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
            className="icon-button"
            type="button"
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsUserMenuOpen(false);
            }}
          >
            <span aria-hidden="true">♧</span>
            <i />
          </button>

          {isNotificationsOpen && (
            <div className="dashboard-dropdown-menu notification-dropdown">
              <div className="dropdown-header">
                <strong>Notifications</strong>
                <span>Workspace Updates</span>
              </div>
              <div className="dropdown-content" style={{ padding: "6px 0" }}>
                <div className="dropdown-item" style={{ fontSize: "12px", cursor: "default" }}>
                  <span>✓ System update completed</span>
                </div>
                <div className="dropdown-item" style={{ fontSize: "12px", cursor: "default" }}>
                  <span>✦ New project assignment active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Area & Dropdown */}
        <div className="dashboard-user-wrapper" ref={userMenuRef}>
          <button
            type="button"
            className="dashboard-user-button"
            onClick={() => {
              setIsUserMenuOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            aria-expanded={isUserMenuOpen}
          >
            <div className="dashboard-user">
              <div className="user-avatar">{userInitials}</div>
              <div className="dashboard-user-details">
                <strong>{userName}</strong>
                <span>{userRole}</span>
              </div>
              <span className="user-chevron" aria-hidden="true">
                {isUserMenuOpen ? "▴" : "▾"}
              </span>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="dashboard-dropdown-menu">
              <div className="dropdown-header">
                <strong>{userName}</strong>
                <span>{userEmail}</span>
              </div>

              <Link
                href="/dashboard"
                className="dropdown-item"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <span aria-hidden="true">⌂</span> Dashboard Overview
              </Link>
              <Link
                href="/contact"
                className="dropdown-item"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <span aria-hidden="true">💬</span> Support & Help
              </Link>

              <div style={{ height: "1px", background: "#f0f4f3", margin: "4px 0" }} />

              <button
                type="button"
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <span aria-hidden="true">↪</span> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}