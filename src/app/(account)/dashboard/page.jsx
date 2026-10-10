"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Users, 
  Link as LinkIcon, 
  Menu as MenuIcon, 
  ArrowRight, 
  Download,
  RefreshCw,
  Clock,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/stats");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to load dashboard data.");
      }
    } catch (err) {
      setError("Network error while loading dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const userRole = String(data?.user?.role || "ADMIN").toUpperCase();
  const userName = data?.user?.name || "User";
  const stats = data?.stats || {
    totalSoftware: 0,
    activeLinks: 0,
    totalUsers: 0,
    activeMenus: 0,
    distributorsCount: 0,
    clientsCount: 0,
    usedLinksCount: 0,
    pendingLinksCount: 0,
  };
  const activities = data?.recentActivities || [];
  const progress = data?.progress || {
    completedPercentage: 0,
    completedCount: 0,
    inProgressCount: 0,
    totalCount: 0,
  };

  const isAdmin = userRole === "ADMIN";
  const isDistributor = userRole === "DISTRIBUTOR";
  const isClient = userRole === "CLIENT";

  return (
    <>
      <main className="dashboard-main">
        {/* Role-tailored Welcome Header */}
        <div className="dashboard-welcome d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <span className="account-eyebrow">
              {isAdmin ? "ADMINISTRATOR WORKSPACE" : isDistributor ? "DISTRIBUTOR PORTAL" : "CLIENT DASHBOARD"}
            </span>
            <h1>
              Good day, {userName} <span aria-hidden="true">✦</span>
            </h1>
            <p>
              {isAdmin
                ? "Here is your global system overview and real-time workspace metrics."
                : isDistributor
                ? "Manage your assigned clients, software links, and distribution progress."
                : "Access your assigned software packages and secure download links."}
            </p>
          </div>

          {/* Role-based Header Action Button */}
          <div className="d-flex gap-2 align-items-center">
            <button 
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
              type="button"
              onClick={fetchDashboardStats}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? "spin" : ""} />
              <span>Refresh</span>
            </button>

            {isAdmin && (
              <Link className="dashboard-primary-button text-decoration-none" href="/dashboard/software">
                <span aria-hidden="true">＋</span> New Software
              </Link>
            )}

            {isDistributor && (
              <Link className="dashboard-primary-button text-decoration-none" href="/dashboard/links">
                <span aria-hidden="true">＋</span> Generate Link
              </Link>
            )}

            {isClient && (
              <Link className="dashboard-primary-button text-decoration-none" href="/dashboard/downloads">
                <Download size={14} className="me-1" /> My Downloads
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="alert alert-warning alert-dismissible fade show my-3" role="alert">
            <AlertCircle size={16} className="me-2" />
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close" />
          </div>
        )}

        {/* Live Role-Tailored Summary Cards */}
        <section aria-label="Workspace summary" className="dashboard-stats">
          {/* Card 1: Software Packages */}
          <article className="dashboard-stat-card">
            <div className="stat-card-top">
              <span>{isClient ? "Assigned Software" : "Software Packages"}</span>
              <span className="stat-icon stat-icon-blue">
                <Package size={16} />
              </span>
            </div>
            <strong>{loading ? "..." : String(stats.totalSoftware).padStart(2, "0")}</strong>
            <p>
              <span className="stat-positive">
                {isClient ? "Available" : isDistributor ? "In Catalog" : "Active"}
              </span>{" "}
              <span>{isClient ? "for download" : "catalog items"}</span>
            </p>
            <div className="stat-sparkline sparkline-blue" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i />
            </div>
          </article>

          {/* Card 2: Links / Downloads */}
          <article className="dashboard-stat-card">
            <div className="stat-card-top">
              <span>{isClient ? "Available Downloads" : "Secure Links"}</span>
              <span className="stat-icon stat-icon-green">
                <LinkIcon size={16} />
              </span>
            </div>
            <strong>
              {loading
                ? "..."
                : isClient
                ? String(stats.pendingLinksCount).padStart(2, "0")
                : String(stats.activeLinks).padStart(2, "0")}
            </strong>
            <p>
              {isClient ? (
                <span className="stat-positive">{stats.usedLinksCount} Claimed</span>
              ) : (
                <span className="stat-positive">{stats.usedLinksCount} Used</span>
              )}{" "}
              <span>({stats.pendingLinksCount} pending)</span>
            </p>
            <div className="stat-sparkline sparkline-green" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i />
            </div>
          </article>

          {/* Card 3: Users (Only visible to Admin & Distributor) */}
          {(isAdmin || isDistributor) && (
            <article className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>{isAdmin ? "System Users" : "My Clients"}</span>
                <span className="stat-icon stat-icon-orange">
                  <Users size={16} />
                </span>
              </div>
              <strong>
                {loading
                  ? "..."
                  : String(isAdmin ? stats.totalUsers : stats.clientsCount).padStart(2, "0")}
              </strong>
              <p>
                {isAdmin ? (
                  <span className="stat-neutral">
                    {stats.distributorsCount} Dist. / {stats.clientsCount} Clients
                  </span>
                ) : (
                  <span className="stat-positive">Active assigned clients</span>
                )}
              </p>
              <div className="stat-sparkline sparkline-orange" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i />
              </div>
            </article>
          )}

          {/* Card 4: Navigation Menus (Admin Only) */}
          {isAdmin && (
            <article className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>Active Menus</span>
                <span className="stat-icon stat-icon-purple">
                  <MenuIcon size={16} />
                </span>
              </div>
              <strong>{loading ? "..." : String(stats.activeMenus).padStart(2, "0")}</strong>
              <p>
                <span className="stat-positive">Dynamic</span> <span>sidebar links</span>
              </p>
              <div className="stat-sparkline sparkline-purple" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i />
              </div>
            </article>
          )}
        </section>

        {/* Lower Grid: Role-filtered Activity & Progress */}
        <section className="dashboard-lower-grid">
          {/* Recent Activity Panel */}
          <article className="dashboard-panel activity-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  {isAdmin
                    ? "System Activity Logs"
                    : isDistributor
                    ? "Client & Distribution Logs"
                    : "My Activity History"}
                </h2>
                <p>
                  {isAdmin
                    ? "Full system audit trail across all users"
                    : isDistributor
                    ? "Actions performed by you and your assigned clients"
                    : "Your recent software access and download history"}
                </p>
              </div>

              {isAdmin && (
                <Link href="/dashboard/logs" className="text-button text-decoration-none">
                  View all <ArrowRight size={14} className="ms-1" aria-hidden="true" />
                </Link>
              )}
            </div>

            <div className="activity-list">
              {loading ? (
                <div className="p-4 text-center text-muted small">Loading live activity stream...</div>
              ) : activities.length === 0 ? (
                <div className="p-4 text-center text-muted small">No recent activity logs recorded yet.</div>
              ) : (
                activities.map((activity, idx) => (
                  <div className="activity-row" key={activity.id || idx}>
                    <div className={`activity-avatar avatar-${activity.color || "mint"}`}>
                      {activity.initials}
                    </div>
                    <div className="activity-copy">
                      <p>
                        <strong>{activity.name}</strong> {activity.action}
                      </p>
                      <span>{activity.item}</span>
                    </div>
                    <time className="d-flex align-items-center gap-1 text-muted small">
                      <Clock size={12} /> {activity.time}
                    </time>
                  </div>
                ))
              )}
            </div>
          </article>

          {/* Progress & Distribution Panel */}
          <article className="dashboard-panel progress-panel">
            <div className="panel-heading">
              <div>
                <h2>
                  {isClient ? "Download Completion" : "Link Redemption Progress"}
                </h2>
                <p>
                  {isClient
                    ? "Status of claimed software download packages"
                    : "Ratio of claimed vs pending links"}
                </p>
              </div>
              {!isClient && (
                <Link href="/dashboard/links" className="more-button text-decoration-none" title="Manage Links">
                  ···
                </Link>
              )}
            </div>

            <div className="progress-ring-wrap">
              <div 
                className="progress-ring"
                style={{
                  background: `conic-gradient(#168b7a 0deg ${progress.completedPercentage * 3.6}deg, #e8f0ed ${progress.completedPercentage * 3.6}deg 360deg)`
                }}
              >
                <div>
                  <strong>{loading ? "..." : `${progress.completedPercentage}%`}</strong>
                  <span>{isClient ? "downloaded" : "claimed"}</span>
                </div>
              </div>
            </div>

            <div className="progress-legend">
              <span>
                <i className="legend-complete" /> {isClient ? "Downloaded Packages" : "Claimed Links"} <strong>{progress.completedCount}</strong>
              </span>
              <span>
                <i className="legend-pending" /> {isClient ? "Available Tokens" : "Pending Claim"} <strong>{progress.inProgressCount}</strong>
              </span>
              <span>
                <i className="legend-review" /> Total Assigned <strong>{progress.totalCount}</strong>
              </span>
            </div>
          </article>
        </section>
      </main>

      <footer className="dashboard-footer">
        <span>© {new Date().getFullYear()} SpotOptics Workspace</span>
        <span>Built for a clearer view.</span>
      </footer>
    </>
  );
}
