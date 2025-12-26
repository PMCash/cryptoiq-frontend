export default function PremiumGate({ userRole, children }) {
  if (userRole === "pro") {
    return children;
  }

  return (
    <div style={{
      padding: "20px",
      background: "rgba(255,255,255,0.1)",
      borderRadius: "10px",
      textAlign: "center",
      color: "white",
      marginTop: "20px"
    }}>
      <h3>Premium Feature</h3>
      <p>This tool requires a ChainIQ Pro subscription.</p>
      <button style={{
        marginTop: "10px",
        padding: "10px 20px",
        background: "#ffd700",
        color: "#000",
        borderRadius: "8px",
        cursor: "pointer"
      }}>
        Upgrade to ChainIQ Pro
      </button>
    </div>
  );
}
