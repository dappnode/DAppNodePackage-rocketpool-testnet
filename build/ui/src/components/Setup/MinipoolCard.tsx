import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, Card, CardContent, Chip, Tooltip, Typography } from "@mui/material";
import CopyToClipboardButton from "../Buttons/CopyToClipboardButton";
import { Minipool } from "../../types/MinipoolStatus";
import { ethBalanceGreaterThanMinStake, shortenAddress, toEtherString } from "../../utils/Utils";
import ImportToSignerDialog from "./ImportToSignerDialog";
import "./minipool.css";


function MinipoolCard({
  data,
  beaconchaInUrl,
  // rpExplorerUrl,  
}: {
  data: Minipool;
  rpExplorerUrl?: string;
  beaconchaInUrl?: string;
}): JSX.Element {
  const [importToSignerDialogOpen, setImportToSignerDialogOpen] =
    React.useState<boolean>(false);
  const [showAddress, setShowAddress] = React.useState<boolean>(false);

  const backgroundColor =
    data.status.status === "Staking"
      ? "#81C784"
      : data.status.status === "Dissolved"
      ? "#E57373"
      : "#FFB74D";

  const validatorStatus = data.finalised 
    ? "Exited"
    : (!data.validator.index && data.status.status === "Staking")
    ? "Enqueued"
    : (data.validator.active
      ? "Active"
      : (data.status.status === "Staking" && ethBalanceGreaterThanMinStake(data.balances.eth)
        ? "Ready to Close"
        : "Inactive"
      )
    );
  const validatorStatusColor =
    data.finalised || data.validator.active
      ? "#81C784"
      : (data.status.status === "Prelaunch" || ["Enqueued", "Ready to Close"].includes(validatorStatus))
      ? "#FFC107"
      : "#E57373";

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
          <div className="chip-with-clipboard-container">
            <Tooltip title={showAddress ? "Minipool Address" : "Validator Index"}>
              <Chip 
                label={showAddress ? shortenAddress(data.address) : `#${data.validator.index}`}
                onClick={() => setShowAddress(!showAddress)}
                sx={{ cursor: 'pointer' }}
              />
            </Tooltip>
            <CopyToClipboardButton 
              value={showAddress ? data.address : data.validator.index.toString()}
              fontSize="small"
            />
          </div>
          <Chip
            label={data.finalised ? "Finalised" : data.status.status}
            sx={{ backgroundColor: data.finalised ? "#FFC107" : backgroundColor }}
          />
        </div>
        <div className="validator-status">
          <Chip
            label={validatorStatus}
            sx={{ backgroundColor: validatorStatusColor }}
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
            href={`${beaconchaInUrl}/validator/${data.validatorPubkey}`}
            variant="outlined"
            color="primary"
            target="_blank"
            rel="noopener"
            endIcon={<OpenInNewIcon />}
            className="minipool-button"
          >
            View on Beaconcha.in
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setImportToSignerDialogOpen(true)}
            className="minipool-button"
            sx={{ marginTop: 2 }}
          >
            Import to Web3Signer
          </Button>
        </div>
        <ImportToSignerDialog
          openDialog={importToSignerDialogOpen}
          setOpenDialog={setImportToSignerDialogOpen}
          pubkey={data.validatorPubkey}
        />
      </CardContent>
    </Card>
  );
}

export default MinipoolCard;
