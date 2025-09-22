import React, { useState, useEffect } from "react";
import { Alert, Box, Card, CircularProgress, Typography } from "@mui/material";
import InfoTab from "./components/Info/InfoTab";
import SetupTab from "./components/Setup/SetupTab";

import { Network } from "./types/Network";
import { AppService } from "./services/AppService";
import { RocketpoolData } from "./types/RocketpoolData";

import { RocketpoolContext } from "./components/Providers/Context";
import RewardsTab from "./components/Rewards/RewardsTab";
import BalanceBox from "./components/BalanceBox/BalanceBox";
import BalanceButton from "./components/Buttons/BalanceButton";
import AdvancedTab from "./components/Advanced/AdvancedTab";

function Dashboard({ activeTab }: { activeTab: string }): JSX.Element {
  const { rocketpoolValue, updateRocketpoolValue } =
    React.useContext(RocketpoolContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showBalanceBox, setShowBalanceBox] = useState(false);

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
      appService.getConfig(),
    ])
      .then((values) => {
        updateRocketpoolValue(
          new RocketpoolData(
            values[0] as Network,
            values[1],
            values[2],
            values[3],
            values[4],
            values[5]
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
    loadingOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
  };

  return (
    <div className="App">
      {rocketpoolValue?.walletStatus && (
        <>
          {rocketpoolValue.walletStatus.walletInitialized &&
            !showBalanceBox && (
              <BalanceButton setShowBalanceBox={setShowBalanceBox} />
            )}
          <Box
            sx={{
              margin: { xs: 1, sm: 2, md: 4, lg: 8 },
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              padding: { xs: 1, sm: 2 },
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
                  padding: { xs: 2, sm: 3, md: 4 },
                  borderRadius: 2,
                  boxShadow: 4,
                  width: "100%",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                <div className="content">
                  {activeTab === "Setup" && (
                    <SetupTab onRefreshRockpoolData={refreshRocketpoolData} />
                  )}
                  {activeTab === "Rewards" && (
                    <RewardsTab config={rocketpoolValue.config} />
                  )}
                  {activeTab === "Info" && <InfoTab />}
                  {activeTab === "Advanced" && <AdvancedTab />}
                </div>
              </Card>
            )}
          </Box>
          {showBalanceBox && (
            <BalanceBox setShowBalanceBox={setShowBalanceBox} />
          )}
        </>
      )}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ marginBottom: "1rem" }} />
            {!rocketpoolValue?.walletStatus && (
              <Typography variant="body1" color="white">
                Loading on-chain Rocket Pool data...
              </Typography>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
