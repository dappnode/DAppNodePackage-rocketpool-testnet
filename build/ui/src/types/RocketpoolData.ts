import { Network } from './Network';
import { WalletStatus } from './WalletStatus';
import { NodeStatus } from './NodeStatus';
import { NodeSync } from './NodeSync';
import { NetworkRplPrice } from './NetworkRplPrice';
import { Config } from './AppConfig';

export class RocketpoolData {
    network?: Network;
    walletStatus?: WalletStatus;
    nodeStatus?: NodeStatus;
    nodeSync?: NodeSync;
    networkRplPrice?: NetworkRplPrice;
    config?: Config;

    constructor(
        network?: Network, 
        walletStatus?: WalletStatus, 
        nodeStatus?: NodeStatus, 
        nodeSync?: NodeSync, 
        networkRplPrice?: NetworkRplPrice,
        config?: Config
    ) {
        this.network = network;
        this.walletStatus = walletStatus;
        this.nodeStatus = nodeStatus;
        this.nodeSync = nodeSync;
        this.networkRplPrice = networkRplPrice;
        this.config = config
    }
}