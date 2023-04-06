export const status = ["success", "error"] as const;

export type Status = (typeof status)[number];