import { Status } from './Status';

export interface NodeFee {
    status: Status;
    error: string;
    nodeFee: number;
    minNodeFee: number;
    targetNodeFee: number;
    maxNodeFee: number;
}