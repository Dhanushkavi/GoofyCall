import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://goofycall.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Register failed");

      alert("Registered! Go to login");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-app">
      <div className="gc-card">
        <div className="gc-cardInner">
          <div className="gc-title">Register</div>
          <div className="gc-subtitle" style={{ marginTop: 6 }}>
            Create your GoofyCall account
          </div>

          <form className="gc-form" onSubmit={handleRegister}>
            <div>
              <div className="gc-label">Name</div>
              <input
                className="gc-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <div className="gc-label">Email</div>
              <input
                className="gc-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="gc-label">Password</div>
              <input
                className="gc-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="gc-row" style={{ justifyContent: "space-between" }}>
              <button className="gc-btn gc-btnPrimary" disabled={loading}>
                {loading ? "Creating..." : "Register"}
              </button>

              <span className="gc-help">
                Already user? <Link to="/login">Login</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
