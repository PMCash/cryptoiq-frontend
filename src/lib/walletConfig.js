// src/lib/walletConfig.js
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { mainnet } from "viem/chains";

export const projectId = "1b118ed1ae63ecb01dd569fb68b42131";

export const metadata = {
  name: "CryptoIQ",
  description: "Crypto Portfolio & Profit Calculator",
  url: "https://your-app.com",
  icons: ["https://your-app.com/logo.png"],
};

export const chains = [mainnet];

export const wagmiConfig = defaultWagmiConfig({
  projectId,
  chains,
  metadata,
});

// IMPORTANT: create the Web3Modal instance (browser only)
if (typeof window !== "undefined") {
  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
  });
}

