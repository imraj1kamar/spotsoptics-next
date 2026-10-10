"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Eye, RefreshCw, Terminal, Clock, User, Globe } from "lucide-react";
import { logApi } from "@/redux/api/logApi";

import Card from "@/app/(account)/components/ui/Card";
import Table from "@/app/(account)/components/ui/Table";
import Button from "@/app/(account)/components/ui/Button";
import Modal from "@/app/(account)/components/ui/Modal";
import Alert from "@/app/(account)/components/ui/Alert";
import Breadcrumb from "@/app/(account)/components/ui/Breadcrumb";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, USER_MANAGEMENT, SOFTWARE_LINKS, AUTH
  const [alert, setAlert] = useState(null);

  // Selected Log for Details Modal
  const [selectedLog, setSelectedLog] = useState(null);

  // Fetch activity logs via Redux logApi
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await logApi.getLogs();
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setLogs(list);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load audit activity logs via Redux logApi." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs by module tab
  const filteredLogs = useMemo(() => {
    if (activeTab === "ALL") return logs;
    return logs.filter((l) => String(l.module).toUpperCase() === activeTab);
  }, [logs, activeTab]);

  // Format action badge color
  const getActionBadge = (action) => {
    const act = String(action).toUpperCase();
    if (act.includes("LOGIN") || act.includes("AUTH")) {
      return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">{action}</span>;
    }
    if (act.includes("DELETE") || act.includes("REVOKE") || act.includes("BLOCK")) {
      return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">{action}</span>;
    }
    if (act.includes("CREATE") || act.includes("GENERATE") || act.includes("ADD")) {
      return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">{action}</span>;
    }
    return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1">{action}</span>;
  };

  // Table columns definition
  const columns = [
    {
      header: "Action",
      accessor: "action",
      render: (action, row) => (
        <div>
          {getActionBadge(action)}
          <div className="text-muted small mt-1 font-monospace" style={{ fontSize: "11px" }}>
            Module: {row.module || "GENERAL"}
          </div>
        </div>
      ),
    },
    {
      header: "Performed By",
      accessor: "user",
      render: (user) =>
        user ? (
          <div>
            <div className="fw-semibold text-dark">{user.name}</div>
            <div className="text-muted small">@{user.username} • <span className="badge bg-light text-dark border">{user.role}</span></div>
          </div>
        ) : (
          <span className="text-muted small">System / Anonymous</span>
        ),
    },
    {
      header: "Details",
      accessor: "details",
      render: (details) => (
        <span className="small text-secondary text-truncate d-inline-block" style={{ maxWidth: "320px" }}>
          {details || "No details string recorded"}
        </span>
      ),
    },
    {
      header: "IP Address",
      accessor: "ipAddress",
      render: (ip) => (
        <span className="font-monospace small text-dark bg-light px-2 py-1 border rounded-2">
          {ip || "127.0.0.1"}
        </span>
      ),
    },
    {
      header: "Timestamp",
      accessor: "createdAt",
      render: (date) => (
        <span className="small text-muted">
          {date ? new Date(date).toLocaleString() : "Recently"}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: "id",
      sortable: false,
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedLog(row)}
          title="View Full Audit Details"
        >
          <Eye style={{ width: "14px", height: "14px" }} /> View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 d-flex flex-column gap-4">
      {/* Header & Breadcrumb */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Activity & Audit Logs" }]} />
          <h1 className="h4 fw-bold text-dark mb-1 mt-2">Activity & Audit Log Tracking</h1>
          <p className="text-muted small mb-0">
            Monitor real-time system events, user actions, IP address logs, and security audit trails.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" size="md" onClick={fetchLogs} isLoading={loading}>
            <RefreshCw style={{ width: "16px", height: "16px" }} /> Refresh Logs
          </Button>
        </div>
      </div>

      {/* Global Alert Notification */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          className="mb-2"
        />
      )}

      {/* Audit Logs Table */}
      <Card
        title="Recorded Activity Logs"
        subtitle={`Total logged events: ${logs.length}`}
        headerAction={
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${activeTab === "ALL" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("ALL")}
            >
              All ({logs.length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "USER_MANAGEMENT" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("USER_MANAGEMENT")}
            >
              Users ({logs.filter((l) => String(l.module).toUpperCase() === "USER_MANAGEMENT").length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "SOFTWARE_LINKS" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("SOFTWARE_LINKS")}
            >
              Software ({logs.filter((l) => String(l.module).toUpperCase() === "SOFTWARE_LINKS").length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "AUTH" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("AUTH")}
            >
              Auth ({logs.filter((l) => String(l.module).toUpperCase() === "AUTH").length})
            </button>
          </div>
        }
      >
        <Table
          columns={columns}
          data={filteredLogs}
          searchable={true}
          searchPlaceholder="Search by action, user, module, IP address..."
          itemsPerPage={10}
          emptyMessage={loading ? "Loading audit logs..." : "No activity logs recorded."}
        />
      </Card>

      {/* LOG DETAILS MODAL */}
      <Modal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        title={`Audit Log Event #${selectedLog?.id || ""}`}
        maxWidth="modal-lg"
      >
        {selectedLog && (
          <div className="text-start d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center p-3 bg-light border rounded-3">
              <div>
                <span className="text-muted small d-block">Action Event</span>
                <strong className="h6 text-dark mb-0">{selectedLog.action}</strong>
              </div>
              <div>{getActionBadge(selectedLog.action)}</div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-white">
                  <div className="d-flex align-items-center gap-2 mb-1 text-primary small fw-semibold">
                    <User style={{ width: "16px", height: "16px" }} /> User Details
                  </div>
                  <div className="fw-semibold text-dark">{selectedLog.user?.name || "System"}</div>
                  <div className="text-muted small">
                    @{selectedLog.user?.username || "system"} • Role: {selectedLog.user?.role || "SYSTEM"}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-white">
                  <div className="d-flex align-items-center gap-2 mb-1 text-primary small fw-semibold">
                    <Globe style={{ width: "16px", height: "16px" }} /> Network & Device
                  </div>
                  <div className="font-monospace small text-dark">IP: {selectedLog.ipAddress || "127.0.0.1"}</div>
                  <div className="text-muted small text-truncate" title={selectedLog.userAgent || "Browser"}>
                    {selectedLog.userAgent || "Standard Web Browser"}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-3 bg-white">
              <div className="d-flex align-items-center gap-2 mb-1 text-primary small fw-semibold">
                <Clock style={{ width: "16px", height: "16px" }} /> Log Timestamp & Details
              </div>
              <div className="small text-dark mb-2">{selectedLog.details || "No additional detail string provided."}</div>
              <div className="text-muted small">
                Logged at: {selectedLog.createdAt ? new Date(selectedLog.createdAt).toUTCString() : "Now"}
              </div>
            </div>

            {(selectedLog.oldData || selectedLog.newData) && (
              <div className="p-3 border rounded-3 bg-light">
                <div className="d-flex align-items-center gap-2 mb-2 text-dark small fw-semibold">
                  <Terminal style={{ width: "16px", height: "16px" }} /> Data Change Payload
                </div>
                {selectedLog.oldData && (
                  <div className="mb-2">
                    <span className="badge bg-secondary mb-1">Previous Data</span>
                    <pre className="p-2 bg-dark text-light rounded small mb-0 font-monospace" style={{ fontSize: "11px" }}>
                      {selectedLog.oldData}
                    </pre>
                  </div>
                )}
                {selectedLog.newData && (
                  <div>
                    <span className="badge bg-success mb-1">New Data</span>
                    <pre className="p-2 bg-dark text-success rounded small mb-0 font-monospace" style={{ fontSize: "11px" }}>
                      {selectedLog.newData}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div className="d-flex justify-content-end mt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedLog(null)}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
