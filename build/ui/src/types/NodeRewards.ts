// {"status":"success","error":"","nodeRegistrationTime":"2023-04-06T00:36:48Z","rewardsInterval":259200000000000,"lastCheckpoint":"2023-04-05T01:26:36Z","trusted":false,"registered":true,"effectiveRplStake":0,"totalRplStake":96,"trustedRplBond":0,"estimatedRewards":0,"cumulativeRplRewards":0,"cumulativeEthRewards":0,"estimatedTrustedRplRewards":0,"cumulativeTrustedRplRewards":0,"unclaimedRplRewards":0,"unclaimedEthRewards":0,"unclaimedTrustedRplRewards":0,"beaconRewards":0,"txHash":"0x0000000000000000000000000000000000000000000000000000000000000000"}

import { Status } from './Status';

export interface NodeRewards {
    status: Status;
    error: string;
    nodeRegistrationTime: string;
    rewardsInterval: number;
    lastCheckpoint: string;
    trusted: boolean;
    registered: boolean;
    effectiveRplStake: number;
    totalRplStake: number;
    trustedRplBond: number;
    estimatedRewards: number;
    cumulativeRplRewards: number;
    cumulativeEthRewards: number;
    estimatedTrustedRplRewards: number;
    cumulativeTrustedRplRewards: number;
    unclaimedRplRewards: number;
    unclaimedEthRewards: number;
    unclaimedTrustedRplRewards: number;
    beaconRewards: number;
    txHash: string;
}