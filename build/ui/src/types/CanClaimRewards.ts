// {"status":"success","error":"","gasInfo":{"estGasLimit":150263,"safeGasLimit":225394}}

import { GasInfo } from './GasInfo';
import { Status } from './Status';

export interface CanClaimRewards {
    status: Status;
    error: string;
    gasInfo: GasInfo;
}