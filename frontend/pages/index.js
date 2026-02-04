export default function Home() {
  return (
    <div className="container">
      <div className="card auth-card">
        <h2 className="section-title">Smart Service Portal</h2>
        <p className="muted">
          Students and employees can submit a request without logging in.
        </p>
        <div className="nav" style={{ justifyContent: "center" }}>
          <a className="btn" href="/create">Make a Request</a>
          <a className="btn-secondary" href="/login">Admin Login</a>
        </div>
      </div>
    </div>
  );
}
