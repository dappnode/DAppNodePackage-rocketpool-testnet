import { Status } from './Status';

// Split of megapool rewards between recipients (wei strings / numbers).
export interface RewardSplit {
    NodeRewards: number | null;
    VoterRewards: number | null;
    ProtocolDAORewards: number | null;
    RethRewards: number | null;
}

// {"status":"success","rewardSplit":{...},"refundValue":null}
export interface MegapoolRewards {
    status: Status;
    error: string;
    rewardSplit: RewardSplit;
    refundValue: number | null;
}
