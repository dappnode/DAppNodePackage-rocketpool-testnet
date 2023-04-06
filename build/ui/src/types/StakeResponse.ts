// {"status":"success","error":"","stakeTxHash":"0xc95c67fb14dc85db7bb5e5f1d2a49ae9248f82218e12002024018976cf7bf6e6"}

import { Status } from './Status';

export interface StakeResponse {
    status: Status;
    error: string;
    stakeTxHash: string;
}