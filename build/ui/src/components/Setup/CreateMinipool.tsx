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
import MinipoolEthToggle, { ValidatorDepositMode } from "./MinipoolEthToggle";
import "./minipool.css";
import TxsLinksBox from "./TxsLinksBox";
import { WaitResponse } from "../../types/WaitResponse";
import { NextValidatorBond } from "../../types/NextValidatorBond";

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
  const [depositMode, setDepositMode] = useState<ValidatorDepositMode>("megapool");
  const [nextValidatorBond, setNextValidatorBond] = useState<NextValidatorBond>();

  const rplBalance = data?.nodeStatus?.accountBalances.rpl ?? 0;
  const appService = new AppService();

  async function getDepositAmountWei(selectedMode: ValidatorDepositMode): Promise<string> {
    if (selectedMode === "megapool") {
      const bond = await appService.getMegapoolNextValidatorBond();
      setNextValidatorBond(bond);
      if (bond.status !== "success") {
        throw new Error(bond.error || "Unable to get the next megapool validator bond requirement");
      }
      return bond.bondRequirement;
    }
    return selectedMode === "8" ? "8000000000000000000" : "16000000000000000000";
  }

  async function refreshData(selectedMode: ValidatorDepositMode) {
    setIsDepositLoading(true);
    try {
      const amountWei = await getDepositAmountWei(selectedMode);
      const canDeposit = await appService.canDepositAmountWei(amountWei, nodeFee);
      setCanDeposit(canDeposit);
    } catch (error) {
      setCanDeposit({
        status: "error",
        error: String(error),
        canDeposit: false,
        creditBalance: 0,
        depositBalance: 0,
        canUseCredit: false,
        nodeBalance: 0,
        insufficientBalance: false,
        insufficientBalanceWithoutCredit: false,
        insufficientRplStake: false,
        invalidAmount: false,
        depositDisabled: false,
        inConsensus: false,
        isAtlasDeployed: false,
        gasInfo: { estGasLimit: 0, safeGasLimit: 0 },
      });
    } finally {
      setIsDepositLoading(false);
    }
  }

  async function fetchData() {
    const networkNodeFee = await appService.getNetworkNodeFee();
    setNodeFee(networkNodeFee.nodeFee);
    refreshData(depositMode);
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
      const allowance = await appService.getNodeStakeRplAllowance();
      if (allowance < rplBalance) {
        const approveResponse = await appService.stakeRplApprove(rplBalance);
        setStakeTxs([...stakeTxs, approveResponse.approveTxHash]);
        setApprovalResponse(approveResponse);
        if (approveResponse.status !== "success") {
          return;
        }
        await appService.wait(approveResponse.approveTxHash);
      }
      const canStakeRpl = await appService.getNodeCanStakeRpl(rplBalance);
      if (!canStakeRpl.canStake) {
        return;
      }
      const stakeResponse = await appService.nodeStakeRpl(rplBalance);
      setStakeTxs([...txs, stakeResponse.stakeTxHash]);
      setStakeResponse(stakeResponse);
      if (stakeResponse.status !== "success") {
        return;
      }
      await appService.wait(stakeResponse.stakeTxHash);
    } finally {
      setIsStakeLoading(false);
      refreshData(depositMode);
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
      const amountWei = await getDepositAmountWei(depositMode);
      const depositResponse = await appService.nodeDepositAmountWei(
        amountWei,
        nodeFee,
        canDeposit?.canUseCredit ?? false
      );
      setTxs([...txs, depositResponse.txHash]);
      setDepositResponse(depositResponse);
      if (depositResponse.status !== "success") {
        return;
      }
      const wait = await appService.wait(depositResponse.txHash);
      if (wait.status !== "success") {
        return;
      }
      onAddMinipoolClick(false);
    } finally {
      setIsDepositLoading(false);
      refreshData(depositMode);
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

  const depositLabel = depositMode === "megapool" ? "Megapool validator" : `${depositMode} ETH minipool`;
  const depositAmountLabel = depositMode === "megapool"
    ? `${toEtherString(nextValidatorBond?.bondRequirement ?? "4000000000000000000")} ETH`
    : `${depositMode} ETH`;

  return (
    <div className="create-minipool-container">
      <Typography variant="h5">Create validator </Typography>
      <MinipoolEthToggle
        depositMode={depositMode}
        setDepositMode={setDepositMode}
        setCanDeposit={setCanDeposit}
        refreshData={refreshData}
        includeLegacyMinipools={false}
      />
      {depositMode === "megapool" && (
        <Alert severity="info" sx={{ marginTop: 2 }}>
          Uses the stable Smartnode v1.20 HTTP API to create a Saturn megapool validator. The UI asks Smartnode for the current bond requirement before depositing.
        </Alert>
      )}
      <div className="required-balance-container">
        <RequiredBalanceInfo data={data} depositMode={depositMode} requiredBondWei={nextValidatorBond?.bondRequirement} />
      </div>
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Stake {toEtherString(rplBalance)} RPL, all you have in your wallet
      </Typography>
      <Button
        disabled={rplBalance === 0 || isStakeLoading}
        variant="contained"
        onClick={() => handleStakeRPLClick()}
      >
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
        Deposit {depositAmountLabel} to create the {depositLabel} (validator key will be
        imported and configured automatically)
      </Typography>
      <Box>
        <Button
          disabled={(!canDeposit?.canDeposit || false) || isDepositLoading}
          variant="contained"
          onClick={() => handleDepositRPLClick()}
        >
          {isDepositLoading ? (
            <CircularProgress size={24} color="primary" />
          ) : (
            `Deposit ${depositAmountLabel}`
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
      {canDeposit?.error && (
        <Alert severity="error" variant="filled" sx={{ marginTop: 2 }}>
          {canDeposit?.error}
        </Alert>
      )}
      {canDeposit?.nodeHasDebt && (
        <Alert severity="error" variant="filled" sx={{ marginTop: 2 }}>
          The node has megapool debt. Repay debt before creating a new validator.
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
