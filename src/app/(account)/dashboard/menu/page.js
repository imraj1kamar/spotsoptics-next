"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectMenus,
  selectLoading,
  setMenus,
  addMenuToState,
  updateMenuInState,
  setLoading as setReduxLoading,
} from "@/redux/slices/menuSlice";
import { menuApi } from "@/redux/api/menuApi";

import Breadcrumb from "../../components/ui/Breadcrumb";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import DynamicForm from "../../components/ui/DynamicForm";
import Alert from "../../components/ui/Alert";
import {
  Menu as MenuIcon,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Compass,
} from "lucide-react";

export default function MenuManagementPage() {
  const dispatch = useDispatch();

  const reduxMenus = useSelector(selectMenus) || [];
  const loading = useSelector(selectLoading);

  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'inactive'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchMenus = useCallback(async () => {
    dispatch(setReduxLoading(true));
    try {
      const res = await menuApi.getMenus(true);
      const menuList = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      dispatch(setMenus(menuList));
    } catch (err) {
      setAlert({ type: "danger", message: "Failed to load menu items via Redux menuApi." });
    } finally {
      dispatch(setReduxLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const handleOpenAddModal = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (menuItem) => {
    setEditingMenu(menuItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setAlert(null);

    const payload = {
      label: formData.label,
      href: formData.href,
      icon: formData.icon || "Menu",
      parentId: formData.parentId ? Number(formData.parentId) : null,
      sortOrder: Number(formData.sortOrder || 0),
      status: Number(formData.status ?? 1),
    };

    try {
      const res = editingMenu
        ? await menuApi.updateMenu(editingMenu.id, payload)
        : await menuApi.createMenu(payload);

      if (res?.success !== false) {
        const item = res?.data || res;
        if (editingMenu) {
          dispatch(updateMenuInState(item));
        } else {
          dispatch(addMenuToState(item));
        }
        setAlert({
          type: "success",
          message: editingMenu
            ? "Menu item updated successfully!"
            : "New menu item added successfully!",
        });
        handleCloseModal();
        fetchMenus();
      } else {
        setAlert({ type: "danger", message: res?.message || "Operation failed." });
      }
    } catch (err) {
      setAlert({ type: "danger", message: "Failed to save menu item via Redux menuApi." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (menuItem) => {
    const newStatus = menuItem.status === 1 ? 0 : 1;
    const actionName = newStatus === 1 ? "activate" : "deactivate (soft delete)";

    if (!confirm(`Are you sure you want to ${actionName} "${menuItem.label}"?`)) {
      return;
    }

    try {
      const res = await menuApi.updateMenu(menuItem.id, { status: newStatus });
      if (res?.success !== false) {
        const updated = res?.data || { ...menuItem, status: newStatus };
        dispatch(updateMenuInState(updated));
        setAlert({
          type: "success",
          message: `Menu item "${menuItem.label}" status set to ${newStatus === 1 ? "Active" : "Inactive"}.`,
        });
        fetchMenus();
      } else {
        setAlert({ type: "danger", message: res?.message || "Failed to update status." });
      }
    } catch (err) {
      setAlert({ type: "danger", message: "Failed to update status due to network error." });
    }
  };

  const handleReorder = async (menuItem, direction) => {
    const currentOrder = menuItem.sortOrder ?? menuItem.id;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    try {
      const res = await menuApi.updateMenu(menuItem.id, { sortOrder: newOrder });
      if (res?.success !== false) {
        fetchMenus();
      }
    } catch (err) {
      console.error("Reorder failed:", err);
    }
  };

  // Filtering
  const filteredMenus = reduxMenus.filter((m) => {
    if (filter === "active") return m.status === 1;
    if (filter === "inactive") return m.status === 0;
    return true;
  });

  // Table Columns
  const columns = [
    {
      header: "Sort #",
      accessor: "sortOrder",
      render: (_val, row) => (
        <div className="d-flex align-items-center gap-1">
          <span className="badge bg-light text-dark border px-2 py-1">{row.sortOrder ?? row.id}</span>
          <div className="btn-group btn-group-sm ms-1">
            <button
              className="btn btn-outline-secondary py-0 px-1"
              title="Move Up"
              onClick={() => handleReorder(row, "up")}
            >
              <ArrowUp size={12} />
            </button>
            <button
              className="btn btn-outline-secondary py-0 px-1"
              title="Move Down"
              onClick={() => handleReorder(row, "down")}
            >
              <ArrowDown size={12} />
            </button>
          </div>
        </div>
      ),
    },
    {
      header: "Menu Label",
      accessor: "label",
      render: (_val, row) => (
        <div className="d-flex align-items-center gap-2">
          <div
            className="p-2 bg-primary-subtle text-primary rounded-2 d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
          >
            <Compass size={16} />
          </div>
          <div>
            <span className="fw-semibold text-dark d-block">{row.label}</span>
            {row.parentId && (
              <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                Parent ID: #{row.parentId}
              </small>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Target URL (href)",
      accessor: "href",
      render: (_val, row) => (
        <code className="text-primary bg-light px-2 py-1 rounded border small">{row.href}</code>
      ),
    },
    {
      header: "Icon Class",
      accessor: "icon",
      render: (_val, row) => (
        <span className="badge bg-secondary-subtle text-secondary border">{row.icon || "Menu"}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (_val, row) => (
        <span
          className={`badge rounded-pill px-3 py-1 ${row.status === 1
              ? "bg-success-subtle text-success border border-success-subtle"
              : "bg-danger-subtle text-danger border border-danger-subtle"
            }`}
        >
          {row.status === 1 ? "Active" : "Inactive (Soft Deleted)"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (_val, row) => (
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            icon={Edit2}
            onClick={() => handleOpenEditModal(row)}
            title="Edit Menu"
          >
            Edit
          </Button>

          <Button
            variant={row.status === 1 ? "outline-warning" : "outline-success"}
            size="sm"
            icon={row.status === 1 ? XCircle : CheckCircle}
            onClick={() => handleToggleStatus(row)}
            title={row.status === 1 ? "Deactivate (Soft Delete)" : "Activate"}
          >
            {row.status === 1 ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  // Dynamic Form Fields for Add/Edit
  const parentOptions = [
    { value: "", label: "-- None (Top Level Menu) --" },
    ...reduxMenus
      .filter((m) => !editingMenu || m.id !== editingMenu.id)
      .map((m) => ({ value: String(m.id), label: `${m.label} (${m.href})` })),
  ];

  const formFields = [
    {
      name: "label",
      label: "Menu Title Label",
      type: "text",
      placeholder: "e.g. Software Center",
      required: true,
    },
    {
      name: "href",
      label: "Target URL Route (href)",
      type: "text",
      placeholder: "e.g. /dashboard/software",
      required: true,
    },
    {
      name: "icon",
      label: "Lucide Icon Name",
      type: "select",
      options: [
        { value: "Home", label: "Home / Dashboard" },
        { value: "Users", label: "Users / Client Management" },
        { value: "Cpu", label: "Cpu / Software" },
        { value: "Link", label: "Link / Quick Links" },
        { value: "Download", label: "Download / Assets" },
        { value: "Activity", label: "Activity / System Logs" },
        { value: "Menu", label: "Menu / Navigation" },
        { value: "Settings", label: "Settings" },
        { value: "Database", label: "Database" },
        { value: "Shield", label: "Shield / Security" },
        { value: "FileText", label: "FileText / Reports" },
      ],
      required: true,
    },
    {
      name: "parentId",
      label: "Parent Menu (Sub-menu items)",
      type: "select",
      options: parentOptions,
    },
    {
      name: "sortOrder",
      label: "Display Sort Order",
      type: "number",
      placeholder: "0",
    },
    {
      name: "status",
      label: "Access Status",
      type: "select",
      options: [
        { value: "1", label: "Active (Visible & Accessible)" },
        { value: "0", label: "Inactive (Soft Deleted / Hidden)" },
      ],
    },
  ];

  const initialFormValues = editingMenu
    ? {
      label: editingMenu.label,
      href: editingMenu.href,
      icon: editingMenu.icon || "Menu",
      parentId: editingMenu.parentId ? String(editingMenu.parentId) : "",
      sortOrder: editingMenu.sortOrder ?? editingMenu.id,
      status: String(editingMenu.status),
    }
    : {
      label: "",
      href: "",
      icon: "Menu",
      parentId: "",
      sortOrder: reduxMenus.length > 0 ? Math.max(...reduxMenus.map((m) => m.sortOrder || 0)) + 1 : 1,
      status: "1",
    };

  return (
    <div className="container-fluid p-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Navigation Builder", active: true },
        ]}
      />

      {/* Page Title Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between my-3 gap-3">
        <div>
          <h2 className="h4 font-weight-bold mb-1 text-dark d-flex align-items-center gap-2">
            <MenuIcon className="text-primary" size={26} />
            Sidebar Menu Builder
          </h2>
          <p className="text-secondary small mb-0">
            Configure dynamic navigation links, parent hierarchy, display order, and status toggles for system users.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Button variant="outline-secondary" icon={RefreshCw} onClick={fetchMenus} loading={loading}>
            Refresh
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Alert Notifications */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          dismissible
          onDismiss={() => setAlert(null)}
          className="mb-4"
        />
      )}

      {/* Filter Tabs & Content Card */}
      <Card className="shadow-sm border-0">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-3 border-bottom pb-3 gap-2">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setFilter("all")}
            >
              All Menus ({reduxMenus.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === "active" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setFilter("active")}
            >
              Active ({reduxMenus.filter((m) => m.status === 1).length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === "inactive" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setFilter("inactive")}
            >
              Inactive ({reduxMenus.filter((m) => m.status === 0).length})
            </button>
          </div>

          <small className="text-muted">
            Showing {filteredMenus.length} of {reduxMenus.length} menu items
          </small>
        </div>

        {/* Menu Items Table */}
        <Table
          columns={columns}
          data={filteredMenus}
          loading={loading}
          emptyText="No navigation menu items found."
          rowKey="id"
        />
      </Card>

      {/* Add / Edit Menu Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMenu ? `Edit Menu Item: ${editingMenu.label}` : "Add New Navigation Menu"}
        size="md"
      >
        <DynamicForm
          fields={formFields}
          initialValues={initialFormValues}
          onSubmit={handleFormSubmit}
          submitText={editingMenu ? "Update Menu Item" : "Create Menu Item"}
          loading={formLoading}
          columns={1}
        />
      </Modal>
    </div>
  );
}
