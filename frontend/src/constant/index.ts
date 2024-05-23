import { createConfig, http, injected } from "@wagmi/core";
import { sepolia, base } from "@wagmi/core/chains";
import { createClient } from "viem";
export const BACKEND_API = import.meta.env.VITE_BACKEND_URL;
export const NETWORK = import.meta.env.VITE_NETWORK;
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
export const SERVICE_FEE = import.meta.env.VITE_PAYMENT;
export const DEAD_ADDRESS = "0x0000000000000000000000000000000000000000";

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
  //   transports: {
  //     // [base.id]: http(),
  //     [sepolia.id]: http(),
  //   },
});
