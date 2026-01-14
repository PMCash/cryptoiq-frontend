import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
  const finalize = async () => {
    // Ensure auth session exists
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      // User not logged in — redirect safely
      navigate("/", { replace: true });
      return;
    }

    // Force profile re-fetch by triggering auth state change
    await supabase.auth.refreshSession();

    setStatus("success");

    // Short delay for UX
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 2500);
  };

  finalize();
}, [navigate]);

  return (
    <div className="payment-status">
      {status === "verifying" && <h2>Finalizing your upgrade…</h2>}
      {status === "success" && (
        <h2>🎉 Upgrade successful! Welcome to CryptoIQ Pro.</h2>
      )}
    </div>
  );
}
