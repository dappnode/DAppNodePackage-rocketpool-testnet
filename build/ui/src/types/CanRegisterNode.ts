import { Status } from './Status';

export interface CanRegisterNode {
    status: Status;
    error: string;
    canRegister: boolean;
    alreadyRegistered: boolean;
    registrationDisabled: boolean;
    gasInfo: GasInfo;
}

export interface GasInfo {
    estGasLimit: number;
    safeGasLimit: number;
}