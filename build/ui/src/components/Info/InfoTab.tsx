import React from "react";
import { Typography, Box, Card, Chip } from "@mui/material";
import { RocketpoolContext } from "../Providers/Context";
import "./infoTab.css";
import EthClients from "./EthClients";

interface InfoTabProps {}

const InfoTab: React.FC<InfoTabProps> = (): JSX.Element => {
  const { rocketpoolValue } = React.useContext(RocketpoolContext);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Node Info
      </Typography>

      <Card className="network-card" sx={{ borderRadius: 2 }}>
        <div className="center-elements">
          <Chip
            label={rocketpoolValue?.network?.toUpperCase()}
            sx={{ fontWeight: "bold" }}
          />
          <EthClients />
        </div>
      </Card>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
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
