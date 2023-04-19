import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
  Link,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AppService } from "../../services/AppService";
import { NodeRewards } from "../../types/NodeRewards";
import { toWei } from "../../utils/Utils";

interface RewardsTabProps {}

const RewardsTab: React.FC<RewardsTabProps> = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [txs, setTxs] = useState<string[]>([]);
  const [nodeRewards, setNodeRewards] = useState<NodeRewards>();

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
      var canClainRewards = restake
        ? await appService.getNodeCanClaimAndRestakeRewards(
            indexes,
            toWei(nodeRewards?.unclaimedRplRewards ?? 0)
          )
        : await appService.getNodeCanClaimRewards(indexes);
      if (canClainRewards.status !== "success") {
        return;
      }
      var claimRewards = restake
        ? await appService.nodeClaimAndRestakeRewards(
            indexes,
            toWei(nodeRewards?.unclaimedRplRewards ?? 0)
          )
        : await appService.nodeClaimRewards(indexes);
      setTxs([...txs, claimRewards.txHash]);
      if (claimRewards.status !== "success") {
        return;
      }
      await appService.wait(claimRewards.txHash);
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
          {txs.map((tx, index) => (
            <Link
              href={`https://goerli.etherscan.io/tx/${tx}`}
              variant="subtitle1"
              underline="always"
              target="_blank"
              rel="noopener"
            >
              View transaction {index + 1} on Etherscan
              <OpenInNewIcon fontSize="inherit" />
            </Link>
          ))}
        </>
      )}
    </Box>
  );
};

export default RewardsTab;
