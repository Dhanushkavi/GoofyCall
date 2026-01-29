import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://goofycall.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msg || "Login failed");

      alert(data.msg || "Login success");
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-app">
      <div className="gc-card">
        <div className="gc-cardInner">
          <div className="gc-title">GoofyCall</div>
          <div className="gc-subtitle" style={{ marginTop: 6 }}>
            Login to continue
          </div>

          <form className="gc-form" onSubmit={handleLogin}>
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
                placeholder="••••••••"
                required
              />
            </div>

            <div className="gc-row" style={{ justifyContent: "space-between" }}>
              <button className="gc-btn gc-btnPrimary" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <span className="gc-help">
                Don&apos;t have an account? <Link to="/register">Register</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
