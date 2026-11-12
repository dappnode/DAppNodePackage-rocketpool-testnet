import { NetworkRplPrice } from "../types/NetworkRplPrice";
import { NodeStatus } from "../types/NodeStatus";

// export function to convert from wei to ether
export function toWei(ether: number): number {
  return ether * 10 ** 18;
}

export function toWeiString(wei: number | string): string {
  return BigInt(wei).toString();
}

export function ethToWeiString(ether: number): string {
  return (BigInt(Math.round(ether * 1000000)) * BigInt(10 ** 12)).toString();
}

export function toEther(wei: number | string): number {
  return Number(wei) / 10 ** 18;
}

export function toEtherString(wei: number | string): string {
  return toEther(wei).toFixed(4);
}

export function shortenAddress(address: string, chars = 4): string {
  const prefix = address.slice(0, chars);
  const suffix = address.slice(-chars);
  return `${prefix}...${suffix}`;
}

export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function enoughEthBalance(
  nodeStatus?: NodeStatus,
  networkRplPrice?: NetworkRplPrice
) {
  const minimum8Eth = 8200000000000000000;
  const minimum16Eth = 16200000000000000000;
  const minimumRpl8Eth = networkRplPrice?.minPer8EthMinipoolRplStake ?? 0;
  const ethBalance = nodeStatus?.accountBalances.eth ?? 0;
  const rplBalance = nodeStatus?.accountBalances.rpl ?? 0;
  const is8EthPool = rplBalance >= minimumRpl8Eth;
  return is8EthPool ? ethBalance >= minimum8Eth : ethBalance >= minimum16Eth;
}

export function ethBalanceGreaterThanMinStake(ethBalance: number): boolean {
  const minStake = BigInt(32 * 10 ** 18);
  return BigInt(ethBalance) > minStake;
}

export const escapeNewLine = (text: string) => text.replace(/(\\n)/g, "\n");
