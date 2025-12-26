// src/components/WalletButton.jsx

import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const short = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <button
      onClick={() => open()}
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.4)",
        background: "transparent",
        color: "#fff",
        cursor: "pointer",
        fontSize: "0.8rem",
      }}
    >
      {isConnected ? short : "Connect Wallet"}
    </button>
  );
}