"use client";

import React, { useState, useEffect } from "react";
import { Download, HardDrive, Key, Copy, Check, RefreshCw, FileCheck, ShieldCheck, ExternalLink } from "lucide-react";
import Card from "@/app/(account)/components/ui/Card";
import Table from "@/app/(account)/components/ui/Table";
import Button from "@/app/(account)/components/ui/Button";
import Modal from "@/app/(account)/components/ui/Modal";
import Alert from "@/app/(account)/components/ui/Alert";
import Breadcrumb from "@/app/(account)/components/ui/Breadcrumb";
import ProgressBar from "@/app/(account)/components/ui/ProgressBar";
import { apiCollection } from "@/apiService/apiCollection";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [copiedToken, setCopiedToken] = useState(null);

  // Modal State for downloading
  const [downloadingItem, setDownloadingItem] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Fetch assigned software packages for logged-in user
  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const res = await apiCollection.getSoftwares();
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setDownloads(list);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load assigned software downloads." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const handleCopyToken = (token) => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Trigger download process
  const handleStartDownload = (item) => {
    setDownloadingItem(item);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Redirect or open download link
          const downloadUrl = item.secureToken
            ? `/api/software/download?token=${item.secureToken}`
            : item.baseFileUrl;
          window.open(downloadUrl, "_blank");
          return 100;
        }
        return prev + 30;
      });
    }, 250);
  };

  // Table columns definition
  const columns = [
    {
      header: "Software Package",
      accessor: "name",
      render: (_, row) => (
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center bg-primary-subtle text-primary border border-primary-subtle"
            style={{ width: "42px", height: "42px" }}
          >
            <HardDrive style={{ width: "20px", height: "20px" }} />
          </div>
          <div>
            <div className="fw-bold text-dark mb-0">{row.name}</div>
            <div className="text-muted small text-truncate" style={{ maxWidth: "300px" }}>
              {row.description || "Official Optics calibration package"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Access Token",
      accessor: "secureToken",
      render: (token) =>
        token ? (
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
        ) : (
          <span className="badge bg-light text-secondary border px-2 py-1">Direct Storage Link</span>
        ),
    },
    {
      header: "Issued By",
      accessor: "assignedBy",
      render: (assignedBy) => (
        <span className="small text-secondary">{assignedBy || "Administrator"}</span>
      ),
    },
    {
      header: "Usage State",
      accessor: "isUsed",
      render: (isUsed) =>
        isUsed ? (
          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1">
            Downloaded
          </span>
        ) : (
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
            Ready to Download
          </span>
        ),
    },
    {
      header: "Action",
      accessor: "id",
      sortable: false,
      render: (_, row) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleStartDownload(row)}
          icon={Download}
        >
          Download Package
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 d-flex flex-column gap-4">
      {/* Header & Breadcrumb */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "My Downloads" }]} />
          <h1 className="h4 fw-bold text-dark mb-1 mt-2">My Software Downloads</h1>
          <p className="text-muted small mb-0">
            Access and download your assigned SpotOptics software packages and calibration suites.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" size="md" onClick={fetchDownloads} isLoading={loading}>
            <RefreshCw style={{ width: "16px", height: "16px" }} /> Refresh
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

      {/* My Downloads Summary & Table */}
      <Card
        title="Assigned Software Packages"
        subtitle={`Available downloads count: ${downloads.length}`}
      >
        <Table
          columns={columns}
          data={downloads}
          searchable={true}
          searchPlaceholder="Search assigned software..."
          itemsPerPage={10}
          emptyMessage={loading ? "Loading software packages..." : "No software packages assigned yet."}
        />
      </Card>

      {/* DOWNLOAD PROGRESS MODAL */}
      <Modal
        isOpen={Boolean(downloadingItem)}
        onClose={() => setDownloadingItem(null)}
        title={`Downloading: ${downloadingItem?.name || ""}`}
        maxWidth="modal-md"
      >
        <div className="text-start d-flex flex-column gap-3 p-2">
          <p className="small text-muted mb-0">
            Preparing secure file stream for <strong>{downloadingItem?.name}</strong>...
          </p>

          <ProgressBar
            progress={downloadProgress}
            label="Download Progress"
            description={
              downloadProgress < 100
                ? "Connecting to secure storage server..."
                : "Download complete! Opening storage link..."
            }
          />

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDownloadingItem(null)}
            >
              Close
            </Button>
            {downloadProgress === 100 && (
              <Button
                type="button"
                variant="primary"
                icon={ExternalLink}
                onClick={() => {
                  const downloadUrl = downloadingItem?.secureToken
                    ? `/api/software/download?token=${downloadingItem.secureToken}`
                    : downloadingItem?.baseFileUrl;
                  window.open(downloadUrl, "_blank");
                }}
              >
                Re-open Link
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
