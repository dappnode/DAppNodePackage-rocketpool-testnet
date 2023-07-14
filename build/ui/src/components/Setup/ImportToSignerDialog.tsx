import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  Button,
  CircularProgress,
  Alert,
  DialogContentText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { SlideTransition } from "../Transitions/Transitions";
import { shortenAddress } from "../../utils/Utils";

enum ValidatorImportStatus {
  Imported,
  Error,
  NotImported,
  Importing,
  Duplicate,
}

export default function ImportToSignerDialog({
  openDialog,
  setOpenDialog,
  pubkey,
}: {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  pubkey: string;
}): JSX.Element {
  const [validatorImportStatus, setValidatorImportStatus] =
    useState<ValidatorImportStatus>(ValidatorImportStatus.NotImported);

  const [importError, setImportError] = useState<string>("");

  const [userConfirmText, setUserConfirmText] = useState("");

  const importConfirmationMessage = "I want to import";

  const importKeystoreToSigner = async () => {
    setValidatorImportStatus(ValidatorImportStatus.Importing);

    try {
      // TODO: Import to signer
      setValidatorImportStatus(ValidatorImportStatus.Imported);
    } catch (error) {
      setValidatorImportStatus(ValidatorImportStatus.Error);
      const errorMsg = (error as Error).message;
      setImportError(errorMsg);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setValidatorImportStatus(ValidatorImportStatus.NotImported);
    setImportError("");
    setUserConfirmText("");
  };

  return (
    <Dialog
      disableEscapeKeyDown={true}
      open={openDialog}
      fullWidth={true}
      onClose={(event, reason) => {
        if (!reason) {
          handleClose();
        }
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={SlideTransition}
    >
      <DialogTitle id="alert-dialog-title">
        {validatorImportStatus === ValidatorImportStatus.Imported
          ? "Success!"
          : validatorImportStatus === ValidatorImportStatus.Error
          ? "Error!"
          : validatorImportStatus === ValidatorImportStatus.Importing
          ? "Loading..."
          : "Import to Signer"}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          {validatorImportStatus === ValidatorImportStatus.Imported ? (
            <Alert severity="success" className="minipool-alert">
              Successfully imported validator 0x{shortenAddress(pubkey)} to
              Web3Signer
            </Alert>
          ) : validatorImportStatus === ValidatorImportStatus.Error ? (
            <Alert severity="error" className="minipool-alert">
              Found error while importing validator 0x
              {shortenAddress(pubkey)} to Web3Signer: {importError}
            </Alert>
          ) : validatorImportStatus === ValidatorImportStatus.Importing ? (
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress size="1.5rem" sx={{ marginTop: "1rem" }} />
            </Box>
          ) : (
            <>
              <DialogContentText
                id="alert-dialog-description"
                component={"span"}
              >
                <>
                  Are you sure you want to import validator 0x
                  {shortenAddress(pubkey)} to signer?
                  <Alert severity="warning">
                    You must be sure that this keystore is not uploaded to any
                    other validator machine, as it can cause slashing.
                  </Alert>
                </>
              </DialogContentText>

              <TextField
                id="outlined-basic"
                label='Type "I want to import" to confirm'
                variant="outlined"
                value={userConfirmText}
                onChange={(e) => setUserConfirmText(e.target.value)}
                sx={{ width: "100%", marginTop: "1rem" }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {validatorImportStatus === ValidatorImportStatus.NotImported && (
          <Button
            onClick={() => importKeystoreToSigner()}
            variant="contained"
            color="primary"
            sx={{ marginRight: 1, borderRadius: 2 }}
            disabled={userConfirmText !== importConfirmationMessage}
          >
            Import
          </Button>
        )}
        <Button
          onClick={() => handleClose()}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
