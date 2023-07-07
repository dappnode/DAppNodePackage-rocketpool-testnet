export const tabs = ["Setup", "Rewards", "Info", "Advanced"] as const;

export type Tab = (typeof tabs)[number];
