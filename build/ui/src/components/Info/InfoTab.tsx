import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { RocketpoolContext } from "../Providers/Context";

interface InfoTabProps {}

const InfoTab: React.FC<InfoTabProps> = ({}): JSX.Element => {
  const { rocketpoolValue } = React.useContext(RocketpoolContext);
  useEffect(() => {
    // This code will run when the component mounts
    // You can use it to fetch data or set up any other initial state
  }, []);

  return (
    <Box>
      <Typography variant="h5">Info</Typography>
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        <b>Network:</b> {rocketpoolValue?.network}
        <br />
        <b>Execution client synced:</b> {rocketpoolValue?.nodeSync?.ecStatus.primaryEcStatus.isSynced + ''} ({rocketpoolValue?.nodeSync?.ecStatus.primaryEcStatus.syncProgress})
        <br />
        <b>Beacon chain client synced:</b> {rocketpoolValue?.nodeSync?.bcStatus.primaryEcStatus.isSynced + ''} ({rocketpoolValue?.nodeSync?.bcStatus.primaryEcStatus.syncProgress})
        <br />
        <b>Node:</b> <a href={`https://prater.rocketscan.io/node/${rocketpoolValue?.nodeStatus?.accountAddress}`} target="_blank" rel="noreferrer">{rocketpoolValue?.nodeStatus?.accountAddress}</a>
        <br />
        <b>Node timezone:</b> {rocketpoolValue?.nodeStatus?.timezoneLocation}
        <br />
        <b>Smoothing pool active:</b> {rocketpoolValue?.nodeStatus?.feeRecipientInfo.isInSmoothingPool + ''}
        <br />
        <b>Smoothing pool address:</b> {rocketpoolValue?.nodeStatus?.feeRecipientInfo.smoothingPoolAddress}
        <br />
        <b>Withdrawal address:</b> {rocketpoolValue?.nodeStatus?.withdrawalAddress}
        <br />
        <b>Fee distributor initialized:</b> {rocketpoolValue?.nodeStatus?.isFeeDistributorInitialized + ''}
        <br />
        <b>Minipools:</b> {rocketpoolValue?.nodeStatus?.minipoolCounts?.total}
      </Typography>
    </Box>
  );
}

export default InfoTab;
