import { GasInfo } from './GasInfo';
import { Status } from './Status';

export interface NodeCanRegister {
    status: Status;
    error: string;
    canRegister: boolean;
    alreadyRegistered: boolean;
    registrationDisabled: boolean;
    gasInfo: GasInfo;
}
