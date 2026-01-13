import { useState, useEffect } from "react";
import "./App.css";
import BTCChart from "./BTCChart";
import Ads from "./components/Ads";
import { supabase } from "./lib/supabaseClient";
import WalletButton from "./components/WalletButton";
import CryptoNews from "./components/CryptoNews";
import Portfolio from "./components/Portfolio";
import { Routes, Route } from "react-router-dom";
import PaymentSuccess from "./pages/PaymentSuccess";
import PremiumGate from "./components/PremiumGate";
import ChainIQPro from "./pages/ChainIQPro";
import ChainIQProPreview from "./components/ChainIQProPreview";

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


function Home() {
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
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [btcPrice, setBtcPrice] = useState(null);
  const [lastPrice, setLastPrice] = useState(null);
  const [priceFlash, setPriceFlash] = useState("");
  const [history, setHistory] = useState([]);
  const [btcChange24h, setBtcChange24h] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [toast, setToast] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const isMobile = window.innerWidth < 768;
  const [currency, setCurrency] = useState("NGN");
  const [upgradeLoading, setUpgradeLoading] = useState(false);



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
  
  const isAuthReady = userRole !== null;
  console.log("User role:", userRole);
  const handleLogin = async () => {
    if (!authEmail) {
       setToast("Please enter your email.");
       return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail,
      options: {
        emailRedirectTo: window.location.origin,
      },
     });

     if (error) {
       setToast(error.message);
     } else {
       setToast("Check your email for the login link.");
       setShowAuth(false);
       setAuthEmail("");
     }
    };

    const handleLogout = async () => {
    await supabase.auth.signOut();
  };
    const handleUpgrade = async () => {
  try {
    setUpgradeLoading(true);
    setToast("Redirecting to payment...");

   // Get active session
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      setToast("Please sign in to upgrade.");
      setUpgradeLoading(false);
      return;
    }
    
    //Call backend (No currency trust)
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/paystack/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,

        // Country hint (backend still decides currency)
        "X-country": currency === "NGN" ? "NG" : "US",
      },
    }
);

  const result = await res.json();
  console.log("paystack init", result);

  if (!res.ok || !result.authorization_url) {
    throw new Error(result.error || "Payment initialization failed");
  }

    // Hard redirect (correct for paystack)
    window.location.href = result.authorization_url;
  } catch (err) {
    console.error("Upgrade error:", err);
    setToast("Unable to start payment. Please try again.");
    setUpgradeLoading(false);
  }
};

     const availableCoins =
  userRole === "premium"
    ? [...coins, ...premiumCoins]
    : coins;

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
  let isMounted = true;

  const loadSessionAndRole = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Auth session error:", error);
      if (isMounted) setUserRole("free");
      return;
    }

    const sessionUser = data.session?.user ?? null;

    if (isMounted) setUser(sessionUser);

    if (sessionUser) {
      const { data: profile, error: roleError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionUser.id)
        .single();

      if (isMounted) {
        setUserRole(profile?.role ?? "free");
      }

      if (roleError) {
        console.error("Role fetch error:", roleError);
      }
    } else {
      if (isMounted) setUserRole("free");
    }
  };

  loadSessionAndRole();

  const { data: listener } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);

      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authUser.id)
          .single();

        setUserRole(profile?.role ?? "free");
      } else {
        setUserRole("free");
      }
    }
  );

  return () => {
    isMounted = false;
    listener.subscription.unsubscribe();
  };
}, []);

// ------------------------------------
// SAFETY NET: Prevent infinite auth wait
// ------------------------------------
useEffect(() => {
  if (userRole === null) {
    const timeout = setTimeout(() => {
      console.warn("Auth role timeout — defaulting to free");
      setUserRole("free");
    }, 2500);

    return () => clearTimeout(timeout);
  }
}, [userRole]);

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
    setIsCalculating(true);

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
      if (data.error) {
        setError(data.error);
        return;
      }

      setResult(data);
    } catch {
      setError("Backend not reachable.");
    } finally {
      setIsCalculating(false);
    }
  };
  
 return(
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
    {!isMobile ? (
      <WalletButton />
    ) : (
      <button className="auth-btn" disabled>
       {/* Connect Wallet */}
       </button>
    )} 

    {!user ? (
      <button className="auth-btn" onClick={() => setShowAuth(true)}>
        Sign In
      </button>
    ) : (
      <button className="auth-btn" onClick={handleLogout}>
        Logout
      </button>
    )}
  </div>
)}
    {/* Currency Selector (only for free users) */}
{user && userRole !== "premium" && (
  <div className="currency-selector">
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
    >
      <option value="NGN">₦ NGN</option>
      <option value="USD">$ USD</option>
    </select>
  </div>
)}

{/* Premium / Upgrade button */}
<button
  className="upgrade-btn"
  disabled={!isAuthReady || upgradeLoading}
  onClick={() => {
    if (!user) {
      setToast("Please sign in to upgrade to ChainIQ Pro.");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    if (userRole === "premium") {
      setToast("You already have ChainIQ Pro ✓");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    handleUpgrade();
  }}
>
  {!isAuthReady
    ? "Checking account..."
    : upgradeLoading
      ? "Redirecting to payment..."
      : userRole === "premium"
        ? "ChainIQ Pro ✓"
        : "Get Premium ChainIQ Pro"}
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
     {/* 🔒 CHAINIQ PRO SECTION */}
     {userRole !== "premium" && (
  <ChainIQProPreview onUpgrade={handleUpgrade} />
)}

    <PremiumGate
      user={user}
      userRole={userRole}
      isAuthReady={isAuthReady}
>
      <ChainIQPro />
    </PremiumGate>


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

        <button 
          onClick={calculate} disabled={isCalculating || !amount || !buy || !sell}
          > 
          {isCalculating ? "Calculating..." : "CALCULATE PROFIT"}
          </button>

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
        {!user && (
          <p className="info">
          Sign in to track your portfolio.</p>)}



        <p className="info">World's best crypto-investment Hub.</p>
        <p className="info">Background image by Stockcake.</p>  
        <footer>
          © 2025 TechStudio24-365 .secure .No Finacial advice</footer>
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
{showAuth && (
  <div className="modal-overlay" onClick={() => setShowAuth(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setShowAuth(false)}>
        ✕
      </button>

      <h2>Sign in to CryptoIQ</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={authEmail}
        onChange={(e) => setAuthEmail(e.target.value)}
        style={{ marginTop: "12px" }}
      />

      <button style={{ marginTop: "14px" }} onClick={handleLogin}>
        Send Login Link
      </button>

      <p style={{ marginTop: "10px", fontSize: "0.85rem", opacity: 0.8 }}>
        We’ll send you a secure sign-in link.
      </p>
    </div>
  </div>
)}

{toast && (
  <div className="toast">
    {toast}
  </div>
)}

    </>
  );
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/payment-success" element={<PaymentSuccess />} />
    </Routes>
  );

  
}

export default App;