import { Status } from './Status';

export interface StakeRplApprove {
    status: Status;
    error: string;
    approveTxHash: string;
}