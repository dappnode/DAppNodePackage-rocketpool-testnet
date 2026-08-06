import { Status } from './Status';
import { GasInfo } from './GasInfo';

// {"status":"success","canClaim":false,"gasInfo":{...}}
export interface CanClaimRefund {
    status: Status;
    error: string;
    canClaim: boolean;
    gasInfo: GasInfo;
}
