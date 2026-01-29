import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function Home({ user, onLogout, onStartCall }) {
  const navigate = useNavigate();

  const [myId, setMyId] = useState("");
  const [status, setStatus] = useState("Connecting...");
  const [friendId, setFriendId] = useState("");

  useEffect(() => {
    const onConnect = () => {
      setMyId(socket.id);
      setStatus("Connected");
    };
    const onDisconnect = () => {
      setStatus("Disconnected");
      setMyId("");
    };

    if (socket.connected) onConnect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const copyMyId = async () => {
    try {
      await navigator.clipboard.writeText(myId || "");
      alert("Copied!");
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = myId || "";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Copied!");
    }
  };

  const startVideoCall = () => {
    const to = friendId.trim();
    if (!to) return alert("Paste friend's Socket ID");
    if (!myId) return alert("Socket not connected yet. Please wait.");

    socket.emit("callUser", { to, from: myId, name: user?.name || "User" });
    onStartCall({ to, from: myId, name: user?.name || "User" });
    // onStartCall navigates to /call
  };

  return (
    <div className="gc-app">
      <div className="gc-card">
        <div className="gc-cardInner">
          <div className="gc-header">
            <div className="gc-brand">
              <div className="gc-title">GoofyCall</div>
              <div className="gc-subtitle">Welcome, {user?.name || "User"}</div>
              <div className="gc-row" style={{ marginTop: 6 }}>
                <span className="gc-subtitle">Status:</span>
                <span className="gc-chip">{status}</span>
              </div>
            </div>

            <button className="gc-btn gc-btnGhost" onClick={onLogout}>
              Logout
            </button>
          </div>

          <div className="gc-divider" />

          <div className="gc-stack">
            <div>
              <div className="gc-sectionTitle">Your Socket ID</div>
              <div className="gc-inlineInput">
                <input className="gc-input" value={myId} readOnly placeholder="Connecting..." />
                <button className="gc-btn" onClick={copyMyId} disabled={!myId}>
                  Copy
                </button>
              </div>
              <div className="gc-help" style={{ marginTop: 8 }}>
                Tip: open app in two browsers → copy socket id → call → accept.
              </div>
            </div>

            <div className="gc-divider" />

            <div>
              <div className="gc-sectionTitle">Call Friend</div>
              <div className="gc-inlineInput">
                <input
                  className="gc-input"
                  value={friendId}
                  onChange={(e) => setFriendId(e.target.value)}
                  placeholder="Paste friend's Socket ID"
                />
                <button className="gc-btn gc-btnPrimary" onClick={startVideoCall}>
                  Video Call
                </button>
              </div>
            </div>
          </div>

          <div className="gc-divider" />

          <div className="gc-help">
            Next step: we can upgrade this to real video calling (WebRTC) so friend preview shows.
          </div>
        </div>
      </div>
    </div>
  );
}
