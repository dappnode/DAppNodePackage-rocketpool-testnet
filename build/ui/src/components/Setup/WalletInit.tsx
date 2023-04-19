import React, { useState } from "react";
import { Typography, Button, TextField, CircularProgress } from "@mui/material";
import CopyToClipboardButton from "../Buttons/CopyToClipboardButton";
import PublishIcon from "@mui/icons-material/Publish";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import { RocketpoolContext } from "../Providers/Context";
import "./walletInit.css";

function WalletInit(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecoverEnabled, setIsRecoverEnabled] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState<string>();
  const [mnemonicEntered, setMnemonicEntered] = useState<string>();
  const { rocketpoolValue, updateRocketpoolValue } =
    React.useContext(RocketpoolContext);

  const appService = new AppService();

  const handleWalletInitClick = async () => {
    const seed = await appService.walletInit();
    setMnemonic(seed);
    setIsRecoverEnabled(false);
  };

  const handleWalletRecoverClick = async () => {
    setIsLoading(true);
    await appService.walletRecover(mnemonicEntered ?? "");
    var walletStatus = await appService.getWalletStatus();
    var nodeStatus = await appService.getNodeStatus();
    updateRocketpoolValue(
      new RocketpoolData(
        rocketpoolValue?.network,
        walletStatus,
        nodeStatus,
        rocketpoolValue?.nodeSync,
        rocketpoolValue?.networkRplPrice
      )
    );
    setIsLoading(false);
  };

  const handleIsRecoverEnabled = (enabled: boolean) => {
    setIsRecoverEnabled(enabled);
  };

  function areWalletButtonsShown() {
    return mnemonic === undefined && !isRecoverEnabled;
  }

  function isValidMnemonic(mnemonic: string): boolean {
    return /^\b([a-zA-Z]+\b\s+){23}[a-zA-Z]+\b$/.test(mnemonic);
  }

  return (
    <div>
      <div className="init-title-container">
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
          }}
        >
          Welcome to the Rocket Pool DAppNode Package!
        </Typography>
      </div>

      <div>
        {areWalletButtonsShown() && (
          <>
            <div>
              <Typography variant="h6">
                It looks like it's your first time here. You need to create a
                new wallet or recover an existing one.
              </Typography>
            </div>
            <div className="button-container">
              <Button
                variant="contained"
                onClick={() => handleWalletInitClick()}
                endIcon={<LibraryAddIcon />}
              >
                Create RP Wallet
              </Button>
            </div>
            <div className="button-container">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleIsRecoverEnabled(true)}
                endIcon={<PublishIcon />}
              >
                Recover existing RP wallet
              </Button>
            </div>
          </>
        )}

        {isRecoverEnabled && (
          <>
            <div>
              <Typography variant="h6">
                Recovering an existing wallet
              </Typography>
            </div>
            <TextField
              value={mnemonicEntered}
              onChange={(e) => setMnemonicEntered(e.target.value)}
              fullWidth
              label="Enter here your mnemonic"
              id="fullWidth"
              multiline
              sx={{ marginTop: 2 }}
              error={
                mnemonicEntered !== undefined &&
                mnemonicEntered !== "" &&
                !isValidMnemonic(mnemonicEntered)
              }
              helperText={
                !isValidMnemonic(mnemonicEntered ?? "")
                  ? "Invalid mnemonic"
                  : undefined
              }
            />
            <div style={{ marginTop: "1rem" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleIsRecoverEnabled(false)}
              >
                Cancel
              </Button>{" "}
              <Button
                disabled={!mnemonicEntered || !isValidMnemonic(mnemonicEntered)}
                variant="contained"
                color="primary"
                onClick={() => handleWalletRecoverClick()}
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {!isRecoverEnabled && mnemonic && (
          <>
            <Typography variant="subtitle1">
              This is your mnemonic, <b>keep it safe</b> 👇
              <div>
                <TextField
                  variant="outlined"
                  label="Mnemonic"
                  value={mnemonic}
                  InputProps={{
                    endAdornment: <CopyToClipboardButton value={mnemonic} />,
                    sx: {
                      borderRadius: "5px",
                      borderColor: "rgba(0, 0, 0, 0.87)",
                      padding: 1,
                      color: "red",
                    },
                  }}
                  fullWidth
                />
              </div>
            </Typography>
            <>
              <TextField
                value={mnemonicEntered}
                onChange={(e) => setMnemonicEntered(e.target.value)}
                fullWidth
                label="Enter the mnemonic before continuing"
                id="fullWidth"
                multiline
                sx={{ marginTop: 2 }}
              />
              <div style={{ marginTop: "1rem" }}>
                {" "}
                <Button
                  disabled={
                    (mnemonic !== mnemonicEntered && !isRecoverEnabled) ||
                    isLoading
                  }
                  variant="contained"
                  onClick={() => handleWalletRecoverClick()}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="primary" />
                  ) : (
                    "I saved the mnemonic, continue"
                  )}
                </Button>
              </div>
            </>
          </>
        )}
      </div>
    </div>
  );
}

export default WalletInit;
