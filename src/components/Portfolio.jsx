import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

export default function Portfolio() {
  const [coin, setCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
    // F3 — edit state
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editBuyPrice, setEditBuyPrice] = useState("");

  const updateHolding = async (id) => {
  const token = await getToken();
  if (!token) return setMsg("Please sign in.");

  const res = await fetch(`${BACKEND}/portfolio/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: Number(editAmount),
      buy_price: Number(editBuyPrice),
    }),
  });

  const data = await res.json();
  if (data?.error) return setMsg(data.error);

  setEditingId(null);
  await loadPortfolio();
  await loadSummary();
  setMsg("Holding updated ✓");
};

  const deleteHolding = async (id) => {
  if (!window.confirm("Delete this holding?")) return;

  const token = await getToken();
  if (!token) return setMsg("Please sign in.");

  const res = await fetch(`${BACKEND}/portfolio/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (data?.error) return setMsg(data.error);

  await loadPortfolio();
  await loadSummary();
  setMsg("Holding deleted ✓");
};

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  };

  const loadPortfolio = async () => {
  setLoading(true);
  setMsg("");

  const token = await getToken();
  if (!token) {
    setLoading(false);
    return setMsg("Please sign in to manage your portfolio.");
  }

  const res = await fetch(`${BACKEND}/portfolio`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (data?.error) {
    setLoading(false);
    return setMsg(data.error);
  }

  setItems(data);
  setLoading(false);
};


  const loadSummary = async () => {
  setLoading(true);

  const token = await getToken();
  if (!token) {
    setLoading(false);
    return;
  }

  const res = await fetch(`${BACKEND}/portfolio/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!data?.error) setSummary(data);

  setLoading(false);
};

  const addHolding = async () => {
    setMsg("");
    const token = await getToken();
    if (!token) return setMsg("Please Sign In first.");

    const res = await fetch(`${BACKEND}/portfolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        coin,
        amount: Number(amount),
        buy_price: Number(buyPrice),
      }),
    });

    const data = await res.json();
    if (data?.error) return setMsg(data.error);

    setAmount("");
    setBuyPrice("");
    await loadPortfolio();
    await loadSummary();
    setMsg("Added ✓");
  };

  useEffect(() => {
    loadPortfolio();
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="portfolio-box">
      <h3 className="portfolio-title">Portfolio</h3>

      {summary && (
        <div className="portfolio-summary">
          <div><strong>Invested:</strong> ${summary.invested}</div>
          <div><strong>Value:</strong> ${summary.currentValue}</div>
          <div
  className={
    Number(summary.profit) >= 0
      ? "profit-positive"
      : "profit-negative"
  }
  
  >
  <strong>P/L:</strong>{" "}
  {Number(summary.profit) >= 0 ? "▲ " : "▼ "}
  ${summary.profit} ({summary.profitPercent}%)
</div>

        </div>
      )}

      <div className="portfolio-form">
        <select value={coin} onChange={(e) => setCoin(e.target.value)}>
          <option>BTC</option>
          <option>ETH</option>
          <option>SOL</option>
          <option>BNB</option>
          <option>XRP</option>
          <option>ADA</option>
          <option>DOGE</option>
          <option>AVAX</option>
          <option>USDT</option>
          <option>USDC</option>
        </select>

        <input
          type="number"
          placeholder="Amount (e.g. 0.25)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="number"
          placeholder="Buy price (USD)"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
        />

        <button onClick={addHolding}>Add Holding</button>
      </div>

      {msg && <p className="portfolio-msg">{msg}</p>}

      <div className="portfolio-list">
        {loading ? (
  <p style={{ opacity: 0.7 }}>Loading portfolio…</p>
) : items.length === 0 ? (
  <p style={{ opacity: 0.85 }}>No holdings yet.</p>
) : (

        items.map((it) => (
  <div key={it.id} className="portfolio-item">
  <span><strong>{it.coin}</strong></span>

  {editingId === it.id ? (
    <>
      <input
        type="number"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
      />
      <input
        type="number"
        value={editBuyPrice}
        onChange={(e) => setEditBuyPrice(e.target.value)}
      />
    </>
  ) : (
    <>
      <span>{it.amount}</span>
      <span>${it.buy_price}</span>
    </>
  )}

  {editingId === it.id ? (
    <>
      <button onClick={() => updateHolding(it.id)}>💾</button>
      <button onClick={() => setEditingId(null)}>✕</button>
    </>
  ) : (
    <>
      <button
        onClick={() => {
          setEditingId(it.id);
          setEditAmount(it.amount);
          setEditBuyPrice(it.buy_price);
        }}
      >
        ✎
      </button>

      <button
        className="portfolio-delete"
        onClick={() => deleteHolding(it.id)}
      >
        🗑
      </button>
    </>
  )}
</div>

))

        )}
      </div>
    </div>
  );
}
