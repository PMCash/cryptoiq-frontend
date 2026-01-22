export default function ComingSoonBanner() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "500",
        zIndex: 9999,
        pointerEvents: "auto",
      }}
    >
      <span>Mobile Apps Coming Soon</span>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img
            src="/ios-logo.svg"
            alt="iOS"
            style={{ width: "18px", height: "18px" }}
          />
          <span>iOS</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img
            src="/android-logo.png"
            alt="Android"
            style={{ width: "18px", height: "18px" }}
          />
          <span>Android</span>
        </div>
      </div>
    </div>
  );
}
