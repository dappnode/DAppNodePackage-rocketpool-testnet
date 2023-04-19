import React from "react";
import { Card, CardContent, Typography, Link } from "@mui/material";
import { Minipool } from "../../types/MinipoolStatus";
import { minipoolUrl, shortenAddress, toEtherString } from "../../utils/Utils";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface MinipoolCardProps {
  data: Minipool;
}

const MinipoolCard: React.FC<MinipoolCardProps> = ({ data }): JSX.Element => {
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
        backgroundColor: { backgroundColor },
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Validator #{data.validator.index}
        </Typography>
        <Link
          href={minipoolUrl(data.address)}
          variant="subtitle1"
          underline="always"
          target="_blank"
          rel="noopener"
        >
          {shortenAddress(data.address)}
          <OpenInNewIcon fontSize="inherit" />
        </Link>
        <Typography variant="h6" component="div">
          {data.status.status}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Type: {data.depositType}
          <br />
          {toEtherString(
            data.validator.nodeBalance ?? data.node.depositBalance
          )}{" "}
          ETH
        </Typography>
        <Typography variant="body2">
          Commission Fee: {(data.node.fee * 100).toFixed(1)} %
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MinipoolCard;
