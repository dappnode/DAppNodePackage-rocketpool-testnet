import { Status } from './Status';

export interface NodeStatus {
  status: Status;
  error: string;
  accountAddress: string;
  accountAddressFormatted: string;
  withdrawalAddress: string;
  withdrawalAddressFormatted: string;
  pendingWithdrawalAddress: string;
  pendingWithdrawalAddressFormatted: string;
  registered: boolean;
  trusted: boolean;
  timezoneLocation: string;
  accountBalances: Balances;
  withdrawalBalances: Balances;
  rplStake: number;
  effectiveRplStake: number;
  minimumRplStake: number;
  maximumRplStake: number;
  collateralRatio: number;
  votingDelegate: string;
  votingDelegateFormatted: string;
  isAtlasDeployed: boolean;
  minipoolLimit: number;
  minipoolCounts: MinipoolCounts;
  isFeeDistributorInitialized: boolean;
  feeRecipientInfo: FeeRecipientInfo;
  feeDistributorBalance: number;
  penalizedMinipools: PenalizedMinipools;
  snapshotResponse: SnapshotResponse;
}

export interface Balances {
  eth: number;
  reth: number;
  rpl: number;
  fixedSupplyRpl: number;
}

export interface FeeRecipientInfo {
  smoothingPoolAddress: string;
  feeDistributorAddress: string;
  isInSmoothingPool: boolean;
  isInOptOutCooldown: boolean;
  optOutEpoch: number;
}

export interface MinipoolCounts {
  total: number;
  initialized: number;
  prelaunch: number;
  staking: number;
  withdrawable: number;
  dissolved: number;
  refundAvailable: number;
  withdrawalAvailable: number;
  closeAvailable: number;
  finalised: number;
}

export interface PenalizedMinipools {}

export interface SnapshotResponse {
  error: string;
  proposalVotes: any[];
  activeSnapshotProposals: any[];
}
