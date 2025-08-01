export const networks = ["mainnet", "hoodi"] as const;

export type Network = (typeof networks)[number];
