
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  Users,
  Clock,
  Loader2,
  X,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import type {
  RegistrationRequest,
  RequestStatus,
} from "@/types/request";

type FilterStatus = "ALL" | RequestStatus;

function extractRequests(response: unknown): RegistrationRequest[] {
  if (Array.isArray(response)) return response;

  if (!response || typeof response !== "object") return [];

  const data = response as Record<string, unknown>;

  if (Array.isArray(data.data)) return data.data as RegistrationRequest[];
  if (Array.isArray(data.result)) return data.result as RegistrationRequest[];
  if (Array.isArray(data.requests)) return data.requests as RegistrationRequest[];

  if (data.data && typeof data.data === "object") {
    const nested = data.data as Record<string, unknown>;

    if (Array.isArray(nested.requests)) {
      return nested.requests as RegistrationRequest[];
    }
    if (Array.isArray(nested.result)) {
      return nested.result as RegistrationRequest[];
    }
  }

  return [];
}

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  CANCELLED: "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-300",
  BLOCKED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function AdmissionRequestsPage() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [selected, setSelected] = useState<RegistrationRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest<unknown>(
        "/api/admin/all-requests",
        { method: "GET" }
      );

      setRequests(extractRequests(response));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (
    id: string,
    status: RequestStatus
  ) => {
    const action = status.toLowerCase();

    if (!window.confirm(`Are you sure you want to ${action} this request?`)) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");

      await apiRequest(
        `/api/admin/status/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      await fetchRequests();

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status update failed"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus =
        filter === "ALL" || request.status === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        (request.name || "").toLowerCase().includes(searchText) ||
        (request.email || "").toLowerCase().includes(searchText) ||
        (request.requestType || "").toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [requests, filter, search]);

  const pending = requests.filter((r) => r.status === "PENDING").length;
  const approved = requests.filter((r) => r.status === "APPROVED").length;
  const blocked = requests.filter((r) => r.status === "BLOCKED").length;

  const filters: FilterStatus[] = [
    "ALL",
    "PENDING",
    "APPROVED",
    "CANCELLED",
    "BLOCKED",
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admission Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage student and teacher registration applications.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Requests", value: requests.length, icon: Users },
          { label: "Pending", value: pending, icon: Clock },
          { label: "Approved", value: approved, icon: CheckCircle },
          { label: "Blocked", value: blocked, icon: Ban },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <item.icon size={20} className="text-blue-500" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {loading ? "—" : item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Table container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Registration Applications
            </h2>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {status === "ALL" ? "All Requests" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4">Applicant</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Class / Subject</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Loader2 className="mx-auto animate-spin text-blue-500" />
                    <p className="mt-3 text-slate-500">Loading requests...</p>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Users className="mx-auto text-slate-300" size={35} />
                    <p className="mt-3 font-medium text-slate-700 dark:text-slate-200">
                      No requests found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {request.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {request.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        {request.requestType || "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {request.requestType === "STUDENT"
                        ? request.className || request.classId || "N/A"
                        : request.subject || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyle[request.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelected(request)}
                          title="View details"
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        >
                          <Eye size={17} />
                        </button>

                        {request.status === "PENDING" && (
                          <>
                            <button
                              disabled={actionLoading === request.id}
                              onClick={() =>
                                updateStatus(request.id, "APPROVED")
                              }
                              title="Approve"
                              className="rounded-lg p-2 text-green-600 hover:bg-green-50 disabled:opacity-40 dark:hover:bg-green-500/10"
                            >
                              <CheckCircle size={17} />
                            </button>

                            <button
                              disabled={actionLoading === request.id}
                              onClick={() =>
                                updateStatus(request.id, "CANCELLED")
                              }
                              title="Cancel"
                              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
                            >
                              <XCircle size={17} />
                            </button>

                            <button
                              disabled={actionLoading === request.id}
                              onClick={() =>
                                updateStatus(request.id, "BLOCKED")
                              }
                              title="Block"
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-500/10"
                            >
                              <Ban size={17} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500 dark:border-slate-800">
          Showing {filteredRequests.length} of {requests.length} requests
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Applicant Details
              </h2>
              <button onClick={() => setSelected(null)}>
                <X className="text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                ["Name", selected.name],
                ["Email", selected.email],
                ["Applicant Type", selected.requestType],
                ["Phone", selected.phone],
                ["Parent Phone", selected.parentPhone],
                ["Class", selected.className || selected.classId],
                ["Class Roll", selected.classRoll],
                ["Subject", selected.subject],
                ["Status", selected.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm dark:border-slate-800"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-medium text-slate-900 dark:text-white">
                    {value || "N/A"}
                  </span>
                </div>
              ))}
            </div>

            {selected.status === "PENDING" && (
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <button
                  onClick={() =>
                    updateStatus(selected.id, "CANCELLED")
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    updateStatus(selected.id, "BLOCKED")
                  }
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white"
                >
                  Block
                </button>
                <button
                  onClick={() =>
                    updateStatus(selected.id, "APPROVED")
                  }
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm text-white"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
