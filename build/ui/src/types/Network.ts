export const networks = ["mainnet", "holesky"] as const;

export type Network = (typeof networks)[number];
