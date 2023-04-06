// {"status":"success","error":"","txHash":"0x3f2449a72ca8965b0b5829ade64aee8de6de2b074a7b2225812c62c5651ed894","minipoolAddress":"0x7c9c4dcac8c9ad6f689f55d8492bef1a4167bd5c","validatorPubkey":"916c5692fa4ac505ff57dfc0b0181d94fc88489d1f1fa9f36e8ce6399f0cab25215c4060ca632e7524a24e9f4d3de0f8","scrubPeriod":3600000000000}

import { Status } from './Status';

export interface DepositResponse {
    status: Status;
    error: string;
    txHash: string;
    minipoolAddress: string;
    validatorPubkey: string;
    scrubPeriod: number;
}