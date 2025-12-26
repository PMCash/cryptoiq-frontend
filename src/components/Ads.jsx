import { useEffect } from "react";

export default function Ads() {

  // Load/refresh Google Ads when component mounts
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense error:", e);
    }
  }, []);

  return (
    <div style={{ marginTop: "20px", textAlign: "center", color: "white" }}>

      {/* REAL GOOGLE ADSENSE AD UNIT */}
   
    <ins className="adsbygoogle"
       style={{
       display: "block",
       width: "100%",
       height: "90px",   // ← FIXED HEIGHT
       overflow: "hidden"
    }}
       data-ad-client="ca-pub-8057901183478565"
       data-ad-slot="7690622440"
       data-ad-format="auto"
       data-full-width-responsive="true">
    </ins>

   

      {/* OPTIONAL PLACEHOLDER (only visible before ads activate) */}
      <div
        style={{
          padding: "12px",
          borderRadius: "8px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(6px)",
          fontSize: "0.9rem"
        }}
      >
        Ad space (Google AdSense loading...)
      </div>

    </div>
  );
}

