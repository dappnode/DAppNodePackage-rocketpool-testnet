import React, { useState, useEffect } from "react";
import { Typography, Button, Box, Link, ToggleButtonGroup, ToggleButton, CircularProgress } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import { toEther, toEtherString } from "../../utils/Utils";
import RequiredBalanceInfo from "./RequiredBalanceInfo";
import { CanDeposit } from "../../types/CanDeposit";
import { StakeRplApprove } from "../../types/StakeRplApprove";
import { StakeResponse } from "../../types/StakeResponse";
import { DepositResponse } from "../../types/DepositResponse";

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
  const [canDeposit, setCanDeposit] = useState<CanDeposit>();
  const [nodeFee, setNodeFee] = useState<number>(0);
  const [minipoolEth, setMinipoolEth] = useState<number>(8);

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
    setMinipoolEth(data?.nodeStatus?.isAtlasDeployed ? 8 : 16)
    var networkNodeFee = await appService.getNetworkNodeFee();
    setNodeFee(networkNodeFee.nodeFee);
    refreshData(minipoolEth);
  }

  useEffect(() => {
    console.log("*** create minipool")
    fetchData();
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
        if (approveResponse.status !== "success") { return }
        await appService.wait(approveResponse.approveTxHash);
      }
      var canStakeRpl = await appService.getNodeCanStakeRpl(rplBalance);
      if (!canStakeRpl.canStake) { return }
      var stakeResponse = await appService.nodeStakeRpl(rplBalance);
      setStakeTxs([...txs, stakeResponse.stakeTxHash]);
      setStakeResponse(stakeResponse);
      if (stakeResponse.status !== "success") { return }
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
      var despositResponse = await appService.nodeDeposit(minipoolEth, nodeFee, canDeposit?.canUseCredit ?? false);
      setTxs([...txs, despositResponse.txHash]);
      setDepositResponse(despositResponse);
      if (despositResponse.status !== "success") { return }
      var wait = await appService.wait(despositResponse.txHash);
      if (wait.status !== "success") { return }
      onAddMinipoolClick(false);
    } finally {
      setIsDepositLoading(false);
      refreshData(minipoolEth);
    }
    
  };

  const handleMinipoolEthChange = (
    event: React.MouseEvent<HTMLElement>,
    newMinipoolEth: string,
  ) => {
    const minipoolEth = Number(newMinipoolEth);
    setMinipoolEth(minipoolEth);
    setCanDeposit(undefined);
    refreshData(minipoolEth);
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
      <Box display="inline">
        <Typography variant="h5">Create minipool{' '}
          <ToggleButtonGroup
            disabled={!data?.nodeStatus?.isAtlasDeployed}
            color="primary"
            value={minipoolEth.toString()}
            exclusive
            onChange={handleMinipoolEthChange}
            aria-label="minipool"
          >
            <ToggleButton value="8" aria-label="8 ETH">
              8 ETH
            </ToggleButton>
            <ToggleButton value="16" aria-label="16 ETH">
              16 ETH
            </ToggleButton>
          </ToggleButtonGroup>
        </Typography>
      </Box>
      <RequiredBalanceInfo data={data} />
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Stake {toEtherString(rplBalance)} RPL, all you have in your wallet
      </Typography>
      <Button
        disabled={rplBalance === 0 || isStakeLoading}
        variant="contained"
        onClick={() => handleStakeRPLClick()}
      >
        {" "}
        {isStakeLoading ? <CircularProgress size={24} color="primary" /> : `Stake ${toEtherString(rplBalance)} RPL`}
      </Button>
      {approvalResponse?.error && (
        <Typography variant="body1" sx={{ color: "red" }}>
          ❗️{approvalResponse?.error}
        </Typography>
      )}
      {stakeResponse?.error && (
        <Typography variant="body1" sx={{ color: "red" }}>
          ❗️{stakeResponse?.error}
        </Typography>
      )}
      {stakeTxs.map((tx, index) => (
        <Link href={`https://goerli.etherscan.io/tx/${tx}`} variant="subtitle1" underline="always" target="_blank" rel="noopener">
          View transaction {index + 1} on Etherscan
          <OpenInNewIcon fontSize="inherit" />
        </Link>
      ))}
      {(data?.nodeStatus?.rplStake ?? 0) > 0 && (
        <Typography variant="body2">
          (Total staked: {toEtherString(data?.nodeStatus?.rplStake ?? 0)} RPL)
          <br />
          (Available staked: {toEtherString((data?.nodeStatus?.rplStake ?? 0) - (data?.nodeStatus?.minimumRplStake ?? 0))} RPL)
        </Typography>
      )}
      <Typography variant="body1" sx={{ marginTop: 2 }}>
      Deposit 16 ETH to create the minipool (validator key will be imported and configured automatically)
      </Typography>
      <Box>
        <Button
          disabled={(!canDeposit?.canDeposit ?? false) || isDepositLoading}
          variant="contained"
          onClick={() => handleDepositRPLClick()}>
          {" "}
          {isDepositLoading ? <CircularProgress size={24} color="primary" /> : `Deposit ${minipoolEth} ETH`}
        </Button>
        {(data?.nodeStatus?.minipoolCounts.total ?? 0) > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => onAddMinipoolClick(false)}
            sx={{ marginLeft: 2 }} >
            Cancel
          </Button>
        )}
      </Box>
      {depositResponse?.error && (
        <Typography variant="body1" sx={{ color: "red" }}>
          ❗️{depositResponse?.error}
        </Typography>
      )}
      {txs.map((tx, index) => (
        <Link href={`https://goerli.etherscan.io/tx/${tx}`} variant="subtitle1" underline="always" target="_blank" rel="noopener">
          View transaction {index + 1} on Etherscan
          <OpenInNewIcon fontSize="inherit" />
        </Link>
      ))}
      <Typography variant="body2" sx={{ marginTop: 2 }}>
        (Commission Fee: {(nodeFee * 100).toFixed(1)}%)
      </Typography>
    </Box>
  );
}

export default CreateMinipool;
