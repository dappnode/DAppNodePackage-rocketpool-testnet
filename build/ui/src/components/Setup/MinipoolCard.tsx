import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Minipool } from "../../types/MinipoolStatus";
import { toEtherString } from "../../utils/Utils";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import "./minipool.css";

function MinipoolCard({
  data,
  rpExplorerUrl,
  setMinipolToExit,
  hideActions = false,
}: {
  data: Minipool;
  rpExplorerUrl?: string;
  setMinipolToExit?: (minipool: Minipool) => void;
  hideActions?: boolean;
}): JSX.Element {
  const backgroundColor =
    data.status.status === "Staking"
      ? "#81C784"
      : data.status.status === "Dissolved"
      ? "#E57373"
      : "#FFB74D";

  const [importingToSigner, setImportingToSigner] = useState<boolean>(false);
  const [signerImportErrorMsg, setSignerImportErrorMsg] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const reimportKeystoreToSigner = async () => {
    setImportingToSigner(true);

    try {
      // TODO: Import to signer
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // Hide after 5 sec.
    } catch (error) {
      const errorMsg = (error as Error).message;
      setSignerImportErrorMsg(errorMsg);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000); // Hide after 5 sec.
    } finally {
      setImportingToSigner(false);
    }
  };

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
            href={`${rpExplorerUrl}/minipool/${data.address}`}
            variant="outlined"
            color="primary"
            target="_blank"
            rel="noopener"
            endIcon={<OpenInNewIcon />}
            className="minipool-button"
          >
            View on RocketScan
          </Button>
        </div>
        {!hideActions && (
          <>
            {importingToSigner ? (
              <CircularProgress size="1.5rem" sx={{ marginTop: "1rem" }} />
            ) : (
              <div className="button-container">
                {!showSuccess && !showError && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => reimportKeystoreToSigner()}
                    className="minipool-button"
                  >
                    Reimport to Web3Signer
                  </Button>
                )}
                {showSuccess && (
                  <Alert severity="success" className="minipool-alert">
                    Successfully imported to Web3Signer
                  </Alert>
                )}
                {showError && (
                  <Alert severity="error" className="minipool-alert">
                    Failed to import to Web3Signer: {signerImportErrorMsg}
                  </Alert>
                )}
              </div>
            )}
            <div className="button-container">
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setMinipolToExit && setMinipolToExit(data);
                }}
                className="minipool-button"
              >
                Exit Minipool
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default MinipoolCard;
