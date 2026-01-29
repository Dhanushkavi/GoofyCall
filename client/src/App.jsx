import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { socket } from "./socket";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Call from "./pages/Call";
import IncomingCall from "./components/IncomingCall";

/**
 * Router wrapper so we can use useNavigate in the inner app.
 */
function AppInner() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  // call state:
  // { from, to, name, isIncoming, role: 'caller'|'receiver' }
  const [call, setCall] = useState(null);
  const [inCall, setInCall] = useState(false);

  useEffect(() => {
    const onIncoming = (data) => {
      setCall({ ...data, isIncoming: true });
      setInCall(false);
    };

    const onCallAccepted = (data) => {
      // data can be undefined in your server, so keep safe.
      setCall((prev) => prev ? { ...prev, ...(data || {}), isIncoming: false, role: "caller" } : prev);
      setInCall(true);
      navigate("/call");
    };

    const onCallEnded = () => {
      setInCall(false);
      setCall(null);
      navigate("/");
    };

    socket.on("incomingCall", onIncoming);
    socket.on("callAccepted", onCallAccepted);
    socket.on("callEnded", onCallEnded);

    return () => {
      socket.off("incomingCall", onIncoming);
      socket.off("callAccepted", onCallAccepted);
      socket.off("callEnded", onCallEnded);
    };
  }, [navigate]);

  const startCall = ({ to, from, name }) => {
    setCall({ to, from, name, isIncoming: false, role: "caller" });
    setInCall(true);
    navigate("/call");
  };

  const acceptCall = () => {
    if (!call) return;
    // notify caller that receiver accepted
    socket.emit("acceptCall", { to: call.from, from: socket.id });
    setCall((prev) => prev ? { ...prev, isIncoming: false, role: "receiver" } : prev);
    setInCall(true);
    navigate("/call");
  };

  const rejectCall = () => {
    setCall(null);
    setInCall(false);
  };

  const endCall = () => {
    // optional broadcast (server may or may not handle it)
    if (call?.from && call?.to) {
      const otherId = call.role === "caller" ? call.to : call.from;
      socket.emit("endCall", { to: otherId, from: socket.id });
    }
    setInCall(false);
    setCall(null);
    navigate("/");
  };

  // Overlay incoming call modal on top of any page
  const showIncoming = !!(call?.isIncoming && !inCall);

  return (
    <>
      {showIncoming && (
        <IncomingCall
          call={call}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Home user={user} onLogout={() => { localStorage.removeItem("user"); setUser(null); navigate("/login"); }} onStartCall={startCall} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/call"
          element={
            user && inCall && call ? (
              <Call user={user} call={call} onEnd={endCall} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
