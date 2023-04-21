import React, { useState, useEffect } from "react";
import { Typography, Box, Card, CardContent, CardHeader } from "@mui/material";
import { RocketpoolContext } from "../Providers/Context";
import "./infoTab.css";
import { WaitResponse } from "../../types/WaitResponse";
import { AppService } from "../../services/AppService";

interface InfoTabProps {}

const InfoTab: React.FC<InfoTabProps> = (): JSX.Element => {
  const { rocketpoolValue } = React.useContext(RocketpoolContext);
  const [w3sStatusResponse, setW3sStatusResponse] = useState<WaitResponse>();
  const appService = new AppService();

  async function fetchData() {
    const w3sStatus = await appService.getW3sStatus();
    setW3sStatusResponse(w3sStatus);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Node Info
      </Typography>

      <Card className="network-card">
        <CardHeader title="Network" className="title" />
        <CardContent>{/* Your content goes here */}</CardContent>
      </Card>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        <b>Network:</b> {rocketpoolValue?.network}
        <br />
        <b>Execution client synced:</b>{" "}
        {rocketpoolValue?.nodeSync?.ecStatus.primaryEcStatus.isSynced + ""} (
        {rocketpoolValue?.nodeSync?.ecStatus.primaryEcStatus.syncProgress})
        <br />
        <b>Beacon chain client synced:</b>{" "}
        {rocketpoolValue?.nodeSync?.bcStatus.primaryEcStatus.isSynced + ""} (
        {rocketpoolValue?.nodeSync?.bcStatus.primaryEcStatus.syncProgress})
        <br />
        <b>Signer status:</b>{" "}
        {w3sStatusResponse?.status === "success" ? "OK" : w3sStatusResponse?.error || ""}
        <br />
        <b>Node:</b>{" "}
        <a
          href={`${rocketpoolValue?.config?.rpExplorerUrl}/node/${rocketpoolValue?.nodeStatus?.accountAddress}`}
          target="_blank"
          rel="noreferrer"
        >
          {rocketpoolValue?.nodeStatus?.accountAddress}
        </a>
        <br />
        <b>Node timezone:</b> {rocketpoolValue?.nodeStatus?.timezoneLocation}
        <br />
        <b>Smoothing pool active:</b>{" "}
        {rocketpoolValue?.nodeStatus?.feeRecipientInfo.isInSmoothingPool + ""}
        <br />
        <b>Smoothing pool address:</b>{" "}
        {rocketpoolValue?.nodeStatus?.feeRecipientInfo.smoothingPoolAddress}
        <br />
        <b>Withdrawal address:</b>{" "}
        {rocketpoolValue?.nodeStatus?.withdrawalAddress}
        <br />
        <b>Fee distributor initialized:</b>{" "}
        {rocketpoolValue?.nodeStatus?.isFeeDistributorInitialized + ""}
        <br />
        <b>Minipools:</b> {rocketpoolValue?.nodeStatus?.minipoolCounts?.total}
      </Typography>
    </Box>
  );
};

export default InfoTab;
