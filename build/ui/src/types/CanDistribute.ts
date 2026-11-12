import { Status } from './Status';
import { GasInfo } from './GasInfo';

// {"status":"success","megapoolAddress":"0x..","megapoolNotDeployed":false,
//  "lastDistributionTime":0,"lockedValidatorCount":0,"exitingValidatorCount":0,
//  "canDistribute":true,"gasInfo":{...}}
export interface CanDistribute {
    status: Status;
    error: string;
    megapoolAddress: string;
    megapoolNotDeployed: boolean;
    lastDistributionTime: number;
    lockedValidatorCount: number;
    exitingValidatorCount: number;
    canDistribute: boolean;
    gasInfo: GasInfo;
}
