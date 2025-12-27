import { useState, useEffect } from "react";
import "./App.css";
import BTCChart from "./BTCChart";
import Ads from "./components/Ads";
import { supabase } from "./lib/supabaseClient";
import WalletButton from "./components/WalletButton";
import CryptoNews from "./components/CryptoNews";
import Portfolio from "./components/Portfolio";

const BACKEND = import.meta.env.VITE_BACKEND_URL;


// Top 10 cryptos
const coins = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { id: "tether", symbol: "USDT", name: "Tether", logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", logo: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
  { id: "solana", symbol: "SOL", name: "Solana", logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { id: "ripple", symbol: "XRP", name: "XRP", logo: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png" },
  { id: "usd-coin", symbol: "USDC", name: "USDC", logo: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png" },
  { id: "cardano", symbol: "ADA", name: "Cardano", logo: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", logo: "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", logo: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png" }
];

// Additional premium coins
const premiumCoins = [
  {
    id: "chainlink",
    symbol: "LINK",
    name: "Chainlink",
    logo: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png"
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    logo: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png"
  },
  {
    id: "litecoin",
    symbol: "LTC",
    name: "Litecoin",
    logo: "https://assets.coingecko.com/coins/images/2/large/litecoin.png"
  },
  {
    id: "shiba-inu",
    symbol: "SHIB",
    name: "Shiba Inu",
    logo: "https://assets.coingecko.com/coins/images/11939/large/shiba.png"
  },
  {
    id: "stellar",
    symbol: "XLM",
    name: "Stellar",
    logo: "https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black.png"
  }
];


function App() {
  const FEATURES = {
  wallet: true,
  premium: false,
  ads: true,
  extraCoins: false,
};
  const [hideHeader, setHideHeader] = useState(false);
  const [amount, setAmount] = useState("");
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [btcPrice, setBtcPrice] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);
  const [priceFlash, setPriceFlash] = useState("");
  const [history, setHistory] = useState([]);
  const [btcChange24h, setBtcChange24h] = useState(null);
  const [showContact, setShowContact] = useState(false);

  const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") || "light";
});
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [useRealtime, setUseRealtime] = useState(true);
  
  const currentCoin =
  coins.find(c => c.id === selectedCoin) || coins[0];

  
  // AUTH STATE (Supabase)
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const isPremiumUser = userRole === "premium" && FEATURES.premium;

  console.log("User role:", userRole);
  const handleLogin = async () => {
  const email = window.prompt("Enter your email to sign in:");
    if (!email) return;

  const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert("Error sending login link: " + error.message);
    } else {
      alert("Check your email for a magic login link.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

 const baseCoins = coins;

const availableCoins = FEATURES.extraCoins
  ? [...baseCoins, ...premiumCoins]
  : baseCoins;


// -----------------------------
// Theme initialization
// -----------------------------


// Keep DOM updated when theme changes
useEffect(() => {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}, [theme]);

useEffect(() => {
  let lastScrollY = window.scrollY;

  const onScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      setHideHeader(true);
    } else {
      setHideHeader(false);
    }
    lastScrollY = window.scrollY;
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

// Toggle theme
const toggleTheme = () => {
  setTheme(prev => (prev === "light" ? "dark" : "light"));
};


  useEffect(() => {
  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log("Auth session error:", error);
    } else {
      setUser(data.session?.user ?? null);
    }
  };

  getSession();

  // Listen for login/logout
  const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
    const user = session?.user ?? null;
    setUser(user);

    // Load role
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setUserRole(profile?.role ?? "free");
      console.log("User role:", profile?.role);
    } else {
      setUserRole("free");
    }
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  // -----------------------------
  // Fetch crypto price (Realtime ON/OFF)
  // -----------------------------
  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await res.json();

        const newPrice = data[selectedCoin].usd;
        const change24 = data[selectedCoin].usd_24h_change;

        setBtcChange24h(change24);

        // Flash effect
        if (lastPrice !== null) {
          if (newPrice > lastPrice) setPriceFlash("up");
          else if (newPrice < lastPrice) setPriceFlash("down");
        }

        setLastPrice(newPrice);
        setBtcPrice(newPrice);

        // Chart history (last 30 points)
        setHistory(prev => [...prev.slice(-29), newPrice]);

        setTimeout(() => setPriceFlash(""), 800);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchCoin();

    // If realtime OFF, do NOT auto-refresh
    if (!useRealtime) return;

    const interval = setInterval(fetchCoin, 6000);
    return () => clearInterval(interval);

  }, [selectedCoin, lastPrice, useRealtime]);

  // -----------------------------
  // Calculate profit
  // -----------------------------
  const calculate = async () => {
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${BACKEND}/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          buyPrice: Number(buy),
          sellPrice: Number(sell)
        })
      });

      const data = await response.json();
      if (data.error) return setError(data.error);

      setResult(data);
    } catch {
      setError("Backend not reachable.");
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <>
      {/* PREMIUM NAVBAR */}
      <nav className={`premium-nav ${hideHeader ? "nav-hidden" : ""}`}>

        {/* BRAND SECTION */}
        <div className="brand">
          <img src="/cryptoiq-logo.png" alt="CryptoIQ Logo" className="logo" />
        </div>

        {/* LEFT SIDE NAV */}

          <div className="brand-text">
            <h2 className="app-title">CryptoIQ</h2>
            <p className="app-subtitle">Powered by TechStudio24-365</p>
          </div>
          {/* Nav Links - now beside logo */}
          <div className="nav-links">
            <span className="nav-item active">Home</span>
            <span className="nav-item active">Tools</span>
            <span className="nav-item" onClick={() => setShowContact(true)} >Contact </span>
          </div>

        {/* RIGHT SIDE NAV */}
        <div className="nav-right">

          {/* Theme switch */}
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Realtime toggle */}
          <label className="realtime-toggle">
            <input
              type="checkbox"
              checked={useRealtime}
              onChange={(e) => setUseRealtime(e.target.checked)}
            />
            <span>Realtime</span>
          </label>

          {/* Live price */}
          <div className={`btc-price-display ${priceFlash}`}>
            {btcPrice ? (
              <>
              {currentCoin && (
                <img
                  src={currentCoin.logo}
                  alt={currentCoin.symbol}
                  style={{ width: "20px", marginRight: "6px" }}
                />
                )}
                {currentCoin.symbol}: {btcPrice.toLocaleString()}
                <span
                  style={{
                    marginLeft: "8px",
                    color: btcChange24h >= 0 ? "limegreen" : "red",
                    fontWeight: "600",
                  }}
                >
                  {btcChange24h ? `${btcChange24h.toFixed(2)}%` : ""}
                </span>
              </>
            ) : "Loading..."}
          </div>

          {/* Mini chart */}
          <div style={{ width: "150px", height: "60px" }}>
            <BTCChart history={history} />
          </div>

          {/* Coin picker */}
          <div className="coin-dropdown">
            <div className="selected-coin">
              <img src={currentCoin.logo} alt="" />
              <span>{currentCoin.symbol}</span>
            </div>

            <div className="coin-menu">
              {availableCoins.map(coin => (
                <div
                  key={coin.id}
                  className="coin-option"
                  onClick={() => setSelectedCoin(coin.id)}
                >
                  <img src={coin.logo} alt={coin.symbol} />
                  <span>{coin.symbol}</span>
                </div>
              ))}
            </div>
          </div>

