// components/ui/Table.jsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

export default function Table({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = "Search records...",
  itemsPerPage = 10,
  emptyMessage = "No records found.",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // 1. Search Logic
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.accessor];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // 2. Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 3. Pagination Slicing
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (accessor) => {
    setSortConfig((prev) => ({
      key: accessor,
      direction: prev.key === accessor && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="card shadow-sm border rounded-3 overflow-hidden">
      {/* Top Controls: Search & Rows per page */}
      <div className="card-header bg-white border-bottom p-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        {searchable ? (
          <div className="position-relative w-100" style={{ maxWidth: "300px" }}>
            <Search
              className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              style={{ width: "14px", height: "14px", pointerEvents: "none" }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="form-control form-control-sm ps-5"
            />
          </div>
        ) : (
          <div />
        )}

        <div className="d-flex align-items-center gap-2 small text-muted">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="form-select form-select-sm py-1 px-2"
            style={{ width: "auto" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 text-start small">
          <thead className="table-light">
            <tr>
              {columns.map((col, colIdx) => (
                <th
                  key={col.key || `${col.accessor || ''}-${col.header || ''}-${colIdx}`}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                  className={`px-3 py-2 text-uppercase fw-semibold text-secondary ${
                    col.sortable !== false ? "user-select-none cursor-pointer" : ""
                  }`}
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  <div className="d-flex align-items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      <ArrowUpDown
                        style={{ width: "12px", height: "12px" }}
                        className={sortConfig.key === col.accessor ? "text-primary" : "text-muted"}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map((col, colIdx) => (
                    <td key={col.key || `${col.accessor || ''}-${col.header || ''}-${colIdx}`} className="px-3 py-2">
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-muted small">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="card-footer bg-white border-top p-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-muted">
        <div>
          Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-outline-secondary btn-sm p-1 d-inline-flex align-items-center justify-content-center"
          >
            <ChevronLeft style={{ width: "16px", height: "16px" }} />
          </button>
          <span className="fw-semibold text-dark px-1">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            aria-label="Next page"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-outline-secondary btn-sm p-1 d-inline-flex align-items-center justify-content-center"
          >
            <ChevronRight style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}