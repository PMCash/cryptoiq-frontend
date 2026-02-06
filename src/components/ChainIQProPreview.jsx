export default function ChainIQProPreview({ onUpgrade }) {
  return (
    <div
      className="card"
      style={{
        marginTop: "20px",
        background: "linear-gradient(135deg, #1f2933, #111827)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.15)"
      }}
    >
      {/* Header with logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px"
        }}
      >
        <img
          src="/cryptoiq-logo.png"
          alt="ChainIQ Pro"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "6px"
          }}
        />
        <h2 style={{ margin: 0 }}>ChainIQ Pro</h2>
      </div>

      <p style={{ opacity: 0.85 }}>
        Unlock advanced analytics, premium coins, smart signals,
        and professional-grade crypto tools.
      </p>

      <ul style={{ marginTop: "10px", opacity: 0.8 }}>
        <li>✔ Premium coins & market insights</li>
        <li>✔ Advanced profit & risk analytics</li>
        <li>✔ Pro signals & alerts</li>
        <li>✔ Portfolio performance tracking</li>
      </ul>

      <button
        onClick={onUpgrade}
        style={{
          marginTop: "14px",
          padding: "10px 20px",
          background: "#ffd700",
          color: "#000",
          borderRadius: "8px",
          fontWeight: "600",
          border: "none",
          cursor: "pointer"
        }}
      >
        Upgrade to Premium ChainIQ Pro
      </button>
    </div>
  );
}