{FEATURES.wallet && (
  <div className="wallet-zone">
    <WalletButton />

    {!user ? (
      <button className="auth-btn" onClick={handleLogin}>
        Sign In
      </button>
    ) : (
      <button className="auth-btn" onClick={handleLogout}>
        Logout
      </button>
    )}
  </div>
)}

{/* Premium / Upgrade button */}
<button
  className="upgrade-btn"
  onClick={() => {
    if (!isPremiumUser){
      alert("Sign-in/Sign-up first to upgrade to ChainIQ Pro.");
      return;
    }

    if (userRole === "premium") {
      alert("You already have ChainIQ Pro ✓");
    } else {
      alert("Upgrade flow coming soon. For now, contact TechStudio24 support to upgrade your account.");
    }
  }}
>
  {userRole === "premium" ? "ChainIQ Pro ✓" : "Get Premium ChainIQ Pro"}
</button>


        </div>
      </nav>

      <div className="coin-wrapper">
        <img src="/bitcoin.png" className="btc-coin coin1" />
        <img src="/bitcoin.png" className="btc-coin coin2" />
        <img src="/bitcoin.png" className="btc-coin coin3" />
     </div>


      {/* MAIN CONTENT GRID*/}
      <div className="layout-grid" />

      {/* Left ASIDE - Crypto News */}
      <aside className="left-aside">
      <CryptoNews />
      </aside>
      
      {/* CENTER COLUMN CONTENT */}
      <div className="container">
        <h1>Crypto Wealth Manager</h1>
        <p className="sub">
          {currentCoin ? `${currentCoin.symbol} • ${currentCoin.name}` : ""}
        </p>

        <div className="card">
          <input
            type="number"
            placeholder="Amount Invested (USD)"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder={`Buy Price (${currentCoin.symbol})`}
            value={buy}
            onChange={e => setBuy(e.target.value)}
          />
          <input
            type="number"
            placeholder={`Target Price (${currentCoin.symbol})`}
            value={sell}
            onChange={e => setSell(e.target.value)}
          />

          <button onClick={calculate}>CALCULATE PROFIT</button>

          {error && <p className="error">{error}</p>}
        </div>

        {result && (
          <div className="result">
            <h3>Results ({currentCoin.symbol})</h3>
            <p><strong>New Value:</strong> ${result.newValue}</p>
            <p><strong>Profit:</strong> ${result.profit}</p>
            <p><strong>Growth:</strong> {result.growth}%</p>
          </div>
        )}
        {/* Ads disabled for premium users */}
        {FEATURES.ads && userRole !== "premium" && <Ads />}

        {user && <Portfolio />}
        {!user && <p className="info">Sign in to track your portfolio.</p>}



        <p className="info">World's best crypto-investment Hub.</p>
        <p className="info">Background image by Stockcake.</p>  
        <footer>© 2025 TechStudio24-365</footer>
      </div>
      {showContact && (
  <div className="modal-overlay" onClick={() => setShowContact(false)}>
    <div
      className="modal-card"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setShowContact(false)}
      >
        ✕
      </button>

      <h2>Contact CryptoIQ</h2>

      <p>
        For support, feedback, or partnerships:
      </p>

      <p>
        📧 <strong>support@techstudio24-365.com</strong>
      </p>

      <p style={{ marginTop: "12px", opacity: 0.8 }}>
        Powered by TechStudio24-365
      </p>
    </div>
  </div>
)}

    </>
  );
}

export default App;