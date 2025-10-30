import React from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, Card, CardContent, Chip, Tooltip, Typography } from "@mui/material";
import CopyToClipboardButton from "../Buttons/CopyToClipboardButton";
import { Minipool } from "../../types/MinipoolStatus";
import { ethBalanceGreaterThanMinStake, shortenAddress, toEtherString } from "../../utils/Utils";
import ImportToSignerDialog from "./ImportToSignerDialog";
import "./minipool.css";

enum MinipoolStatus {
  STAKING = "Staking",
  DISSOLVED = "Dissolved",
  PRELAUNCH = "Prelaunch",
  FINALISED = "Finalised"
}

enum ValidatorStatus {
  EXITED = "Exited",
  ENQUEUED = "Enqueued",
  ACTIVE = "Active",
  READY_TO_CLOSE = "Ready to Close",
  INACTIVE = "Inactive"
}

// Color theme constants
const COLOR_THEME = {
  SUCCESS: "#81C784",    // Green
  WARNING: "#FFC107",    // Amber
  ERROR: "#E57373",      // Red
  INFO: "#FFB74D"        // Orange
} as const;

// Status information interface
interface StatusInfo {
  status: string;
  color: string;
}

// Validator Status Service
class ValidatorStatusService {
  /**
   * Determines the minipool status and returns status info
   */
  getMinipoolStatusInfo(minipoolData: Minipool): StatusInfo {
    const status = this.determineMinipoolStatus(minipoolData);
    const color = this.getMinipoolStatusColor(status);
    return { status, color };
  }

  /**
   * Determines the validator status and returns status info
   */
  getValidatorStatusInfo(minipoolData: Minipool): StatusInfo {
    const status = this.determineValidatorStatus(minipoolData);
    const color = this.getValidatorStatusColor(status, minipoolData);
    return { status, color };
  }

  /**
   * Determines the minipool status based on finalised state
   */
  private determineMinipoolStatus(minipoolData: Minipool): string {
    return minipoolData.finalised ? MinipoolStatus.FINALISED : minipoolData.status.status;
  }

  /**
   * Determines the validator status with priority-based logic
   */
  private determineValidatorStatus(minipoolData: Minipool): string {
    // Priority 1: Check if finalised
    if (minipoolData.finalised) {
      return ValidatorStatus.EXITED;
    }

    // Priority 2: Check if enqueued (staking but no validator index)
    if (minipoolData.status.status === MinipoolStatus.STAKING && !minipoolData.validator.index) {
      return ValidatorStatus.ENQUEUED;
    }

    // Priority 3: Check if validator is active
    if (minipoolData.validator.active) {
      return ValidatorStatus.ACTIVE;
    }

    // Priority 4: Check if ready to close (staking with sufficient balance)
    if (minipoolData.status.status === MinipoolStatus.STAKING && 
        ethBalanceGreaterThanMinStake(minipoolData.balances.eth)) {
      return ValidatorStatus.READY_TO_CLOSE;
    }

    // Default: Inactive
    return ValidatorStatus.INACTIVE;
  }

  /**
   * Gets the color for minipool status
   */
  private getMinipoolStatusColor(status: string): string {
    switch (status) {
      case MinipoolStatus.STAKING:
        return COLOR_THEME.SUCCESS;
      case MinipoolStatus.DISSOLVED:
        return COLOR_THEME.ERROR;
      case MinipoolStatus.FINALISED:
        return COLOR_THEME.WARNING;
      default:
        return COLOR_THEME.INFO;
    }
  }

  /**
   * Gets the color for validator status
   */
  private getValidatorStatusColor(validatorStatus: string, minipoolData: Minipool): string {
    // Success color for finalised or active validators
    if (minipoolData.finalised || minipoolData.validator.active) {
      return COLOR_THEME.SUCCESS;
    }

    // Warning color for prelaunch, enqueued, or ready to close
    if (minipoolData.status.status === MinipoolStatus.PRELAUNCH || 
        [ValidatorStatus.ENQUEUED, ValidatorStatus.READY_TO_CLOSE].includes(validatorStatus as ValidatorStatus)) {
      return COLOR_THEME.WARNING;
    }

    // Error color for inactive
    return COLOR_THEME.ERROR;
  }
};

// Initialize status service
const statusService = new ValidatorStatusService();

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
  
  // Get status information using the service
  const minipoolStatusInfo = statusService.getMinipoolStatusInfo(data);
  const validatorStatusInfo = statusService.getValidatorStatusInfo(data);

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
            label={minipoolStatusInfo.status}
            sx={{ backgroundColor: minipoolStatusInfo.color }}
          />
        </div>
        <div className="validator-status">
          <Chip
            label={validatorStatusInfo.status}
            sx={{ backgroundColor: validatorStatusInfo.color }}
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
