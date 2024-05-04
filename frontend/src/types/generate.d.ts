import { Dayjs } from "dayjs";

export type GenerateParamType = {
  name: string;
  symbol: string;
  decimal?: number;
  supply?: number;
  maxBuy?: number;
  initialLP?: number;
  owner: string;
  mintable?: boolean;
  buyMarketingFee: number;
  buyLiquidityFee: number;
  buyDevelopmentFee: number;
  sellMarketingFee: number;
  sellLiquidityFee: number;
  sellDevelopmentFee: number;
  teamWalletAddress: string;
  teamDistributionPercentage: number;
  unlockTime: Dayjs;
  totalSupply: number;
  mode: "advance" | "basic";
  liquidityAdd: boolean;
};
