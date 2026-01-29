import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";

export default function Call({ user, call, onEnd }) {
  const localVideoRef = useRef(null);
  const [mediaStatus, setMediaStatus] = useState("Requesting camera/mic...");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [stream, setStream] = useState(null);

  const role = call?.role || (call?.isIncoming ? "receiver" : "caller");
  const myId = socket.id;
  const friendId = role === "caller" ? call?.to : call?.from;

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!active) return;
        setStream(s);
        if (localVideoRef.current) localVideoRef.current.srcObject = s;
        setMediaStatus("Ready");
      } catch (e) {
        setMediaStatus("Permission denied (camera/mic)");
      }
    })();

    const onCallEnded = () => onEnd();
    socket.on("callEnded", onCallEnded);

    return () => {
      active = false;
      socket.off("callEnded", onCallEnded);
      // stop stream
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMute = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = muted));
    setMuted((v) => !v);
  };

  const toggleCamera = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = cameraOff));
    setCameraOff((v) => !v);
  };

  const end = () => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
    } catch {}
    // optional notify friend
    if (friendId) socket.emit("endCall", { to: friendId, from: myId });
    onEnd();
  };

  return (
    <div className="gc-app">
      <div className="gc-card gc-callWrap">
        <div className="gc-cardInner">
          <div className="gc-header">
            <div className="gc-brand">
              <div className="gc-title">GoofyCall</div>
              <div className="gc-subtitle">
                Status: <span className="gc-chip">{role === "caller" ? "Calling..." : "Connected (receiver)"}</span>{" "}
                <span className="gc-chip">{mediaStatus}</span>
              </div>
            </div>

            <button className="gc-btn gc-btnDanger" onClick={end}>End</button>
          </div>

          <div className="gc-divider" />

          <div className="gc-callGrid">
            <div className="gc-videoBox">
              <div className="gc-videoTag">You</div>
              <video ref={localVideoRef} autoPlay playsInline muted />
              {!stream && <div className="gc-videoEmpty">Camera preview will appear here</div>}
            </div>

            <div className="gc-videoBox">
              <div className="gc-videoTag">Friend</div>
              <div className="gc-videoEmpty">
                Friend preview (WebRTC upgrade needed)
                <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
                  Friend ID: {friendId || "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="gc-row" style={{ justifyContent: "center", marginTop: 14 }}>
            <button className="gc-btn" onClick={toggleMute} disabled={!stream}>
              {muted ? "Unmute" : "Mute"}
            </button>
            <button className="gc-btn" onClick={toggleCamera} disabled={!stream}>
              {cameraOff ? "Camera On" : "Camera Off"}
            </button>
          </div>

          <div className="gc-help" style={{ marginTop: 12 }}>
            Next step: upgrade signaling + WebRTC peer connection so friend video shows.
          </div>
        </div>
      </div>
    </div>
  );
}
