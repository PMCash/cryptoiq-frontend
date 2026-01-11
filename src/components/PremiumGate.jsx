export default function PremiumGate({
  user,
  userRole,
  isAuthReady,
  onUpgrade,
  children
}) {
  if (!isAuthReady) {
    return (
      <p style={{ opacity: 0.7, marginTop: "16px" }}>
        Checking subscription...
      </p>
    );
  }

  if (!user) {
    return (
      <div style={{
        padding: "20px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "10px",
        textAlign: "center",
        color: "white",
        marginTop: "20px"
      }}>
        <h3>Sign in required</h3>
        <p>Please sign in to access this feature.</p>
      </div>
    );
  }

  if (userRole !== "premium") {
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

        {onUpgrade && (
          <button
            onClick={onUpgrade}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#ffd700",
              color: "#000",
              borderRadius: "8px",
              cursor: "pointer",
              border: "none",
              fontWeight: "600"
            }}
          >
            Upgrade to ChainIQ Pro
          </button>
        )}
      </div>
    );
  }

  return children;
}
