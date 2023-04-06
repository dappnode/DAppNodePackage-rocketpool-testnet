import { GasInfo } from './GasInfo';
import { Status } from './Status';

export interface NodeCanSetWithdrawalAddress {
    status: Status;
    error: string;
    canSet: boolean;
    gasInfo: GasInfo;
}