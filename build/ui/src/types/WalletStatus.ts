import { Status } from './Status';

export interface WalletStatus {
  status: Status;
  error: string;
  passwordSet: boolean;
  walletInitialized: boolean;
  accountAddress: string;
}
