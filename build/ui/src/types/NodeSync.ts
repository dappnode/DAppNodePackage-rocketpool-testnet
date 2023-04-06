import { Status } from './Status';

export interface NodeSync {
    status: Status;
    error: string;
    ecStatus: {
        primaryEcStatus: {
            isWorking: boolean;
            isSynced: boolean;
            syncProgress: number;
            networkId: number;
            error: string;
        };
        fallbackEnabled: boolean;
        fallbackEcStatus: {
            isWorking: boolean;
            isSynced: boolean;
            syncProgress: number;
            networkId: number;
            error: string;
        };
    };
    bcStatus: {
        primaryEcStatus: {
            isWorking: boolean;
            isSynced: boolean;
            syncProgress: number;
            networkId: number;
            error: string;
        };
        fallbackEnabled: boolean;
        fallbackEcStatus: {
            isWorking: boolean;
            isSynced: boolean;
            syncProgress: number;
            networkId: number;
            error: string;
        };
    };
}