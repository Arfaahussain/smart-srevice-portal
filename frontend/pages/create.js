import { useState } from "react";
import api from "../services/api";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Create() {

  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category: "IT",
    description: "",
    priority: "Low",
    requesterName: "",
    requesterEmail: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -------- VALIDATION FUNCTION --------
  const validate = () => {

    if (!form.title.trim()) {
      alert("Title is required");
      return false;
    }

    if (!form.description.trim()) {
      alert("Description is required");
      return false;
    }

    if (!form.requesterName.trim()) {
      alert("Name is required");
      return false;
    }

    if (!form.requesterEmail.includes("@")) {
      alert("Enter valid email");
      return false;
    }

    return true;
  };

  const submit = async () => {

    if (!validate()) return;

    try {

      setLoading(true);

      await api.post("/requests", form);

      alert("Request Created Successfully");

      router.push("/");

    } catch {

      alert("Error creating request");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="topbar">
        <h2 className="title">Create Service Request</h2>
        <div className="nav">
          <Link className="btn-secondary" href="/">Home</Link>
          <Link className="btn-ghost" href="/login">Admin Login</Link>
        </div>
      </div>

      <div className="card form-card">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          placeholder="Short summary"
          onChange={handleChange}
        />

        <label htmlFor="category">Category</label>
        <select id="category" name="category" onChange={handleChange}>
          <option>IT</option>
          <option>Admin</option>
          <option>Facilities</option>
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe the issue or request"
          onChange={handleChange}
        />

        <label htmlFor="priority">Priority</label>
        <select id="priority" name="priority" onChange={handleChange}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label htmlFor="requesterName">Requester name</label>
        <input
          id="requesterName"
          name="requesterName"
          placeholder="Your name"
          onChange={handleChange}
        />

        <label htmlFor="requesterEmail">Requester email</label>
        <input
          id="requesterEmail"
          name="requesterEmail"
          placeholder="name@company.com"
          onChange={handleChange}
        />

        <button
          className="btn"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
