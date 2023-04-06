import { GasInfo } from './GasInfo';
import { Status } from './Status';

export interface NodeCanSetSmoothingPool {
    status: Status;
    error: string;
    gasInfo: GasInfo;
}