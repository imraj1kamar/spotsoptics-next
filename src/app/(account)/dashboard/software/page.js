"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Share2, Link as LinkIcon, RefreshCw, HardDrive } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSoftwares,
  selectSoftwareLoading,
  setSoftwares,
  addSoftwareToState,
  updateSoftwareInState,
  setLoading as setReduxLoading,
} from "@/redux/slices/softwareSlice";
import { softwareApi } from "@/redux/api/softwareApi";
import { userApi } from "@/redux/api/userApi";

import Card from "@/app/(account)/components/ui/Card";
import Table from "@/app/(account)/components/ui/Table";
import Button from "@/app/(account)/components/ui/Button";
import Modal from "@/app/(account)/components/ui/Modal";
import DynamicForm from "@/app/(account)/components/ui/DynamicForm";
import Alert from "@/app/(account)/components/ui/Alert";
import Breadcrumb from "@/app/(account)/components/ui/Breadcrumb";

export default function SoftwareRepositoryPage() {
  const dispatch = useDispatch();

  const softwares = useSelector(selectSoftwares) || [];
  const loading = useSelector(selectSoftwareLoading);

  const [users, setUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selection & Form states
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [assignForm, setAssignForm] = useState({ assignedTo: "" });
  const [formFieldsData, setFormFieldsData] = useState({
    name: "",
    description: "",
    baseFileUrl: "",
    status: 1,
  });

  // Fetch Software list and Users list via Redux APIs
  const fetchData = async () => {
    dispatch(setReduxLoading(true));
    try {
      const [softRes, usersRes] = await Promise.all([
        softwareApi.getSoftwares().catch(() => ({ data: [] })),
        userApi.getUsers().catch(() => ({ data: [] })),
      ]);

      const softList = Array.isArray(softRes?.data)
        ? softRes.data
        : Array.isArray(softRes)
        ? softRes
        : [];
      const userList = Array.isArray(usersRes?.data)
        ? usersRes.data
        : Array.isArray(usersRes)
        ? usersRes
        : [];

      dispatch(setSoftwares(softList));
      setUsers(userList);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load software repository data via Redux." });
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  // Format user options for software link assignment
  const userOptions = useMemo(() => {
    return users
      .filter((u) => Number(u.status) === 1)
      .map((u) => ({
        value: String(u.id),
        label: `${u.name} (@${u.username}) - ${u.role}`,
      }));
  }, [users]);

  // Reset form state
  const resetForm = () => {
    setFormFieldsData({
      name: "",
      description: "",
      baseFileUrl: "",
      status: 1,
    });
    setAssignForm({ assignedTo: "" });
    setSelectedSoftware(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedSoftware(item);
    setFormFieldsData({
      name: item.name || "",
      description: item.description || "",
      baseFileUrl: item.baseFileUrl || "",
      status: item.status !== undefined ? Number(item.status) : 1,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenAssignModal = (item) => {
    setSelectedSoftware(item);
    setAssignForm({ assignedTo: "" });
    setIsAssignModalOpen(true);
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedSoftware(item);
    setIsDeleteModalOpen(true);
  };

  // Submit Add Software via Redux softwareApi & update Redux store
  const handleAddSoftwareSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setAlert(null);
    try {
      const res = await softwareApi.addSoftware(formFieldsData);
      if (res?.success !== false) {
        const newSoftware = res?.data || res;
        dispatch(addSoftwareToState(newSoftware));
        setAlert({ type: "success", message: `Software "${formFieldsData.name}" added to repository!` });
        setIsAddModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to add software." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Creation error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Edit Software via Redux softwareApi & update Redux store
  const handleEditSoftwareSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSoftware) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const res = await softwareApi.updateSoftware(selectedSoftware.id, formFieldsData);
      if (res?.success !== false) {
        const updated = res?.data || res;
        dispatch(updateSoftwareInState(updated));
        setAlert({ type: "success", message: `Software "${formFieldsData.name}" updated successfully!` });
        setIsEditModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to update software." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Update error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Assign Software Link to User via Redux softwareApi
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSoftware || !assignForm.assignedTo) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const payload = {
        softwareId: selectedSoftware.id,
        assignedTo: Number(assignForm.assignedTo),
      };
      const res = await softwareApi.assignSoftware(payload);
      if (res?.success !== false) {
        setAlert({
          type: "success",
          message: `Access link generated for "${selectedSoftware.name}"! Token: ${res?.data?.secureToken || "Generated"}`,
        });
        setIsAssignModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to assign software." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Assignment error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Soft Delete / Status Toggle via Redux softwareApi
  const handleSoftDeleteSubmit = async () => {
    if (!selectedSoftware) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const newStatus = selectedSoftware.status === 1 ? 0 : 1;
      const res = await softwareApi.updateSoftware(selectedSoftware.id, { status: newStatus });
      if (res?.success !== false) {
        const updated = res?.data || { ...selectedSoftware, status: newStatus };
        dispatch(updateSoftwareInState(updated));
        setAlert({
          type: "success",
          message: `Status for "${selectedSoftware.name}" updated to ${newStatus === 1 ? "Active" : "Inactive"}.`,
        });
        setIsDeleteModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to update software status." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Status error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Form Fields Definition for DynamicForm
  const formFields = [
    { name: "name", label: "Software Package Name", placeholder: "e.g. SpotOptics Wavefront Suite v4.2", required: true },
    {
      name: "description",
      label: "Description / Release Notes",
      type: "textarea",
      placeholder: "e.g. Latest calibration software update for Shack-Hartmann sensors",
      rows: 3,
    },
    {
      name: "baseFileUrl",
      label: "Base Storage Download URL",
      placeholder: "https://storage.spotoptics.com/downloads/wavefront-v4.2.zip",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: 1, label: "Active (Status: 1)" },
        { value: 0, label: "Inactive (Status: 0)" },
      ],
    },
  ];

  // Table Columns Definition
  const columns = [
    {
      header: "Software Package",
      accessor: "name",
      render: (_, row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center bg-primary-subtle text-primary border border-primary-subtle"
            style={{ width: "36px", height: "36px" }}
          >
            <HardDrive style={{ width: "18px", height: "18px" }} />
          </div>
          <div>
            <div className="fw-semibold text-dark mb-0">{row.name}</div>
            <div className="text-muted small text-truncate" style={{ maxWidth: "260px" }}>
              {row.description || "No description provided"}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Storage Download Link",
      accessor: "baseFileUrl",
      render: (url) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-decoration-none small text-primary d-inline-flex align-items-center gap-1 text-truncate"
          style={{ maxWidth: "220px" }}
        >
          <LinkIcon style={{ width: "12px", height: "12px" }} />
          {url}
        </a>
      ),
    },
    {
      header: "Assigned Users",
      accessor: "links",
      render: (links) => {
        const count = Array.isArray(links) ? links.length : 0;
        return (
          <span className="badge bg-light text-dark border px-2 py-1">
            <Share2 style={{ width: "12px", height: "12px" }} className="me-1 text-primary" />
            {count} Assigned Users
          </span>
        );
      },
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
            ○ Inactive (0)
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
            onClick={() => handleOpenAssignModal(row)}
            title="Assign Access Link to User"
          >
            <Share2 style={{ width: "14px", height: "14px" }} /> Assign
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEditModal(row)}
            title="Edit Software Package"
          >
            <Edit style={{ width: "14px", height: "14px" }} />
          </Button>
          <Button
            variant={Number(row.status) === 1 ? "danger" : "outline"}
            size="sm"
            onClick={() => handleOpenDeleteModal(row)}
            title={Number(row.status) === 1 ? "Soft Delete (Deactivate)" : "Activate Software"}
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
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Software Repository" }]} />
          <h1 className="h4 fw-bold text-dark mb-1 mt-2">Software Repository & Distribution</h1>
          <p className="text-muted small mb-0">
            Manage software packages, storage file links, soft-delete statuses, and assign secure access links to Distributors & Clients.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" size="md" onClick={fetchData} isLoading={loading}>
            <RefreshCw style={{ width: "16px", height: "16px" }} /> Refresh
          </Button>
          <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
            Add Software Package
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

      {/* Software Repository Table */}
      <Card
        title="Software Repository Packages"
        subtitle={`Total software items registered: ${softwares.length}`}
      >
        <Table
          columns={columns}
          data={softwares}
          searchable={true}
          searchPlaceholder="Search by software name, description, URL..."
          itemsPerPage={10}
          emptyMessage={loading ? "Loading software repository..." : "No software packages found."}
        />
      </Card>

      {/* ADD SOFTWARE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Software Package to Repository"
        maxWidth="modal-lg"
      >
        <DynamicForm
          fields={formFields}
          formData={formFieldsData}
          onChange={setFormFieldsData}
          onSubmit={handleAddSoftwareSubmit}
          submitLabel="Save Software Package"
          isLoading={actionLoading}
        />
      </Modal>

      {/* EDIT SOFTWARE MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Software: ${selectedSoftware?.name || ""}`}
        maxWidth="modal-lg"
      >
        <DynamicForm
          fields={formFields}
          formData={formFieldsData}
          onChange={setFormFieldsData}
          onSubmit={handleEditSoftwareSubmit}
          submitLabel="Update Software Package"
          isLoading={actionLoading}
        />
      </Modal>

      {/* ASSIGN ACCESS LINK MODAL */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Access Link: ${selectedSoftware?.name || ""}`}
        maxWidth="modal-md"
      >
        <form onSubmit={handleAssignSubmit} className="d-flex flex-column gap-3 text-start">
          <p className="small text-muted mb-0">
            Generate a unique, secure access link for a Distributor or Client user to download{" "}
            <strong>{selectedSoftware?.name}</strong>.
          </p>

          <div className="mb-2">
            <label className="form-label small fw-semibold text-dark mb-1">Select Target User *</label>
            <select
              value={assignForm.assignedTo}
              onChange={(e) => setAssignForm({ assignedTo: e.target.value })}
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

          <div className="d-flex justify-content-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading} icon={Share2}>
              Generate & Assign Link
            </Button>
          </div>
        </form>
      </Modal>

      {/* SOFT DELETE / STATUS TOGGLE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Change Software Status (Soft Delete)"
        maxWidth="modal-md"
      >
        <div className="text-start">
          <p className="text-secondary small mb-3">
            Are you sure you want to change the status for software package{" "}
            <strong>{selectedSoftware?.name}</strong>?
          </p>

          <div className="alert alert-warning small d-flex align-items-center gap-2 mb-4">
            <Trash2 style={{ width: "16px", height: "16px" }} className="text-warning flex-shrink-0" />
            <div>
              Status will be updated to{" "}
              <strong>{selectedSoftware?.status === 1 ? "0 (Inactive / Soft Deleted)" : "1 (Active)"}</strong>. The record
              and assigned links will be safely preserved in the database.
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={selectedSoftware?.status === 1 ? "danger" : "primary"}
              isLoading={actionLoading}
              onClick={handleSoftDeleteSubmit}
            >
              Confirm Status Change
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
