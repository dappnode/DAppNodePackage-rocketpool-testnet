import { Status } from './Status';

export interface TxResponse {
    status: Status;
    error: string;
    txHash: string;
}