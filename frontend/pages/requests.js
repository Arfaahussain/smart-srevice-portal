import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Requests() {

  const router = useRouter();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [filter, setFilter] = useState({
    status: "",
    priority: "",
    category: ""
  });

  /* =========================================
     LOAD DATA
  ========================================= */
  const load = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") || "";
      const res = await api.get("/requests", {
        params: filter,
        headers: {
          authorization: token
        }
      });

      setData(res.data);

    } catch {
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    load();
  }, [load, router]);

  /* =========================================
     LOGOUT
  ========================================= */
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  /* =========================================
     UPDATE STATUS
  ========================================= */
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token") || "";
      await api.put(
        `/requests/${id}`,
        { status },
        {
          headers: {
            authorization: token
          }
        }
      );
      setSelected(prev =>
        prev && prev._id === id ? { ...prev, status } : prev
      );
      load();
    } catch {
      alert("Failed to update status");
    }
  };

  /* =========================================
     DELETE FLOW
  ========================================= */
  const deleteRequest = (request) => {

    if (request.status !== "Resolved") {
      alert("Only resolved requests can be deleted.");
      return;
    }

    setDeleteTarget(request);
    setShowDeleteConfirm(true);
  };

  const cancelDeleteFlow = () => {
    setShowDeleteConfirm(false);
    setShowPasswordPrompt(false);
    setDeletePassword("");
    setDeleteTarget(null);
  };

  const confirmDeleteFlow = () => {
    setShowDeleteConfirm(false);
    setShowPasswordPrompt(true);
  };

  const submitDelete = async () => {

    if (!deleteTarget || !deletePassword.trim()) return;

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token") || "";
      const response = await fetch(
        `/api/requests/delete/${deleteTarget._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token
          },
          body: JSON.stringify({ password: deletePassword })
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      setSelected(null);
      load();
      cancelDeleteFlow();

    } catch (err) {
      alert(err?.message || "Failed to delete request");
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     DETAILS
  ========================================= */
  const openDetails = async (request) => {

    setSelected(request);

    try {
      const token = localStorage.getItem("token") || "";
      const res = await api.get(`/requests/${request._id}`, {
        headers: {
          authorization: token
        }
      });
      setSelected(res.data);
    } catch {
      // keep summary if fails
    }
  };

  /* =========================================
     HELPERS
  ========================================= */
  const getBadge = (p) => {
    if (p === "High") return "badge-high";
    if (p === "Medium") return "badge-medium";
    return "badge-low";
  };

  const filtered = data.filter(d =>
    (d.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
  };

  const stats = {
    total: data.length,
    open: data.filter(r => r.status === "Open").length,
    progress: data.filter(r => r.status === "In Progress").length,
    resolved: data.filter(r => r.status === "Resolved").length
  };

  /* =========================================
     RENDER
  ========================================= */
  return (
    <div className="container">

      {/* TOP BAR */}
      <div className="topbar">
        <h2 className="title">Service Requests</h2>

        <div className="nav">
          <Link className="btn-secondary" href="/dashboard">
            Dashboard
          </Link>

          <Link className="btn" href="/create">
            New Request
          </Link>

          <button className="btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-2 section-spacing">
        {Object.entries(stats).map(([key, value]) => (
          <div className="card" key={key}>
            <div className="muted">{key}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">

        <input
          className="search"
          placeholder="Search by title..."
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="filter"
          onChange={e =>
            setFilter({ ...filter, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <select
          className="filter"
          onChange={e =>
            setFilter({ ...filter, priority: e.target.value })
          }
        >
          <option value="">All Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          className="filter"
          onChange={e =>
            setFilter({ ...filter, category: e.target.value })
          }
        >
          <option value="">All Categories</option>
          <option>IT</option>
          <option>Admin</option>
          <option>Facilities</option>
        </select>

      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {filtered.map(r => (

            <button
              type="button"
              className="card card-clickable card-button"
              key={r._id}
              onClick={() => openDetails(r)}
            >
              <h3>{r.title}</h3>

              <span className={getBadge(r.priority)}>
                {r.priority}
              </span>

              <p>{r.description}</p>

            <p className="muted">Status: {r.status}</p>

            <div className="card-footer">
              <select
                className="status-select"
                value={r.status}
                onClick={e => e.stopPropagation()}
                onChange={e =>
                  updateStatus(r._id, e.target.value)
                }
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            </button>
          ))}
        </div>
      )}

      {/* DETAILS MODAL */}
      {selected && (
        <dialog className="modal-backdrop" open>
          <div className="modal">
            <div className="modal-header">
              <h3 className="title">{selected.title}</h3>
              <div className="modal-actions">
                {selected.status === "Resolved" && (
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => deleteRequest(selected)}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <div className="detail-label">Priority</div>
                <div>{selected.priority ?? "—"}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Status</div>
                <div className="detail-status">
                  <span>{selected.status ?? "—"}</span>
                  <select
                    className="status-select"
                    value={selected.status}
                    onChange={e =>
                      updateStatus(selected._id, e.target.value)
                    }
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Category</div>
                <div>{selected.category ?? "—"}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Requester</div>
                <div>{selected.requesterName ?? "—"}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Email</div>
                <div>{selected.requesterEmail ?? "—"}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Created</div>
                <div>{formatDate(selected.createdAt)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Description</div>
                <div>{selected.description ?? "—"}</div>
              </div>
            </div>
          </div>
        </dialog>
      )}

      {/* ========== DELETE CONFIRM MODALS ========== */}

      {showDeleteConfirm && (
        <dialog className="modal-backdrop" open>
          <div className="modal modal-small">

            <h3>Confirm deletion</h3>

            <p>
              This will permanently delete the request.
            </p>

            <div className="modal-actions">
              <button className="btn-secondary btn-cancel" onClick={cancelDeleteFlow}>
                Cancel
              </button>

              <button
                className="btn-danger"
                onClick={confirmDeleteFlow}
              >
                Yes, delete
              </button>
            </div>

          </div>
        </dialog>
      )}

      {showPasswordPrompt && (
        <dialog className="modal-backdrop" open>
          <div className="modal modal-small">

            <h3>Enter your login password</h3>

            <input
              type="password"
              value={deletePassword}
              onChange={e =>
                setDeletePassword(e.target.value)
              }
            />

            <div className="modal-actions">

              <button className="btn-secondary btn-cancel" onClick={cancelDeleteFlow}>
                Cancel
              </button>

              <button
                className="btn-danger"
                onClick={submitDelete}
                disabled={!deletePassword.trim() || actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>

            </div>
          </div>
        </dialog>
      )}

    </div>
  );
}
