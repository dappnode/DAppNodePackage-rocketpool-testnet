import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Chip,
  TextField,
  CircularProgress,
  Link,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Alert,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CopyToClipboardButton from "../Buttons/CopyToClipboardButton";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import { CanRegisterNode } from "../../types/CanRegisterNode";
import {
  enoughEthBalance,
  isValidEthAddress,
  toEtherString,
} from "../../utils/Utils";
import { NodeCanSetWithdrawalAddress } from "../../types/NodeCanSetWithdrawalAddress";
import { RocketpoolContext } from "../Providers/Context";
import { TxResponse } from "../../types/TxResponse";
import RequiredBalanceInfo from "./RequiredBalanceInfo";
import "./registerNode.css";

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
  const [canSetWithdrawalAddress, setCanSetWithdrawalAddress] =
    useState<NodeCanSetWithdrawalAddress>();
  const [addressEntered, setAddressEntered] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [minipoolEth, setMinipoolEth] = useState<8 | 16>(8);
  const { rocketpoolValue, updateRocketpoolValue } =
    React.useContext(RocketpoolContext);

  const minimumRpl8Eth = data?.networkRplPrice?.minPer8EthMinipoolRplStake ?? 0;
  const minimumRpl16Eth =
    data?.networkRplPrice?.minPer16EthMinipoolRplStake ?? 0;
  const minimumRpl = Math.min(minimumRpl8Eth, minimumRpl16Eth);
  const ethBalance = data?.nodeStatus?.accountBalances.eth ?? 0;
  const rplBalance = data?.nodeStatus?.accountBalances.rpl ?? 0;
  const enoughRpl = rplBalance >= minimumRpl;
  const appService = new AppService();

  async function fetchData() {
    var canRegisterNode = await appService.canRegisterNode();
    setCanRegisterNode(canRegisterNode);
    setActionsEnabled(canRegisterNode.canRegister);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleMinipoolEthChange = (
    event: React.MouseEvent<HTMLElement>,
    newMinipoolEth: string
  ) => {
    const minipoolEth = Number(newMinipoolEth);

    if (minipoolEth === 8 || minipoolEth === 16) {
      setMinipoolEth(minipoolEth);
    }
  };

  const handleRegisterNodeClick = async () => {
    try {
      setTxs([]);
      setIsLoading(true);
      setActionsEnabled(false);
      var canNodeRegister = await appService.canRegisterNode();
      if (!canNodeRegister.canRegister) {
        return;
      }
      var tx = await appService.nodeRegister();
      console.log(tx);
      setTxResponse(tx);
      if (tx.status !== "success") {
        return;
      }
      setTxs([...txs, tx.txHash]);
      var waitResponse = await appService.wait(tx.txHash);
      if (waitResponse.status !== "success") {
        return;
      }
      var canWithdrawalRegister =
        await appService.getNodeCanSetWithdrawalAddress(addressEntered);
      setCanSetWithdrawalAddress(canWithdrawalRegister);
      if (!canWithdrawalRegister.canSet) {
        return;
      }
      tx = await appService.nodeSetWithdrawalAddress(addressEntered);
      setTxResponse(tx);
      if (tx.status !== "success") {
        return;
      }
      setTxs([...txs, tx.txHash]);
      waitResponse = await appService.wait(tx.txHash);
      var canSetSmoothingPool =
        await appService.getNodeCanSetSmoothingPoolStatus();
      if (canSetSmoothingPool.status !== "success") {
        return;
      }
      tx = await appService.nodeSetSmoothingPoolStatus();
      console.log(tx);
      setTxResponse(tx);
      if (tx.status !== "success") {
        return;
      }
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
          rocketpoolValue?.networkRplPrice
        )
      );
    }
  };

  const isValidAddressEntered = (address: string) => {
    return (
      isValidEthAddress(address) &&
      address !== data?.walletStatus?.accountAddress
    );
  };

  const handleAddressChange = (event: any) => {
    const newValue = event.target.value;
    setAddressEntered(newValue);
    if (!isValidAddressEntered(newValue)) {
      setAddressError(`${newValue} is not a valid Ethereum address`);
    } else {
      setAddressError("");
    }
  };

  const enoughTokens = () => {
    return (
      enoughEthBalance(data?.nodeStatus, data?.networkRplPrice) && enoughRpl
    );
  };

  function ErrorAlertBox(): JSX.Element {
    return (
      <>
        {canRegisterNode?.error && (
          <Alert
            severity="error"
            sx={{ marginTop: 2, marginBottom: 2 }}
            variant="filled"
          >
            {canRegisterNode?.error}
          </Alert>
        )}
        {canSetWithdrawalAddress?.error && (
          <Alert
            severity="error"
            sx={{ marginTop: 2, marginBottom: 2 }}
            variant="filled"
          >
            {canSetWithdrawalAddress?.error}
          </Alert>
        )}
        {txResponse?.error && (
          <Alert
            severity="error"
            sx={{ marginTop: 2, marginBottom: 2 }}
            variant="filled"
          >
            {txResponse?.error}
          </Alert>
        )}
      </>
    );
  }

  function TxsLinksBox(): JSX.Element {
    return (
      <>
        {txs.map((tx, index) => (
          <Link
            href={`https://goerli.etherscan.io/tx/${tx}`}
            variant="subtitle1"
            underline="always"
            target="_blank"
            rel="noopener"
            key={index}
          >
            View transaction {index + 1} on Etherscan
            <OpenInNewIcon fontSize="inherit" />
            <br />
          </Link>
        ))}
      </>
    );
  }

  return (
    <div className="register-node-container">
      <div className="actions-container">
        <div>
          <Typography variant="h5">
            Configure your withdrawal address
          </Typography>
          <Typography variant="body1">
            This address will be able to perform the withdrawal of your staking
            rewards. You must be sure that you have access to it.
          </Typography>
        </div>
        <div>
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
        </div>
        <div className="register-button-container">
          <Button
            disabled={
              !canRegisterNode?.canRegister ||
              !enoughTokens() ||
              !isValidAddressEntered(addressEntered) ||
              !actionsEnabled ||
              isLoading
            }
            variant="contained"
            onClick={() => handleRegisterNodeClick()}
          >
            {" "}
            {isLoading ? (
              <CircularProgress size={24} color="primary" />
            ) : (
              "Register node"
            )}
          </Button>
        </div>
        <TxsLinksBox />
        <ErrorAlertBox />
      </div>
      <div className="info-container">
        <br />
        <Typography variant="h5">Info</Typography>
        <div className="minipool-eth-button-group-container">
          <ToggleButtonGroup
            color="primary"
            value={minipoolEth.toString()}
            exclusive
            onChange={handleMinipoolEthChange}
            aria-label="minipool"
            className="minipool-eth-button-group"
          >
            <ToggleButton
              value="8"
              aria-label="8 ETH"
              className="minipool-eth-left-button"
            >
              8 ETH
            </ToggleButton>
            <ToggleButton
              value="16"
              aria-label="16 ETH"
              className="minipool-eth-right-button"
            >
              16 ETH
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className="rpl-eth-chip-container">
          <Tooltip title="Current RPL price in ETH">
            <Chip
              label={`1 RPL = ${toEtherString(
                data?.networkRplPrice?.rplPrice ?? 0
              )} ETH`}
            />
          </Tooltip>
        </div>

        <div>
          <Typography variant="body1">
            There is a <b>minimum ammount of ETH and RPL</b> required to
            register a node:
          </Typography>
        </div>
        <br />
        <div>
          <RequiredBalanceInfo data={data} minipoolEth={minipoolEth} />
        </div>
        <br />
        <Typography variant="body1">
          Transfer tokens to your address:
          <br />
          <strong>{data?.walletStatus?.accountAddress}</strong>
          <CopyToClipboardButton
            value={data?.walletStatus?.accountAddress}
            fontSize="small"
          />
        </Typography>
        <br />
        <div>
          <Typography variant="h6">Balances</Typography>
          <Chip
            label={`${toEtherString(ethBalance)} ETH`}
            color={enoughEthBalance() ? "primary" : "error"}
          />{" "}
          <Chip
            label={`${toEtherString(rplBalance)} RPL`}
            color={enoughRpl ? "primary" : "error"}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterNode;
