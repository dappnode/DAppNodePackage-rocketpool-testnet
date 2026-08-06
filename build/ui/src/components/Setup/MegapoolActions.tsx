import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Alert,
  TextField,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PaidIcon from "@mui/icons-material/Paid";
import { AppService } from "../../services/AppService";
import { Config } from "../../types/AppConfig";
import TxsLinksBox from "./TxsLinksBox";
import { TxResponse } from "../../types/TxResponse";
import { MegapoolRewards } from "../../types/MegapoolRewards";
import { toWei } from "../../utils/Utils";

interface MegapoolActionsProps {
  config?: Config;
  onRefreshRockpoolData?: () => void;
}

// Megapool exit + claim lifecycle actions.
// Exit: a validator still in the entry queue uses exit-queue (by index);
//       an active validator uses exit-validator (by id), then notify-validator-exit.
// Claim: distribute claims accrued megapool ETH/rewards; claim-refund returns the node bond.
const MegapoolActions: React.FC<MegapoolActionsProps> = ({
  config,
  onRefreshRockpoolData,
}): JSX.Element => {
  const appService = new AppService();

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [txs, setTxs] = useState<string[]>([]);
  const [txResponse, setTxResponse] = useState<TxResponse>();
  const [pendingRewards, setPendingRewards] = useState<MegapoolRewards>();

  // Exit inputs
  const [validatorIndex, setValidatorIndex] = useState<string>("");
  const [validatorId, setValidatorId] = useState<string>("");

  const fetchData = async () => {
    try {
      const rewards = await appService.getMegapoolPendingRewards();
      setPendingRewards(rewards);
    } catch {
      // pending-rewards is best-effort; ignore transient read errors
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generic preflight -> execute -> wait runner shared by all tx actions.
  const runTx = async (
    preflight: () => Promise<{ status: string; error: string }>,
    execute: () => Promise<TxResponse>,
  ) => {
    try {
      setTxs([]);
      setTxResponse(undefined);
      setIsBusy(true);

      const can = await preflight();
      if (can.status !== "success") {
        setTxResponse({
          status: can.status === "success" ? "success" : "error",
          error: can.error,
          txHash: "",
        });
        return;
      }

      const tx = await execute();
      setTxResponse(tx);
      if (tx.txHash) setTxs([tx.txHash]);
      if (tx.status !== "success") return;

      if (tx.txHash) await appService.wait(tx.txHash);
      await fetchData();
      onRefreshRockpoolData?.();
    } finally {
      setIsBusy(false);
    }
  };

  const handleExitQueue = () => {
    const idx = Number(validatorIndex);
    if (!Number.isInteger(idx) || idx < 0) return;
    return runTx(
      () => appService.canExitQueue(idx),
      () => appService.exitQueue(idx),
    );
  };

  const handleExitValidator = () => {
    const id = Number(validatorId);
    if (!Number.isInteger(id) || id < 0) return;
    return runTx(
      () => appService.canExitValidator(id),
      () => appService.exitValidator(id),
    );
  };

  const handleNotifyValidatorExit = () => {
    const id = Number(validatorId);
    if (!Number.isInteger(id) || id < 0) return;
    return runTx(
      () => appService.canNotifyValidatorExit(id),
      () => appService.notifyValidatorExit(id),
    );
  };

  const handleDistribute = () =>
    runTx(
      () => appService.canDistributeMegapool(),
      () => appService.distributeMegapool(),
    );

  const handleClaimRefund = () =>
    runTx(
      () => appService.canClaimRefund(),
      () => appService.claimRefund(),
    );

  const nodeRewardsWei = pendingRewards?.rewardSplit?.NodeRewards ?? null;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Exit &amp; Claim
      </Typography>

      {/* --- Exit --- */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          <LogoutIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
          Exit a validator
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          A validator still in the entry queue can be exited by index. An active
          validator is exited by id, then its exit is notified to the protocol.
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Validator index (in queue)"
            value={validatorIndex}
            onChange={(e) => setValidatorIndex(e.target.value)}
            disabled={isBusy}
          />
          <Button
            variant="contained"
            disabled={isBusy || validatorIndex === ""}
            onClick={handleExitQueue}
          >
            Exit queue
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Validator id (active)"
            value={validatorId}
            onChange={(e) => setValidatorId(e.target.value)}
            disabled={isBusy}
          />
          <Button
            variant="contained"
            disabled={isBusy || validatorId === ""}
            onClick={handleExitValidator}
          >
            Exit validator
          </Button>
          <Button
            variant="outlined"
            disabled={isBusy || validatorId === ""}
            onClick={handleNotifyValidatorExit}
          >
            Notify exit
          </Button>
        </Box>
      </Box>

      {/* --- Claim / withdraw --- */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <PaidIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
          Claim &amp; withdraw
        </Typography>
        {nodeRewardsWei != null && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Pending node rewards: {toWei(Number(nodeRewardsWei))} ETH
          </Typography>
        )}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            disabled={isBusy}
            onClick={handleDistribute}
          >
            Distribute rewards
          </Button>
          <Button
            variant="outlined"
            disabled={isBusy}
            onClick={handleClaimRefund}
          >
            Claim refund
          </Button>
        </Box>
      </Box>

      {isBusy && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
          <CircularProgress size={18} />
          <Typography variant="body2">Submitting transaction…</Typography>
        </Box>
      )}

      {txResponse?.error && (
        <Alert severity="error" sx={{ my: 1 }}>
          {txResponse.error}
        </Alert>
      )}

      <TxsLinksBox txs={txs} explorerUrl={config?.explorerUrl} />
    </Box>
  );
};

export default MegapoolActions;
