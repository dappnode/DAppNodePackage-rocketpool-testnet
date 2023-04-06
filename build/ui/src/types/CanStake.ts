// {"status":"success","error":"","canStake":true,"insufficientBalance":false,"isAtlasDeployed":true,"inConsensus":false,"gasInfo":{"estGasLimit":156214,"safeGasLimit":234321}}

import { Status } from './Status';
import { GasInfo } from './GasInfo';

export interface CanStake {
    status: Status;
    error: string;
    canStake: boolean;
    insufficientBalance: boolean;
    isAtlasDeployed: boolean;
    inConsensus: boolean;
    gasInfo: GasInfo;
}