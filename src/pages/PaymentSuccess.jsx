import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Navigate, useNavigate } from "react-router-dom";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function PaymentSuccess() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");

      if (!reference) {
        setStatus("error");
        setMessage("Missing payment reference.");
        return;
      }

      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (!token) {
        setStatus("error");
        setMessage("You must be signed in to complete upgrade.");
        return;
      }

      try {
        const res = await fetch(`${BACKEND}/paystack/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setStatus("success");
        setMessage("🎉 Upgrade successful! Welcome to ChainIQ Pro.");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2500);

      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div className="payment-status">
      {status === "verifying" && <h2>Verifying payment…</h2>}
      {status === "success" && <h2>{message}</h2>}
      {status === "error" && <h2 style={{ color: "red" }}>{message}</h2>}
    </div>
  );
}