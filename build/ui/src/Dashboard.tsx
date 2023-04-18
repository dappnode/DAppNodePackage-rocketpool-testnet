import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Card,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import InfoTab from "./components/Info/InfoTab";
import SetupTab from "./components/Setup/SetupTab";

import { Network } from "./types/Network";
import { AppService } from "./services/AppService";
import { RocketpoolData } from "./types/RocketpoolData";
import { toEtherString } from "./utils/Utils";

import { RocketpoolContext } from "./components/Providers/Context";
import RewardsTab from "./components/Rewards/RewardsTab";

function Dashboard({ activeTab }: { activeTab: string }): JSX.Element {
  const { rocketpoolValue, updateRocketpoolValue } =
    React.useContext(RocketpoolContext);
  const [isLoading, setIsLoading] = useState(false);

  const [clientsSynced, setClientsSynced] = React.useState(
    rocketpoolValue?.nodeSync?.ecStatus.primaryEcStatus.isSynced &&
      rocketpoolValue?.nodeSync?.bcStatus.primaryEcStatus.isSynced
  );

  const appService = new AppService();
  function fetchData() {
    setIsLoading(true);
    Promise.all([
      appService.getEnvironment("NETWORK"),
      appService.getWalletStatus(),
      appService.getNodeStatus(),
      appService.getNodeSync(),
      appService.getNetworkRplPrice(),
    ])
      .then((values) => {
        updateRocketpoolValue(
          new RocketpoolData(
            values[0] as Network,
            values[1],
            values[2],
            values[3],
            values[4]
          )
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    setClientsSynced(
      rocketpoolValue?.nodeSync?.ecStatus.primaryEcStatus.isSynced &&
        rocketpoolValue?.nodeSync?.bcStatus.primaryEcStatus.isSynced
    );
  }, [rocketpoolValue]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshRocketpoolData = () => {
    fetchData();
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <div className="App">
      {isLoading && (
        <>
          <div style={styles.container}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CircularProgress sx={{ marginBottom: "1rem" }} />
              {!rocketpoolValue?.walletStatus && (
                <Typography variant="body1">
                  Loading on-chain Rocket Pool data...
                </Typography>
              )}
            </div>
          </div>
        </>
      )}
      {rocketpoolValue?.walletStatus && (
        <>
          {rocketpoolValue.walletStatus.walletInitialized && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 1,
              }}
            >
              <Chip
                variant="outlined"
                label={`Address: ${rocketpoolValue.walletStatus.accountAddress}`}
              />
              &nbsp;&nbsp;
              <Chip
                variant="outlined"
                label={`${toEtherString(
                  rocketpoolValue.nodeStatus?.accountBalances.eth ?? 0
                )} ETH`}
              />
              &nbsp;&nbsp;
              <Chip
                variant="outlined"
                label={`${toEtherString(
                  rocketpoolValue.nodeStatus?.accountBalances.rpl ?? 0
                )} RPL`}
              />
            </Box>
          )}
          <Box
            sx={{
              margin: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            {!clientsSynced && activeTab !== "Info" ? (
              <Alert severity="error" variant="filled">
                You <b>cannot access </b> the tab {activeTab} <b>until</b> your
                execution client and beacon chain client are <b>synced</b>.
              </Alert>
            ) : (
              <Card
                sx={{
                  padding: 4,
                  borderRadius: 2,
                  boxShadow: 4,
                }}
              >
                <div className="content">
                  {activeTab === "Setup" && (
                    <SetupTab onRefreshRockpoolData={refreshRocketpoolData} />
                  )}
                  {activeTab === "Rewards" && <RewardsTab />}
                  {activeTab === "Info" && <InfoTab />}
                </div>
              </Card>
            )}
          </Box>
        </>
      )}
    </div>
  );
}

export default Dashboard;
