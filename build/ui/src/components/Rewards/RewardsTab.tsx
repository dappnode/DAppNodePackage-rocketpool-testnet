import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
  Alert,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AppService } from "../../services/AppService";
import { NodeRewards } from "../../types/NodeRewards";
import { toWei } from "../../utils/Utils";
import { Config } from "../../types/AppConfig";
import TxsLinksBox from "../Setup/TxsLinksBox";
import { CanClaimRewards } from "../../types/CanClaimRewards";
import { TxResponse } from "../../types/TxResponse";
import BigNumber from "bignumber.js";

interface RewardsTabProps {
  config?: Config;
}

const RewardsTab: React.FC<RewardsTabProps> = ({
  config
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [txs, setTxs] = useState<string[]>([]);
  const [nodeRewards, setNodeRewards] = useState<NodeRewards>();
  const [nodeCanClaimRewards, setNodeCanClaimRewards] = useState<CanClaimRewards>();
  const [txResponse, setTxResponse] = useState<TxResponse>();

  const appService = new AppService();

  const fetchData = async () => {
    setIsLoading(true);
    var rewards = await appService.getNodeRewards();
    setNodeRewards(rewards);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClaimRewards = async (restake: boolean = false) => {
    try {
      setTxs([]);
      setIsClaiming(true);
      var rewardsInfo = await appService.getRewardsInfo();
      if (rewardsInfo.status !== "success") {
        return;
      }
      var indexes = rewardsInfo.unclaimedIntervals
        .map((reward) => reward.index)
        .join(",");
      const sumCollateralRplAmount = rewardsInfo.unclaimedIntervals.reduce(
        (accumulator, currentValue) => accumulator.plus(new BigNumber(currentValue.collateralRplAmount)),
        new BigNumber(0),
      );
      var canClainRewards = restake
        ? await appService.getNodeCanClaimAndRestakeRewards(
            indexes,
            sumCollateralRplAmount.toString(),
          )
        : await appService.getNodeCanClaimRewards(indexes);
      setNodeCanClaimRewards(canClainRewards);
      if (canClainRewards.status !== "success") {
        return;
      }
      var tx = restake
        ? await appService.nodeClaimAndRestakeRewards(
            indexes,
            sumCollateralRplAmount.toString(),
          )
        : await appService.nodeClaimRewards(indexes);
      setTxResponse(tx);
      setTxs([...txs, tx.txHash]);
      if (tx.status !== "success") {
        return;
      }
      await appService.wait(tx.txHash);
      fetchData();
    } finally {
      setIsClaiming(false);
    }
  };

  function areAnyRewardsAvailable() {
    return (
      (nodeRewards?.unclaimedEthRewards ?? 0) === 0 &&
      (nodeRewards?.unclaimedRplRewards ?? 0) === 0
    );
  }
  
  function ErrorAlertBox(): JSX.Element {
    return (
      <>
        {nodeCanClaimRewards?.error && (
          <Alert
            severity="error"
            sx={{ marginTop: 2, marginBottom: 2 }}
            variant="filled"
          >
            {nodeCanClaimRewards?.error}
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

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Rewards
      </Typography>
      {isLoading && (
        <>
          <CircularProgress sx={{ marginTop: 1 }} />
          <Typography variant="body1">
            This process could take a while...
          </Typography>
        </>
      )}
      {!isLoading && nodeRewards && (
        <>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            These are your available rewards:
            <br />
          </Typography>

          <div>
            <Chip
              label={`${nodeRewards.unclaimedEthRewards.toFixed(4)} ETH`}
              color="success"
            />{" "}
            <Chip
              label={`${nodeRewards.unclaimedRplRewards.toFixed(4)} RPL`}
              color="success"
            />
          </div>
          <Box sx={{ marginTop: 3 }}>
            <Button
              disabled={isClaiming || areAnyRewardsAvailable()}
              variant="contained"
              onClick={() => handleClaimRewards()}
            >
              {" "}
              {isClaiming ? (
                <CircularProgress size={24} color="primary" />
              ) : (
                `Claim`
              )}
            </Button>
            <Typography variant="subtitle1">or</Typography>
            <Button
              disabled={
                isClaiming || (nodeRewards?.unclaimedRplRewards ?? 0) === 0
              }
              variant="contained"
              onClick={() => handleClaimRewards(true)}
            >
              {" "}
              {isClaiming ? (
                <CircularProgress size={24} color="primary" />
              ) : (
                `Claim & Restake RPL tokens`
              )}
            </Button>
          </Box>
          <TxsLinksBox txs={txs} explorerUrl={config?.explorerUrl} />
          <ErrorAlertBox />
        </>
      )}
    </Box>
  );
};

export default RewardsTab;
