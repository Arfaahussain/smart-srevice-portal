import { useEffect, useState } from "react";
import api from "../services/api";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Dashboard() {

  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    progress: 0,
    resolved: 0
  });

  const load = async () => {
    const token = localStorage.getItem("token") || "";
    const res = await api.get("/requests", {
      headers: {
        authorization: token
      }
    });

    const all = res.data;

    setStats({
      total: all.length,
      open: all.filter(r => r.status === "Open").length,
      progress: all.filter(r => r.status === "In Progress").length,
      resolved: all.filter(r => r.status === "Resolved").length
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // eslint-disable-next-line
    load();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="container">
      <div className="topbar">
        <h2 className="title">Dashboard</h2>
        <div className="nav">
          <Link className="btn-secondary" href="/requests">Requests</Link>
          <Link className="btn" href="/create">New Request</Link>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="muted">Total</div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="card">
          <div className="muted">Open</div>
          <div className="stat-value">{stats.open}</div>
        </div>

        <div className="card">
          <div className="muted">In Progress</div>
          <div className="stat-value">{stats.progress}</div>
        </div>

        <div className="card">
          <div className="muted">Resolved</div>
          <div className="stat-value">{stats.resolved}</div>
        </div>
      </div>
    </div>
  );
}

