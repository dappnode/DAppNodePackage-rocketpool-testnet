import { Status } from './Status';

export interface MinipoolStatus {
    status: Status;
    error: string;
    minipools: Minipool[];
    latestDelegate: string;
    isAtlasDeployed: boolean;
}

export interface Minipool {
    address: string;
    validatorPubkey: string;
    status: StatusMinipool;
    depositType: string;
    node: MinipoolNode;
    user: MinipoolUser;
    balances: MinipoolBalances;
    nodeShareOfETHBalance: number;
    validator: Validator;
    canStake: boolean;
    canPromote: boolean;
    queue: MinipoolQueue;
    refundAvailable: boolean;
    withdrawalAvailable: boolean;
    closeAvailable: boolean;
    finalised: boolean;
    useLatestDelegate: boolean;
    delegate: string;
    previousDelegate: string;
    effectiveDelegate: string;
    timeUntilDissolve: number;
    penalties: number;
    reduceBondTime: string;
    reduceBondCancelled: boolean;
}

export interface StatusMinipool {
    status: string;
    statusBlock: number;
    statusTime: string;
    isVacant: boolean;
}

export interface MinipoolNode {
    address: string;
    fee: number;
    depositBalance: number;
    refundBalance: number;
    depositAssigned: boolean;
}

export interface MinipoolUser {
    depositBalance: number;
    depositAssigned: boolean;
    depositAssignedTime: string;
}

export interface MinipoolBalances {
    eth: number;
    reth: number;
    rpl: number;
    fixedSupplyRpl: number;
}

export interface Validator {
    exists: boolean;
    active: boolean;
    index: number;
    balance: number;
    nodeBalance: number;
}

export interface MinipoolQueue {
    Position: number;
}