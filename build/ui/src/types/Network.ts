export const networks = ["mainnet", "prater"] as const;

export type Network = (typeof networks)[number];
