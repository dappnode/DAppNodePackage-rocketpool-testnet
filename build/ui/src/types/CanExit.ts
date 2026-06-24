import { Status } from './Status';
import { GasInfo } from './GasInfo';

// Shared shape for megapool exit preflights:
// can-exit-queue, can-exit-validator, can-notify-validator-exit
export interface CanExit {
    status: Status;
    error: string;
    canExit: boolean;
    invalidStatus?: boolean;
    gasInfo: GasInfo;
}
