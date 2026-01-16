import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    const finalize = async () => {
      console.log("Paystack reference:", reference);

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        navigate("/", { replace: true });
        return;
      }

      // Refresh to pick up role updated by webhook
      await supabase.auth.refreshSession();

      setStatus("success");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2500);
    };

    finalize();
  }, [navigate, reference]);

  return (
    <div className="payment-status">
      {status === "verifying" && <h2>Finalizing your upgrade…</h2>}
      {status === "success" && (
        <h2>🎉 Upgrade successful! Welcome to CryptoIQ Pro.</h2>
      )}
    </div>
  );
}
