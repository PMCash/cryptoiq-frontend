import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const finalize = async () => {
      // Refresh session to pull updated role from DB
      await supabase.auth.refreshSession();

      setStatus("success");

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
