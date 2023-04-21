import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import { toEtherString } from "../../utils/Utils";
import RequiredBalanceInfo from "./RequiredBalanceInfo";
import { CanDeposit } from "../../types/CanDeposit";
import { StakeRplApprove } from "../../types/StakeRplApprove";
import { StakeResponse } from "../../types/StakeResponse";
import { DepositResponse } from "../../types/DepositResponse";
import MinipoolEthToggle from "./MinipoolEthToggle";
import "./minipool.css";
import TxsLinksBox from "./TxsLinksBox";
import { WaitResponse } from "../../types/WaitResponse";

interface CreateMinipoolProps {
  data?: RocketpoolData;
  onAddMinipoolClick: (add: boolean) => void;
}

const CreateMinipool: React.FC<CreateMinipoolProps> = ({
  data,
  onAddMinipoolClick,
}): JSX.Element => {
  const [isDepositLoading, setIsDepositLoading] = useState<boolean>(false);
  const [isStakeLoading, setIsStakeLoading] = useState<boolean>(false);
  const [txs, setTxs] = useState<string[]>([]);
  const [stakeTxs, setStakeTxs] = useState<string[]>([]);
  const [approvalResponse, setApprovalResponse] = useState<StakeRplApprove>();
  const [stakeResponse, setStakeResponse] = useState<StakeResponse>();
  const [depositResponse, setDepositResponse] = useState<DepositResponse>();
  const [w3sStatusResponse, setW3sStatusResponse] = useState<WaitResponse>();
  const [canDeposit, setCanDeposit] = useState<CanDeposit>();
  const [nodeFee, setNodeFee] = useState<number>(0);
  const [minipoolEth, setMinipoolEth] = useState<8 | 16>(8);

  const minimumRpl = data?.networkRplPrice?.minPer8EthMinipoolRplStake ?? 0;
  const ethBalance = data?.nodeStatus?.accountBalances.eth ?? 0;
  const rplBalance = data?.nodeStatus?.accountBalances.rpl ?? 0;
  const appService = new AppService();

  async function refreshData(selectedEth: number) {
    setIsDepositLoading(true);
    var canDeposit = await appService.canDeposit(selectedEth, nodeFee);
    setCanDeposit(canDeposit);
    setIsDepositLoading(false);

    // if ((data?.nodeStatus?.rplStake ?? 0) < minimumRpl) {
    //   setIsDepositETHEnabled(false);
    //   var allowance = await appService.getNodeStakeRplAllowance();
    //   setIsApproveRPLEnabled(allowance < (data?.nodeStatus?.accountBalances.rpl ?? 0));
    //   setIsStakeRPLEnabled(allowance >= (data?.nodeStatus?.accountBalances.rpl ?? 0));
    // } else {
    //   setIsApproveRPLEnabled(false);
    //   setIsStakeRPLEnabled(false);

    //   setIsDepositETHEnabled(false);
    // }
  }

  async function fetchData() {
    var networkNodeFee = await appService.getNetworkNodeFee();
    setNodeFee(networkNodeFee.nodeFee);
    refreshData(minipoolEth);
  }

  useEffect(() => {
    console.log("*** create minipool");
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStakeRPLClick = async () => {
    try {
      setStakeTxs([]);
      setIsStakeLoading(true);
      var allowance = await appService.getNodeStakeRplAllowance();
      if (allowance < rplBalance) {
        var approveResponse = await appService.stakeRplApprove(rplBalance);
        setStakeTxs([...stakeTxs, approveResponse.approveTxHash]);
        setApprovalResponse(approveResponse);
        if (approveResponse.status !== "success") {
          return;
        }
        await appService.wait(approveResponse.approveTxHash);
      }
      var canStakeRpl = await appService.getNodeCanStakeRpl(rplBalance);
      if (!canStakeRpl.canStake) {
        return;
      }
      var stakeResponse = await appService.nodeStakeRpl(rplBalance);
      setStakeTxs([...txs, stakeResponse.stakeTxHash]);
      setStakeResponse(stakeResponse);
      if (stakeResponse.status !== "success") {
        return;
      }
      await appService.wait(stakeResponse.stakeTxHash);
    } finally {
      setIsStakeLoading(false);
      refreshData(minipoolEth);
    }
  };

  const handleDepositRPLClick = async () => {
    try {
      setTxs([]);
      setIsDepositLoading(true);
      const w3sStatus = await appService.getW3sStatus();
      setW3sStatusResponse(w3sStatus);
      if (w3sStatus.status !== "success") {
        return;
      }
      var despositResponse = await appService.nodeDeposit(
        minipoolEth,
        nodeFee,
        canDeposit?.canUseCredit ?? false
      );
      setTxs([...txs, despositResponse.txHash]);
      setDepositResponse(despositResponse);
      if (despositResponse.status !== "success") {
        return;
      }
      var wait = await appService.wait(despositResponse.txHash);
      if (wait.status !== "success") {
        return;
      }
      onAddMinipoolClick(false);
    } finally {
      setIsDepositLoading(false);
      refreshData(minipoolEth);
    }
  };

  function ErrorAlertBox(): JSX.Element {
    return (
      <div>
        {approvalResponse?.error && (
          <Alert severity="error" variant="filled" sx={{ marginTop: 2 }}>
            {approvalResponse?.error}
          </Alert>
        )}
        {stakeResponse?.error && (
          <Alert severity="error" variant="filled" sx={{ marginTop: 2 }}>
            {stakeResponse?.error}
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="create-minipool-container">
      <Typography variant="h5">Create minipool </Typography>
      <MinipoolEthToggle
        minipoolEth={minipoolEth}
        setMinipoolEth={setMinipoolEth}
        setCanDeposit={setCanDeposit}
        refreshData={refreshData}
      />
      <div className="required-balance-container">
        <RequiredBalanceInfo data={data} minipoolEth={minipoolEth} />
      </div>
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Stake {toEtherString(rplBalance)} RPL, all you have in your wallet
      </Typography>
      <Button
        disabled={rplBalance === 0 || isStakeLoading}
        variant="contained"
        onClick={() => handleStakeRPLClick()}
      >
        {" "}
        {isStakeLoading ? (
          <CircularProgress size={24} color="primary" />
        ) : (
          `Stake ${toEtherString(rplBalance)} RPL`
        )}
      </Button>
      <ErrorAlertBox />
      <TxsLinksBox txs={stakeTxs} explorerUrl={data?.config?.explorerUrl} />
      <div className="staked-container">
        {(data?.nodeStatus?.rplStake ?? 0) > 0 && (
          <Typography variant="body2">
            (Total staked: {toEtherString(data?.nodeStatus?.rplStake ?? 0)} RPL)
            <br />
            (Available staked:{" "}
            {toEtherString(
              (data?.nodeStatus?.rplStake ?? 0) -
                (data?.nodeStatus?.minimumRplStake ?? 0)
            )}{" "}
            RPL)
          </Typography>
        )}
      </div>

      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Deposit {minipoolEth} ETH to create the minipool (validator key will be
        imported and configured automatically)
      </Typography>
      <Box>
        <Button
          disabled={(!canDeposit?.canDeposit ?? false) || isDepositLoading}
          variant="contained"
          onClick={() => handleDepositRPLClick()}
        >
          {" "}
          {isDepositLoading ? (
            <CircularProgress size={24} color="primary" />
          ) : (
            `Deposit ${minipoolEth} ETH`
          )}
        </Button>
        {(data?.nodeStatus?.minipoolCounts.total ?? 0) > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => onAddMinipoolClick(false)}
            sx={{ marginLeft: 2 }}
          >
            Cancel
          </Button>
        )}
      </Box>
      {w3sStatusResponse?.error && (
        <Alert severity="error" variant="filled" sx={{ marginTop: 2 }}>
          {w3sStatusResponse?.error}
        </Alert>
      )}
      {depositResponse?.error && (
        <Alert severity="error" variant="filled" sx={{ marginTop: 2 }}>
          {depositResponse?.error}
        </Alert>
      )}
      <TxsLinksBox txs={txs} explorerUrl={data?.config?.explorerUrl} />
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        (Commission Fee: {(nodeFee * 100).toFixed(1)}%)
      </Typography>
    </div>
  );
};

export default CreateMinipool;
