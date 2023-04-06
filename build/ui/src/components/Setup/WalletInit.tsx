import React, { useState, useEffect } from "react";
import { Typography, Button, TextField, Box, Link, CircularProgress } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CopyToClipboardButton from "../Buttons/CopyToClipboardButton";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import { RocketpoolContext } from "../Providers/Context";

interface WalletInitProps {}

const WalletInit: React.FC<WalletInitProps> = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecoverEnabled, setIsRecoverEnabled] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState<string>();
  const [mnemonicEntered, setMnemonicEntered] = useState<string>();
  const { rocketpoolValue, updateRocketpoolValue } = React.useContext(RocketpoolContext);

  const appService = new AppService();

  useEffect(() => {
    // This code will run when the component mounts
    // You can use it to fetch data or set up any other initial state
  }, []);

  const handleWalletInitClick = async () => {
    var seed = await appService.walletInit();
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
        rocketpoolValue?.networkRplPrice,
      )
    );
    setIsLoading(false);
  };

  const handleIsRecoverEnabled= (enabled: boolean) => {
    setIsRecoverEnabled(enabled);
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        minHeight: "100vh", 
        '& > * + *': { marginTop: '10px' } 
      }}>
      <Typography variant="subtitle1">
        In order to use Rocket Pool for the first time you need to create a wallet clicking on
      </Typography>
      <Button
        disabled={(mnemonic !== undefined) || isRecoverEnabled}
        variant="contained"
        onClick={() => handleWalletInitClick()}
      >
        {" "}
        Init Wallet
      </Button>
      <Typography variant="subtitle1">
        or
      </Typography>
      <Button
        disabled={mnemonic !== undefined || isRecoverEnabled}
        variant="contained"
        color="error"
        onClick={() => handleIsRecoverEnabled(true)}
      >
        Recover your Rocket Pool wallet
      </Button>
      <br/>
      {(mnemonic || isRecoverEnabled) && (
        <>
          {mnemonic && (
            <>
              <Typography variant="subtitle1">
                Your mnemonic, keep it safe 👇
              </Typography>
              <Box sx={{ display: "flex", border: "1px solid rgba(0, 0, 0, 0.87)", borderRadius: "5px", padding: 1 }}>
                <Typography variant="subtitle1" className="mnemonic" >{mnemonic}</Typography>
                <CopyToClipboardButton value={mnemonic} />
              </Box>
            </>
          )}
          <TextField
            value={mnemonicEntered}
            onChange={(e) => setMnemonicEntered(e.target.value)}
            fullWidth
            label="Enter the mnemonic before continue"
            id="fullWidth"
            multiline
            sx={{ marginTop: 2 }}
          />
          <Typography variant="subtitle1" sx={{ marginTop: 2 }} >
            You can backup your wallet and validator keys at any time at
          </Typography>
          <Link href="http://my.dappnode/#/packages/rocketpool-testnet.public.dappnode.eth/backup" variant="subtitle1" underline="always" target="_blank" rel="noopener">
            http://my.dappnode/#/packages/rocketpool-testnet.public.dappnode.eth/backup
            <OpenInNewIcon fontSize="inherit" />
          </Link>
          <Button
            disabled={((mnemonic !== mnemonicEntered) && !isRecoverEnabled) || (isRecoverEnabled && ((mnemonicEntered?.length ?? 0) === 0)) || isLoading}
            variant="contained"
            onClick={() => handleWalletRecoverClick()}
          >
             {isLoading ? <CircularProgress size={24} color="primary" /> : 'I saved the mnemonic, continue'}
          </Button>
        </>
      )}
    </Box>
  );
}

export default WalletInit;
