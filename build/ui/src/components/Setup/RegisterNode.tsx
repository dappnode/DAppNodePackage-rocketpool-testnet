import React, { useState, useEffect } from "react";
import { Typography, Button, Chip, Box, TextField, CircularProgress, Link } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CopyToClipboardButton from "../Buttons/CopyToClipboardButton";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import { CanRegisterNode } from "../../types/CanRegisterNode";
import { enoughEthBalance, isValidEthAddress, toEther, toEtherString } from "../../utils/Utils";
import { NodeCanSetWithdrawalAddress } from "../../types/NodeCanSetWithdrawalAddress";
import { RocketpoolContext } from "../Providers/Context";
import { TxResponse } from "../../types/TxResponse";
import RequiredBalanceInfo from "./RequiredBalanceInfo";

interface RegisterNodeProps {
  data?: RocketpoolData;
  onRefreshRockpoolData: () => void;
}

const RegisterNode: React.FC<RegisterNodeProps> = ({
  data,
  onRefreshRockpoolData,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txs, setTxs] = useState<string[]>([]);
  const [actionsEnabled, setActionsEnabled] = useState<boolean>(true);
  const [canRegisterNode, setCanRegisterNode] = useState<CanRegisterNode>();
  const [txResponse, setTxResponse] = useState<TxResponse>();
  const [canSetWithdrawalAddress, setCanSetWithdrawalAddress] = useState<NodeCanSetWithdrawalAddress>();
  const [addressEntered, setAddressEntered] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const { rocketpoolValue, updateRocketpoolValue } = React.useContext(RocketpoolContext);

  const minimumRpl8Eth = data?.networkRplPrice?.minPer8EthMinipoolRplStake ?? 0;
  const minimumRpl16Eth = data?.networkRplPrice?.minPer16EthMinipoolRplStake ?? 0;
  const minimumRpl = Math.min(minimumRpl8Eth, minimumRpl16Eth);
  const ethBalance = data?.nodeStatus?.accountBalances.eth ?? 0;
  const rplBalance = data?.nodeStatus?.accountBalances.rpl ?? 0;
  const enoughRpl = rplBalance >= minimumRpl;
  const appService = new AppService();

  async function fetchData() {
    var canRegisterNode = await appService.canRegisterNode();
    setCanRegisterNode(canRegisterNode);
    setActionsEnabled(canRegisterNode.canRegister);
  };

  useEffect(() => {
    fetchData();
  }, [data]);

  const handleRegisterNodeClick = async () => {
    try {
      setTxs([]);
      setIsLoading(true);
      setActionsEnabled(false);
      var canNodeRegister = await appService.canRegisterNode();
      if (!canNodeRegister.canRegister) { return }
      var tx = await appService.nodeRegister();
      console.log(tx)
      setTxResponse(tx);
      if (tx.status !== "success") { return }
      setTxs([...txs, tx.txHash]);
      var waitResponse = await appService.wait(tx.txHash);
      if (waitResponse.status !== "success") { return }
      var canWithdrawalRegister = await appService.getNodeCanSetWithdrawalAddress(addressEntered);
      setCanSetWithdrawalAddress(canWithdrawalRegister);
      if (!canWithdrawalRegister.canSet) { return }
      tx = await appService.nodeSetWithdrawalAddress(addressEntered);
      setTxResponse(tx);
      if (tx.status !== "success") { return }
      setTxs([...txs, tx.txHash]);
      waitResponse = await appService.wait(tx.txHash);
      var canSetSmoothingPool = await appService.getNodeCanSetSmoothingPoolStatus();
      if (canSetSmoothingPool.status !== "success") { return }
      tx = await appService.nodeSetSmoothingPoolStatus();
      console.log(tx);
      setTxResponse(tx);
      if (tx.status !== "success") { return }
      setTxs([...txs, tx.txHash]);
      waitResponse = await appService.wait(tx.txHash);
    } finally {
      setIsLoading(false);
      setActionsEnabled(true);
      setCanSetWithdrawalAddress(undefined);
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
    }
  };

  const isValidAddressEntered = (address: string) => {
    return isValidEthAddress(address) && (address !== data?.walletStatus?.accountAddress);
  };

  const handleAddressChange = (event: any) => {
    const newValue = event.target.value;
    setAddressEntered(newValue);
    if (!isValidAddressEntered(newValue)) {
      setAddressError(`${newValue} is not a valid Ethereum address`);
    } else {
      setAddressError('');
    }
  };

  const enoughTokens = () => {
    return enoughEthBalance(data?.nodeStatus, data?.networkRplPrice) && enoughRpl;
  };

  return (
    <Box
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        minHeight: "100vh", 
        '& > * + *': { marginTop: '15px' }
      }}>
      <>
        <Typography variant="body1">
          You must have enough ETH and RPL in order to Register your node
        </Typography>
        <RequiredBalanceInfo data={data} />
        <Typography variant="body1">
          Transfer tokens to your address:{" "}
          <strong>{data?.walletStatus?.accountAddress}</strong>
          <CopyToClipboardButton value={data?.walletStatus?.accountAddress} fontSize="small" />
        </Typography>
        <div>
          <Typography variant="h6">
            Balances
          </Typography>
          <Chip
            label={`${toEtherString(ethBalance)} ETH`}
            color={enoughEthBalance() ? "primary" : "error"}
          />
          {' '}
          <Chip
            label={`${toEtherString(rplBalance)} RPL`}
            color={enoughRpl ? "primary" : "error"}
          />
        </div>
        <br />
        <div>
          <Typography variant="h6">
            Configure your withdrawal address
          </Typography>
          <Typography variant="body1">
            The withdrawal address must be an address of which we are certain we have access and the private key.
          </Typography>
        </div>
        <TextField
          value={addressEntered}
          onChange={handleAddressChange}
          fullWidth
          label="Enter your withdrawal address"
          id="fullWidth"
          error={!!addressError}
          helperText={addressError}
          sx={{ marginTop: 2 }}
        />
        <br />
        <Button 
          disabled={!canRegisterNode?.canRegister || !enoughTokens() || !isValidAddressEntered(addressEntered) || !actionsEnabled || isLoading} 
          variant="contained" 
          onClick={() => handleRegisterNodeClick()}>
          {" "}
          {isLoading ? <CircularProgress size={24} color="primary" /> : 'Register node'}
        </Button>
        {txs.map((tx, index) => (
          <Link href={`https://goerli.etherscan.io/tx/${tx}`} variant="subtitle1" underline="always" target="_blank" rel="noopener">
            View transaction {index + 1} on Etherscan
            <OpenInNewIcon fontSize="inherit" />
          </Link>
        ))}
        {canRegisterNode?.error && (
          <Typography variant="body1" sx={{ color: "red" }}>
            ❗️{canRegisterNode?.error}
          </Typography>
        )}
        {canSetWithdrawalAddress?.error && (
          <Typography variant="body1" sx={{ color: "red" }}>
            ❗️{canSetWithdrawalAddress?.error}
          </Typography>
        )}
        {txResponse?.error && (
          <Typography variant="body1" sx={{ color: "red" }}>
            ❗️{txResponse?.error}
          </Typography>
        )}
      </>
    </Box>
  );
}

export default RegisterNode;
