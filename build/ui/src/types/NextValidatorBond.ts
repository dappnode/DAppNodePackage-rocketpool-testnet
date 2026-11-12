import { Status } from './Status';

export interface NextValidatorBond {
  status: Status;
  error: string;
  bondRequirement: string;
  activeValidatorCount: number;
  nodeBond: string;
  nodeQueuedBond: string;
  megapoolDeployed: boolean;
}
