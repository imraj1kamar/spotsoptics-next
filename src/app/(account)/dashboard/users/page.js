"use client";

import React, { useState, useEffect, useMemo } from "react";
import { UserPlus, Edit, Trash2, ShieldCheck, RefreshCw, Layers } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectUsers, selectLoading, setUsers, addUserToState, updateUserInState, setLoading as setReduxLoading } from "@/redux/slices/userSlice";
import { selectCurrentUser } from "@/redux/slices/authSlice";
import { userApi } from "@/redux/api/userApi";

import Card from "@/app/(account)/components/ui/Card";
import Table from "@/app/(account)/components/ui/Table";
import Button from "@/app/(account)/components/ui/Button";
import Modal from "@/app/(account)/components/ui/Modal";
import DynamicForm from "@/app/(account)/components/ui/DynamicForm";
import Alert from "@/app/(account)/components/ui/Alert";
import Breadcrumb from "@/app/(account)/components/ui/Breadcrumb";

export default function UsersPage() {
  const dispatch = useDispatch();
  
  // Select Redux State
  const currentUser = useSelector(selectCurrentUser);
  const isAdmin = String(currentUser?.role || "").toUpperCase() === "ADMIN";
  const users = useSelector(selectUsers) || [];
  const loading = useSelector(selectLoading);

  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, DISTRIBUTOR, CLIENT
  const [alert, setAlert] = useState(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form & Selection State
  const [selectedUser, setSelectedUser] = useState(null);

  const [formFieldsData, setFormFieldsData] = useState({
    name: "",
    username: "",
    password: "",
    role: "DISTRIBUTOR",
    parentId: "",
    status: 1,
  });

  // Fetch users via Redux API
  const fetchData = async () => {
    dispatch(setReduxLoading(true));
    try {
      const usersRes = await userApi.getUsers().catch(() => ({ data: [] }));

      const userList = Array.isArray(usersRes?.data)
        ? usersRes.data
        : Array.isArray(usersRes)
        ? usersRes
        : [];

      dispatch(setUsers(userList));
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load users via Redux." });
    } finally {
      dispatch(setReduxLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  // Filtered Users list based on active tab
  const filteredUsers = useMemo(() => {
    if (activeTab === "ALL") return users;
    return users.filter((u) => String(u.role).toUpperCase() === activeTab);
  }, [users, activeTab]);

  // List of Distributors for parent assignment dropdown
  const distributorOptions = useMemo(() => {
    return users
      .filter((u) => String(u.role).toUpperCase() === "DISTRIBUTOR" && Number(u.status) === 1)
      .map((u) => ({ value: String(u.id), label: `${u.name} (@${u.username})` }));
  }, [users]);

  // Reset Form
  const resetForm = () => {
    setFormFieldsData({
      name: "",
      username: "",
      password: "",
      role: isAdmin ? "DISTRIBUTOR" : "CLIENT",
      parentId: "",
      status: 1,
    });
    setSelectedUser(null);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormFieldsData({
      name: user.name || "",
      username: user.username || "",
      password: "",
      role: user.role || (isAdmin ? "DISTRIBUTOR" : "CLIENT"),
      parentId: user.parentId ? String(user.parentId) : "",
      status: user.status !== undefined ? Number(user.status) : 1,
    });
    setIsEditModalOpen(true);
  };

  // Open Soft Delete Confirmation Modal
  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Submit Add User via Redux userApi & update Redux store
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setAlert(null);
    try {
      const payload = {
        ...formFieldsData,
        role: isAdmin ? (formFieldsData.role || "DISTRIBUTOR") : "CLIENT",
      };
      const res = await userApi.addUser(payload);
      if (res?.success !== false) {
        const newUser = res?.data || res;
        dispatch(addUserToState(newUser));
        setAlert({ type: "success", message: `User ${formFieldsData.name} created successfully!` });
        setIsAddModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to create user." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Creation error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Edit User via Redux userApi & update Redux store
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const payload = {
        ...formFieldsData,
        ...(isAdmin ? {} : { role: "CLIENT" }),
      };
      const res = await userApi.updateUser(selectedUser.id, payload);
      if (res?.success !== false) {
        const updatedUser = res?.data || res;
        dispatch(updateUserInState(updatedUser));
        setAlert({ type: "success", message: `User ${formFieldsData.name} updated successfully!` });
        setIsEditModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to update user." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Update error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Soft Delete User (Update Status ID to 0 or toggle) via Redux userApi
  const handleSoftDeleteSubmit = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setAlert(null);
    try {
      const newStatus = selectedUser.status === 1 ? 0 : 1;
      const res = await userApi.updateUser(selectedUser.id, { status: newStatus });
      if (res?.success !== false) {
        const updatedUser = res?.data || { ...selectedUser, status: newStatus };
        dispatch(updateUserInState(updatedUser));
        setAlert({
          type: "success",
          message: `User status for ${selectedUser.name} changed to ${newStatus === 1 ? "Active" : "Inactive"}.`,
        });
        setIsDeleteModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setAlert({ type: "error", message: res?.message || "Failed to change user status." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || err?.message || "Status change error." });
    } finally {
      setActionLoading(false);
    }
  };

  // Form Fields Definition for DynamicForm
  const formFields = [
    { name: "name", label: "Full Name", placeholder: "e.g. John Doe", required: true },
    { name: "username", label: "Username / Email", placeholder: "e.g. john@spotoptics.com", required: true },
    {
      name: "password",
      label: isEditModalOpen ? "Password (leave blank to keep unchanged)" : "Password",
      type: "password",
      placeholder: "••••••••",
      required: !isEditModalOpen,
    },
    ...(isAdmin
      ? [
          {
            name: "role",
            label: "User Role",
            type: "select",
            required: true,
            options: [
              { value: "DISTRIBUTOR", label: "Distributor" },
              { value: "CLIENT", label: "Client" },
            ],
          },
        ]
      : []),
    ...(isAdmin && formFieldsData.role === "CLIENT" && distributorOptions.length > 0
      ? [
          {
            name: "parentId",
            label: "Assigned Parent Distributor",
            type: "select",
            options: distributorOptions,
          },
        ]
      : []),
    {
      name: "status",
      label: "Account Status",
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
      header: "User Details",
      accessor: "name",
      render: (_, row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white bg-primary"
            style={{ width: "34px", height: "34px", fontSize: "12px" }}
          >
            {row.name ? row.name.slice(0, 2).toUpperCase() : "US"}
          </div>
          <div>
            <div className="fw-semibold text-dark mb-0">{row.name}</div>
            <div className="text-muted small">@{row.username}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      render: (role) => {
        const badgeClass =
          role === "ADMIN"
            ? "bg-danger text-white"
            : role === "DISTRIBUTOR"
            ? "bg-primary text-white"
            : "bg-info text-dark";
        return <span className={`badge ${badgeClass} px-2 py-1`}>{role || "USER"}</span>;
      },
    },
    {
      header: "Parent",
      accessor: "parent",
      render: (parent, row) =>
        parent ? (
          <span className="small text-secondary">{parent.name}</span>
        ) : row.parentId ? (
          <span className="small text-muted">ID: {row.parentId}</span>
        ) : (
          <span className="text-muted small">—</span>
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
            onClick={() => handleOpenEditModal(row)}
            title="Edit User & Sidebar Access"
          >
            <Edit style={{ width: "14px", height: "14px" }} />
          </Button>
          <Button
            variant={Number(row.status) === 1 ? "danger" : "outline"}
            size="sm"
            onClick={() => handleOpenDeleteModal(row)}
            title={Number(row.status) === 1 ? "Soft Delete (Deactivate)" : "Activate User"}
          >
            <Trash2 style={{ width: "14px", height: "14px" }} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 d-flex flex-column gap-4">
      {/* Breadcrumb & Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "User Management" }]} />
          <h1 className="h4 fw-bold text-dark mb-1 mt-2">User & Role Management</h1>
          <p className="text-muted small mb-0">
            Manage Distributors, Clients, soft-delete statuses, and assign dynamic sidebar menu permissions.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" size="md" onClick={fetchData} isLoading={loading}>
            <RefreshCw style={{ width: "16px", height: "16px" }} /> Refresh
          </Button>
          <Button variant="primary" size="md" icon={UserPlus} onClick={handleOpenAddModal}>
            Add New User
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

      {/* Tabs & Table Summary Card */}
      <Card
        title="Account Users & Sidebar Menu Access"
        subtitle={`Total registered users: ${users.length}`}
        headerAction={
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${activeTab === "ALL" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("ALL")}
            >
              All ({users.length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "DISTRIBUTOR" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("DISTRIBUTOR")}
            >
              Distributors ({users.filter((u) => String(u.role).toUpperCase() === "DISTRIBUTOR").length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === "CLIENT" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setActiveTab("CLIENT")}
            >
              Clients ({users.filter((u) => String(u.role).toUpperCase() === "CLIENT").length})
            </button>
          </div>
        }
      >
        <Table
          columns={columns}
          data={filteredUsers}
          searchable={true}
          searchPlaceholder="Search by name, username, role..."
          itemsPerPage={10}
          emptyMessage={loading ? "Loading users..." : "No users found."}
        />
      </Card>

      {/* ADD USER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Distributor / Client User"
        maxWidth="modal-lg"
      >
        <DynamicForm
          fields={formFields}
          formData={formFieldsData}
          onChange={setFormFieldsData}
          onSubmit={handleCreateUserSubmit}
          submitLabel="Create User & Assign Access"
          isLoading={actionLoading}
          submitButton={
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={actionLoading}>
                Create User
              </Button>
            </div>
          }
        />
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit User: ${selectedUser?.name || ""}`}
        maxWidth="modal-lg"
      >
        <DynamicForm
          fields={formFields}
          formData={formFieldsData}
          onChange={setFormFieldsData}
          onSubmit={handleEditUserSubmit}
          submitLabel="Update User Details"
          isLoading={actionLoading}
          submitButton={
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={actionLoading}>
                Save Changes
              </Button>
            </div>
          }
        />
      </Modal>

      {/* SOFT DELETE / STATUS TOGGLE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Change User Status (Soft Delete)"
        maxWidth="modal-md"
      >
        <div className="text-start">
          <p className="text-secondary small mb-3">
            Are you sure you want to change the account status for{" "}
            <strong>{selectedUser?.name}</strong> (@{selectedUser?.username})?
          </p>

          <div className="alert alert-warning small d-flex align-items-center gap-2 mb-4">
            <Trash2 style={{ width: "16px", height: "16px" }} className="text-warning flex-shrink-0" />
            <div>
              Status will be updated to{" "}
              <strong>{selectedUser?.status === 1 ? "0 (Inactive / Soft Deleted)" : "1 (Active)"}</strong>. The user
              record will be preserved safely in the database.
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={selectedUser?.status === 1 ? "danger" : "primary"}
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
