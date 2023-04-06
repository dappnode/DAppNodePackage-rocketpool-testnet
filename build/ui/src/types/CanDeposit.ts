// {"status":"success","error":"","canDeposit":true,"creditBalance":0,"depositBalance":132587721937406541985,"canUseCredit":true,"nodeBalance":8296135826085370015,"insufficientBalance":false,"insufficientBalanceWithoutCredit":false,"insufficientRplStake":false,"invalidAmount":false,"unbondedMinipoolsAtMax":false,"depositDisabled":false,"inConsensus":false,"isAtlasDeployed":true,"minipoolAddress":"0x7c9c4dcac8c9ad6f689f55d8492bef1a4167bd5c","gasInfo":{"estGasLimit":1294239,"safeGasLimit":1941358}}

import { Status } from './Status';
import { GasInfo } from './GasInfo';

export interface CanDeposit {
    status: Status;
    error: string;
    canDeposit: boolean;
    creditBalance: number;
    depositBalance: number;
    canUseCredit: boolean;
    nodeBalance: number;
    insufficientBalance: boolean;
    insufficientBalanceWithoutCredit: boolean;
    insufficientRplStake: boolean;
    invalidAmount: boolean;
    unbondedMinipoolsAtMax: boolean;
    depositDisabled: boolean;
    inConsensus: boolean;
    isAtlasDeployed: boolean;
    minipoolAddress: string;
    gasInfo: GasInfo;
}