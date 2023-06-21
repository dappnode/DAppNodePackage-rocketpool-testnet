export const tabs = ["Setup", "Rewards", "Info"] as const;

export type Tab = (typeof tabs)[number];
