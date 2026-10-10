"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link as LinkIcon, Plus, Copy, Check, RefreshCw, Trash2, Key, Layers, UserCheck, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import Card from "@/app/(account)/components/ui/Card";
import Table from "@/app/(account)/components/ui/Table";
import Button from "@/app/(account)/components/ui/Button";
import Modal from "@/app/(account)/components/ui/Modal";
import DynamicForm from "@/app/(account)/components/ui/DynamicForm";
import Alert from "@/app/(account)/components/ui/Alert";
import Breadcrumb from "@/app/(account)/components/ui/Breadcrumb";
import { apiCollection } from "@/apiService/apiCollection";

export default function AccessLinksPage() {
  const [links, setLinks] = useState([]);
  const [softwares, setSoftwares] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, ACTIVE, REVOKED, UNUSED
  const [copiedToken, setCopiedToken] = useState(null);
  const [alert, setAlert] = useState(null);

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  // Form State
  const [generateForm, setGenerateForm] = useState({
    softwareId: "",
    assignedTo: "",
    customToken: "",
  });

  // Fetch Links, Software, and Users
  const fetchData = async () => {
    setLoading(true);
    try {
      const [linksRes, softRes, usersRes] = await Promise.all([
        apiCollection.get("/api/software/links").catch(() => ({ data: [] })),
        apiCollection.getSoftwares().catch(() => ({ data: [] })),
        apiCollection.getUsers().catch(() => ({ data: [] })),
      ]);

      const linkList = Array.isArray(linksRes?.data) ? linksRes.data : Array.isArray(linksRes) ? linksRes : [];
      const softList = Array.isArray(softRes?.data) ? softRes.data : Array.isArray(softRes) ? softRes : [];
      const userList = Array.isArray(usersRes?.data) ? usersRes.data : Array.isArray(usersRes) ? usersRes : [];

      setLinks(linkList);
      setSoftwares(softList);
      setUsers(userList);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load software access links." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format options
  const softwareOptions = useMemo(() => {
    return softwares
      .filter((s) => Number(s.status) === 1)
      .map((s) => ({ value: String(s.id), label: s.name }));
  }, [softwares]);

  const userOptions = useMemo(() => {
    return users
      .filter((u) => Number(u.status) === 1)
      .map((u) => ({
        value: String(u.id),
        label: `${u.name} (@${u.username}) - ${u.role}`,
      }));
  }, [users]);

  // Filter links by active tab
  const filteredLinks = useMemo(() => {
    if (activeTab === "ALL") return links;
    if (activeTab === "ACTIVE") return links.filter((l) => Number(l.status) === 1);
    if (activeTab === "REVOKED") return links.filter((l) => Number(l.status) === 0);
    if (activeTab === "UNUSED") return links.filter((l) => !l.isUsed && Number(l.status) === 1);
    return links;
  }, [links, activeTab]);

  // Copy token handler
  const handleCopyToken = (token) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleOpenGenerateModal = () => {
    setGenerateForm({ softwareId: "", assignedTo: "", customToken: "" });
    setIsGenerateModalOpen(true);
  };

  const handleOpenDeleteModal = (link) => {
    setSelectedLink(link);
    setIsDeleteModalOpen(true);
  };

  // Submit Generate Link
  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!generateForm.softwareId || !generateForm.assignedTo) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const res = await apiCollection.post("/api/software/links", generateForm);
      if (res?.success !== false) {
        setAlert({
          type: "success",
          message: `Access link token generated successfully! Token: ${res?.data?.secureToken || "Generated"}`,
        });
        setIsGenerateModalOpen(false);
        setGenerateForm({ softwareId: "", assignedTo: "", customToken: "" });
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to generate link." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Generation error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Soft Delete / Revoke Link (Update status ID)
  const handleRevokeSubmit = async () => {
    if (!selectedLink) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const newStatus = selectedLink.status === 1 ? 0 : 1;
      const res = await apiCollection.put(`/api/software/links/${selectedLink.id}`, { status: newStatus });
      if (res?.success !== false) {
        setAlert({
          type: "success",
          message: `Access link token status updated to ${newStatus === 1 ? "Active (1)" : "Revoked (0)"}.`,
        });
        setIsDeleteModalOpen(false);
        setSelectedLink(null);
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to update link status." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Revoke error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle IsUsed Flag
  const handleToggleUsed = async (link) => {
    try {
      const res = await apiCollection.put(`/api/software/links/${link.id}`, { isUsed: !link.isUsed });
      if (res?.success !== false) {
        fetchData();
      }
    } catch (err) {
      console.warn("Toggle used error:", err);
    }
  };

  // Table Columns Definition
  const columns = [
    {
      header: "Secure Link Token",
      accessor: "secureToken",
      render: (token) => (
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-dark font-monospace text-warning px-2 py-1 fs-6">{token}</span>
          <button
            type="button"
            className="btn btn-sm btn-link p-0 text-decoration-none"
            onClick={() => handleCopyToken(token)}
            title="Copy Token"
          >
            {copiedToken === token ? (
              <Check style={{ width: "16px", height: "16px" }} className="text-success" />
            ) : (
              <Copy style={{ width: "16px", height: "16px" }} className="text-secondary" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: "Software Package",
      accessor: "software",
      render: (software) => (
        <div>
          <div className="fw-semibold text-dark">{software?.name || "Software Package"}</div>
          <div className="text-muted small">ID: #{software?.id}</div>
        </div>
      ),
    },
    {
      header: "Assigned To (Receiver)",
      accessor: "receiver",
      render: (receiver) => (
        receiver ? (
          <div>
            <div className="fw-semibold text-dark">{receiver.name}</div>
            <div className="text-muted small">@{receiver.username} • <span className="badge bg-secondary-subtle text-secondary">{receiver.role}</span></div>
          </div>
        ) : (
          <span className="text-muted small">—</span>
        )
      ),
    },
    {
      header: "Issued By",
      accessor: "creator",
      render: (creator) => (
        <span className="small text-secondary">{creator?.name || "Admin"}</span>
      ),
    },
    {
      header: "Usage State",
      accessor: "isUsed",
      render: (isUsed, row) => (
        <button
          type="button"
          onClick={() => handleToggleUsed(row)}
          className="btn btn-link p-0 text-decoration-none"
          title="Click to toggle usage flag"
        >
          {isUsed ? (
            <span className="badge bg-secondary text-white px-2 py-1">Used</span>
          ) : (
            <span className="badge bg-info text-dark px-2 py-1">Unused</span>
          )}
        </button>
      ),
    },
    {
      header: "Status ID",
      accessor: "status",
      render: (status) =>
        Number(status) === 1 ? (
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
            ● Active (1)
          </span>
        ) : (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
            ○ Revoked (0)
          </span>
        ),
    },
    {
      header: "Actions",
      accessor: "id",
      sortable: false,
      render: (_, row) => (
        <div className="d-flex align-items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopyToken(row.secureToken)}
            title="Copy Secure Access Token"
          >
            <Copy style={{ width: "14px", height: "14px" }} />
          </Button>
          <Button
            variant={Number(row.status) === 1 ? "danger" : "outline"}
            size="sm"
            onClick={() => handleOpenDeleteModal(row)}
            title={Number(row.status) === 1 ? "Revoke Access Link (Set Status 0)" : "Reactivate Access Link"}
          >
            <Trash2 style={{ width: "14px", height: "14px" }} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 d-flex flex-column gap-4">
      {/* Header & Breadcrumb */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Access & Links" }]} />
          <h1 className="h4 fw-bold text-dark mb-1 mt-2">Software Access Links & Tokens</h1>
          <p className="text-muted small mb-0">
            Generate, assign, track, and revoke secure download access tokens for Distributors and Clients.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" size="md" onClick={fetchData} isLoading={loading}>
            <RefreshCw style={{ width: "16px", height: "16px" }} /> Refresh
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenGenerateModal}>
            Generate Access Link
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

      {/* Access Links Summary Card & Table */}
      <Card
        title="Access Links Repository"
        subtitle={`Total generated software tokens: ${links.length}`}
        headerAction={
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${activeTab === "ALL" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("ALL")}
            >
              All ({links.length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "ACTIVE" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("ACTIVE")}
            >
              Active ({links.filter((l) => Number(l.status) === 1).length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "REVOKED" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("REVOKED")}
            >
              Revoked ({links.filter((l) => Number(l.status) === 0).length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "UNUSED" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("UNUSED")}
            >
              Unused ({links.filter((l) => !l.isUsed && Number(l.status) === 1).length})
            </button>
          </div>
        }
      >
        <Table
          columns={columns}
          data={filteredLinks}
          searchable={true}
          searchPlaceholder="Search by token, software, user name..."
          itemsPerPage={10}
          emptyMessage={loading ? "Loading access links..." : "No access links found."}
        />
      </Card>

      {/* GENERATE ACCESS LINK MODAL */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Secure Software Link Token"
        maxWidth="modal-md"
      >
        <form onSubmit={handleGenerateSubmit} className="d-flex flex-column gap-3 text-start">
          <p className="small text-muted mb-0">
            Generate a unique, single-token access link for a user to download assigned software packages.
          </p>

          <div className="mb-2">
            <label className="form-label small fw-semibold text-dark mb-1">Select Software Package *</label>
            <select
              value={generateForm.softwareId}
              onChange={(e) => setGenerateForm((f) => ({ ...f, softwareId: e.target.value }))}
              required
              className="form-select"
            >
              <option value="" disabled>
                Select Software Package
              </option>
              {softwareOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label small fw-semibold text-dark mb-1">Assigned Target User *</label>
            <select
              value={generateForm.assignedTo}
              onChange={(e) => setGenerateForm((f) => ({ ...f, assignedTo: e.target.value }))}
              required
              className="form-select"
            >
              <option value="" disabled>
                Select Distributor or Client User
              </option>
              {userOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label small fw-semibold text-dark mb-1">Custom Token (Optional)</label>
            <input
              type="text"
              placeholder="e.g. LINK-CUST0M123 (Leave blank for auto-generated token)"
              value={generateForm.customToken}
              onChange={(e) => setGenerateForm((f) => ({ ...f, customToken: e.target.value }))}
              className="form-control"
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading} icon={Key}>
              Generate & Save Token
            </Button>
          </div>
        </form>
      </Modal>

      {/* REVOKE / SOFT DELETE LINK MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Revoke Access Link (Soft Delete)"
        maxWidth="modal-md"
      >
        <div className="text-start">
          <p className="text-secondary small mb-3">
            Are you sure you want to change the status for token{" "}
            <strong className="font-monospace text-dark">{selectedLink?.secureToken}</strong>?
          </p>

          <div className="alert alert-warning small d-flex align-items-center gap-2 mb-4">
            <Trash2 style={{ width: "16px", height: "16px" }} className="text-warning flex-shrink-0" />
            <div>
              Status will be updated to{" "}
              <strong>{selectedLink?.status === 1 ? "0 (Revoked / Inactive)" : "1 (Active)"}</strong>. The record will remain safely stored in database audit logs.
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={selectedLink?.status === 1 ? "danger" : "primary"}
              isLoading={actionLoading}
              onClick={handleRevokeSubmit}
            >
              Confirm Status Change
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
