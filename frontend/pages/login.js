import { useState } from "react";
import { useRouter } from "next/router";
import api from "../services/api";

export default function Login() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      router.push("/requests");

    } catch (err) {
      const message =
        err?.response?.data || "Invalid credentials. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="container">
      <div className="card auth-card">
        <h2 className="section-title">Login</h2>
        <p className="muted">Sign in to continue.</p>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          placeholder="name@company.com"
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange}
        />

        <button className="btn" onClick={login}>Login</button>
      </div>
    </div>
  );
}
