import React from "react";
import { Typography, Box } from "@mui/material";
import { RocketpoolData } from "../../types/RocketpoolData";
import { toEther, toEtherString } from "../../utils/Utils";

interface RequiredBalanceInfoProps {
  data?: RocketpoolData;
}

const RequiredBalanceInfo: React.FC<RequiredBalanceInfoProps> = ({
    data,
}): JSX.Element => {
    const minimumRpl8Eth = data?.networkRplPrice?.minPer8EthMinipoolRplStake ?? 0;
    const minimumRpl16Eth = data?.networkRplPrice?.minPer16EthMinipoolRplStake ?? 0;
    const maximumRpl8Eth = data?.networkRplPrice?.maxPer8EthMinipoolRplStake ?? 0;
    const maximumRpl16Eth = data?.networkRplPrice?.maxPer16EthMinipoolRplStake ?? 0;

    return (
        <Box>
            <Typography variant="body1">
                You need at least 8/16 ETH + 0.2 ETH (we recommend 0.5 ETH) to save for gas costs and RPL tokens at the current price 1 RPL = {toEtherString(data?.networkRplPrice?.rplPrice ?? 0)} ETH:
            </Typography>
            <Typography variant="subtitle1" color={!data?.nodeStatus?.isAtlasDeployed ? "red" : ""}>
                <strong>8 ETH minipool:</strong> min {Math.ceil(toEther(minimumRpl8Eth))} RPL - max {Math.ceil(toEther(maximumRpl8Eth))} RPL
                {!data?.nodeStatus?.isAtlasDeployed && " (Atlas not deployed)"}
            </Typography>
            <Typography variant="subtitle1">
                <strong>16 ETH minipool:</strong> min {Math.ceil(toEther(minimumRpl16Eth))} RPL - max {Math.ceil(toEther(maximumRpl16Eth))} RPL
            </Typography>
        </Box>
    );
};

export default RequiredBalanceInfo;
