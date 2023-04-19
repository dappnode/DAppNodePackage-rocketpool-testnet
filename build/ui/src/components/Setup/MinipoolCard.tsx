import React from "react";
import { Card, CardContent, Typography, Chip, Button } from "@mui/material";
import { Minipool } from "../../types/MinipoolStatus";
import { minipoolUrl, toEtherString } from "../../utils/Utils";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import "./minipool.css";

function MinipoolCard({ data }: { data: Minipool }): JSX.Element {
  const backgroundColor =
    data.status.status === "Staking"
      ? "#81C784"
      : data.status.status === "Dissolved"
      ? "#E57373"
      : "#FFB74D";

  return (
    <Card
      sx={{
        maxWidth: 275,
        margin: 1,
        boxShadow: 4,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <div className="chip-container">
          <Chip label={`#${data.validator.index}`} />
          <Chip
            label={data.status.status}
            sx={{ backgroundColor: { backgroundColor } }}
          />
        </div>

        <Typography color="text.secondary" className="minipool-ether">
          {toEtherString(
            data.validator.nodeBalance ?? data.node.depositBalance
          )}{" "}
          ETH
        </Typography>

        <Typography variant="body2">
          Type: {data.depositType}
          <br />
          Commission Fee: {(data.node.fee * 100).toFixed(1)} %
        </Typography>

        <div className="explorer-button-container">
          <Button
            href={minipoolUrl(data.address)}
            variant="outlined"
            color="primary"
            target="_blank"
            rel="noopener"
            endIcon={<OpenInNewIcon />}
            className="explorer-button"
          >
            View on RocketScan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MinipoolCard;
