import React from "react";
import { Typography, Box } from "@mui/material";
import { RocketpoolData } from "../../types/RocketpoolData";
import { toEther } from "../../utils/Utils";

interface RequiredBalanceInfoProps {
  minipoolEth: 8 | 16;
  data?: RocketpoolData;
}

const RequiredBalanceInfo: React.FC<RequiredBalanceInfoProps> = ({
  data,
  minipoolEth,
}): JSX.Element => {
  const minRpl =
    minipoolEth === 8
      ? data?.networkRplPrice?.minPer8EthMinipoolRplStake ?? 0
      : data?.networkRplPrice?.minPer16EthMinipoolRplStake ?? 0;

  const maxRpl = data?.nodeStatus?.maximumRplStake ?? 0;

  return (
    <Box>
      <Typography variant="body1">
        1. At least <b>{minipoolEth} ETH + 0.2 ETH</b> (we recommend{" "}
        <b>0.5 ETH</b>) for gas costs
        <br />
        {maxRpl === 0 ? (
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
