import React from "react";
import { Typography, Box } from "@mui/material";
import { RocketpoolData } from "../../types/RocketpoolData";
import { toEther } from "../../utils/Utils";
import { ValidatorDepositMode } from "./MinipoolEthToggle";

interface RequiredBalanceInfoProps {
  depositMode: ValidatorDepositMode;
  requiredBondWei?: string;
  data?: RocketpoolData;
}

const RequiredBalanceInfo: React.FC<RequiredBalanceInfoProps> = ({
  data,
  depositMode,
  requiredBondWei,
}): JSX.Element => {
  const isMegapool = depositMode === "megapool";
  const minipoolEth = depositMode === "16" ? 16 : 8;
  const requiredEth = isMegapool ? toEther(requiredBondWei ?? "4000000000000000000") : minipoolEth;
  const minRpl = isMegapool
    ? data?.nodeStatus?.minimumRplStake ?? 0
    : minipoolEth === 8
      ? data?.networkRplPrice?.minPer8EthMinipoolRplStake ?? 0
      : data?.networkRplPrice?.minPer16EthMinipoolRplStake ?? 0;

  const maxRpl = data?.nodeStatus?.maximumRplStake ?? 0;

  return (
    <Box>
      <Typography variant="body1">
        1. At least <b>{requiredEth.toFixed(2)} ETH + 0.2 ETH</b> (we recommend{" "}
        <b>0.5 ETH</b>) for gas costs
        <br />
        {isMegapool ? (
          <>
            2. Enough RPL collateral for the node's current megapool bond requirement
          </>
        ) : maxRpl === 0 ? (
          <>
            2. At least <b>{Math.ceil(toEther(minRpl))} RPL</b> for {minipoolEth} ETH minipool
          </>
        ) : (
          <>
            2. Between <b>{Math.ceil(toEther(minRpl))} RPL</b> and{" "}
            <b>{Math.ceil(toEther(maxRpl))} RPL</b> for {minipoolEth} ETH minipool
          </>
        )}
      </Typography>
    </Box>
  );
};

export default RequiredBalanceInfo;
