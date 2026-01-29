export default function IncomingCall({ call, onAccept, onReject }) {
  if (!call) return null;

  return (
    <div className="gc-modalOverlay" role="dialog" aria-modal="true">
      <div className="gc-modal">
        <div className="gc-header" style={{ marginBottom: 10 }}>
          <div className="gc-brand">
            <div className="gc-title" style={{ fontSize: 26 }}>Incoming call</div>
            <div className="gc-subtitle">
              From <span className="gc-chip" style={{ marginLeft: 6 }}>{call.name || call.from || "Unknown"}</span>
            </div>
          </div>
        </div>

        <div className="gc-row" style={{ marginTop: 10 }}>
          <button className="gc-btn gc-btnDanger" onClick={onReject}>Reject</button>
          <button className="gc-btn gc-btnPrimary" onClick={onAccept}>Accept</button>
        </div>

        <div className="gc-help" style={{ marginTop: 10 }}>
          Tip: Keep both tabs open. Accept from receiver side.
        </div>
      </div>
    </div>
  );
}
