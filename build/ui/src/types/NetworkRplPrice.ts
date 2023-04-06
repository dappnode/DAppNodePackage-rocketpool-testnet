import { Status } from './Status';

export interface NetworkRplPrice {
    status: Status;
    error: string;
    rplPrice: number;
    rplPriceBlock: number;
    minPer8EthMinipoolRplStake: number;
    maxPer8EthMinipoolRplStake: number;
    minPer16EthMinipoolRplStake: number;
    maxPer16EthMinipoolRplStake: number;
}