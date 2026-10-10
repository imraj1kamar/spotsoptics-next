"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, logout as logoutAction } from "@/redux/slices/authSlice";
import { setMenus, setLoading, selectMenus, selectLoading, clearMenus } from "@/redux/slices/menuSlice";
import { menuApi } from "@/redux/api/menuApi";
import { authApi } from "@/redux/api/authApi";

const ICON_MAP = {
  Home: "⌂",
  Users: "♙",
  Database: "▦",
  Link: "🔗",
  Download: "⤓",
  MessageSquare: "💬",
  Settings: "⚙",
  Activity: "▥",
  Menu: "☰",
};

import { X } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const currentUser = useSelector(selectCurrentUser);
  const reduxMenus = useSelector(selectMenus);
  const isLoading = useSelector(selectLoading);

  // Fetch dynamic menus from API
  useEffect(() => {
    let isMounted = true;
    async function fetchMenus() {
      try {
        dispatch(setLoading(true));
        const res = await menuApi.getMenus();
        if (isMounted) {
          const menuList = res?.data || res;
          if (Array.isArray(menuList)) {
            dispatch(setMenus(menuList));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch menus from API:", err);
      } finally {
        if (isMounted) {
          dispatch(setLoading(false));
        }
      }
    }

    fetchMenus();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // Transform dynamic menus from API/Redux
  const items = useMemo(() => {
    if (!Array.isArray(reduxMenus)) return [];

    return reduxMenus.map((m) => {
      const iconSymbol = ICON_MAP[m.icon] || m.icon || "▦";
      return {
        id: m.id,
        label: m.label || m.name || "Menu Item",
        icon: iconSymbol,
        href: m.href || m.path || "#",
      };
    });
  }, [reduxMenus]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("API logout error, completing local session logout", err);
    } finally {
      dispatch(logoutAction());
      dispatch(clearMenus());
      router.replace("/login");
    }
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? "is-open" : "is-closed"}`}>
      <div className="d-flex align-items-center justify-content-between mb-4 me-2">
        <Link className="account-brand dashboard-brand mb-0" href="/dashboard" onClick={onClose}>
          <span className="account-brand-mark">S</span>
          <span>SpotOptics</span>
        </Link>
        {onClose && (
          <button
            type="button"
            className="btn btn-sm btn-light border p-1 d-lg-none"
            onClick={onClose}
            aria-label="Close Mobile Navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>
      <nav aria-label="Dashboard navigation" className="dashboard-navigation">
        {isLoading && items.length === 0 ? (
          <div style={{ padding: "12px", color: "#87938f", fontSize: "12px" }}>
            Loading navigation...
          </div>
        ) : (
          items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && item.href !== "#" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.id || item.href || item.label}
                aria-current={isActive ? "page" : undefined}
                className={`dashboard-nav-link${isActive ? " is-active" : ""}`}
                href={item.href}
                onClick={onClose}
              >
                <span className="dashboard-nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })
        )}
      </nav>

    

      <button className="dashboard-logout" onClick={handleLogout} type="button">
        <span aria-hidden="true">↪</span> Sign out
      </button>
    </aside>
  );
}