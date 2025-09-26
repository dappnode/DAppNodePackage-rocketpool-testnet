import axios from "axios";
import { WalletStatus } from "../types/WalletStatus";
import { NodeStatus } from "../types/NodeStatus";
import { CanRegisterNode } from "../types/CanRegisterNode";
import { NodeSync } from "../types/NodeSync";
import { NetworkRplPrice } from "../types/NetworkRplPrice";
import { MinipoolStatus } from "../types/MinipoolStatus";
import { NodeCanRegister } from "../types/NodeCanRegister";
import { TxResponse } from "../types/TxResponse";
import { WaitResponse } from "../types/WaitResponse";
import { NodeCanSetWithdrawalAddress } from "../types/NodeCanSetWithdrawalAddress";
import { NodeCanSetSmoothingPool } from "../types/NodeCanSetSmoothingPool";
import { CanDeposit } from "../types/CanDeposit";
import { toWei, toWeiString } from "../utils/Utils";
import { NodeFee } from "../types/NodeFee";
import { StakeRplApprove } from "../types/StakeRplApprove";
import { CanStake } from "../types/CanStake";
import { StakeResponse } from "../types/StakeResponse";
import { DepositResponse } from "../types/DepositResponse";
import { NodeRewards } from "../types/NodeRewards";
import { GetRewardsInfo } from "../types/GetRewardsInfo";
import { CanClaimRewards } from "../types/CanClaimRewards";
import apiBaseUrl, { Config } from "../types/AppConfig";
import { ImportKeyResponseData } from "../types/ImportKeyResponse";

export class AppService {
  public api = axios.create({
    baseURL: apiBaseUrl,
    // baseURL: "http://localhost:3000",
    timeout: 600000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  public async getVersion(): Promise<string> {
    const response = await this.api.get("/api/v1/version");
    return response.data;
  }
  public async getEnvironment(key: string): Promise<string> {
    const response = await this.api.get(`/api/v1/environment/${key}`);
    return response.data.value;
  }
  public async runCustomCommand(cmd: string): Promise<string> {
    const response = await this.api.post(`/api/v1/rocketpool-command-custom`, {
      cmd: cmd,
    });
    return JSON.stringify(response.data);
  }
  public async wait(txHash: string): Promise<WaitResponse> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `wait ${txHash}`,
    });
    return response.data;
  }
  public async getWalletStatus(): Promise<WalletStatus> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: "wallet status",
    });
    return response.data;
  }
  public async getNodeStatus(): Promise<NodeStatus> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: "node status",
    });
    return response.data;
  }
  public async walletInit(): Promise<string> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `wallet init`,
    });
    return response.data.mnemonic;
  }
  public async walletRecover(mnemonic: string): Promise<string> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `wallet recover "${mnemonic}"`,
    });
    return response.data.accountAddress;
  }
  public async canRegisterNode(): Promise<CanRegisterNode> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node can-register Etc/UTC`,
    });
    return response.data;
  }
  public async getNodeSync(): Promise<NodeSync> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node sync`,
    });
    return response.data;
  }
  public async getNetworkNodeFee(): Promise<NodeFee> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `network node-fee`,
    });
    return response.data;
  }
  public async getNetworkRplPrice(): Promise<NetworkRplPrice> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `network rpl-price`,
    });
    return response.data;
  }
  public async getNodeCanRegister(): Promise<NodeCanRegister> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node can-register Etc/UTC`,
    });
    return response.data.canRegister;
  }
  public async nodeRegister(): Promise<TxResponse> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node register Etc/UTC`,
    });
    return response.data;
  }
  public async getNodeCanSetWithdrawalAddress(address: string): Promise<NodeCanSetWithdrawalAddress> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node can-set-withdrawal-address ${address} yes`,
    });
    return response.data;
  }
  public async nodeSetWithdrawalAddress(address: string): Promise<TxResponse> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node set-withdrawal-address ${address} yes`,
    });
    return response.data;
  }
  public async getNodeCanSetSmoothingPoolStatus(): Promise<NodeCanSetSmoothingPool> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node can-set-smoothing-pool-status true`,
    });
    return response.data;
  }
  public async nodeSetSmoothingPoolStatus(): Promise<TxResponse> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node set-smoothing-pool-status true`,
    });
    return response.data;
  }
  public async getNodeStakeRplAllowance(): Promise<number> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node stake-rpl-allowance`,
    });
    return response.data.allowance;
  }
  public async getNodeMinipoolStatus(): Promise<MinipoolStatus> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `minipool status`,
    });
    return response.data;
  }
  public async stakeRplApprove(amount: number): Promise<StakeRplApprove> {
    const amountWei = toWeiString(amount);
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node stake-rpl-approve-rpl ${amountWei}`,
    });
    return response.data;
  }
  public async getNodeCanStakeRpl(amount: number): Promise<CanStake> {
    const amountWei = toWeiString(amount);
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node can-stake-rpl ${amountWei}`,
    });
    return response.data;
  }
  public async nodeStakeRpl(amount: number): Promise<StakeResponse> {
    const amountWei = toWeiString(amount);
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node stake-rpl ${amountWei}`,
    });
    return response.data;
  }
  public async canDeposit(ethPool: number, nodeFee: number): Promise<CanDeposit> {
    const amount = toWei(ethPool);
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node can-deposit ${amount} ${nodeFee} 0`,
    });
    return response.data;
  }
  public async nodeDeposit(ethPool: number, nodeFee: number, useCreditBalance: boolean): Promise<DepositResponse> {
    const amount = toWei(ethPool);
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node deposit ${amount} ${nodeFee} 0 ${useCreditBalance} true`,
    });
    return response.data;
  }
  public async getNodeRewards(): Promise<NodeRewards> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node rewards`,
    });
    return response.data;
  }
  public async getRewardsInfo(): Promise<GetRewardsInfo> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node get-rewards-info`,
    });
    return response.data;
  }
  public async getNodeCanClaimRewards(indexes: string): Promise<CanClaimRewards> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node can-claim-rewards ${indexes}`,
    });
    return response.data;
  }
  public async getNodeCanClaimAndRestakeRewards(indexes: string, amount: string): Promise<CanClaimRewards> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node can-claim-and-stake-rewards ${indexes} ${amount}`,
    });
    return response.data;
  }
  public async nodeClaimRewards(indexes: string): Promise<TxResponse> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node claim-rewards ${indexes}`,
    });
    return response.data;
  }
  public async nodeClaimAndRestakeRewards(indexes: string, amount: string): Promise<TxResponse> {
    const response = await this.api.post(`/api/v1/rocketpool-command`, {
      cmd: `node claim-and-stake-rewards ${indexes} ${amount}`,
    });
    return response.data;
  }
  public async getW3sStatus(): Promise<WaitResponse> {
    const response = await this.api.get(`/api/v1/w3s-status`);
    return response.data;
  }
  public async getConfig(): Promise<Config> {
    const response = await this.api.get(`/api/v1/config`);
    return response.data;
  }
  public async importKey(pubkey: string): Promise<ImportKeyResponseData> {
    const response = await this.api.post(`/api/v1/minipool/import`, {
      pubkey: `0x${pubkey}`,
    });
    return response;
  }
}
