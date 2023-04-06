import React, { useState, useEffect } from "react";
import { LinearProgress, Box, Chip, Typography } from "@mui/material";
import InfoTab from "./components/Info/InfoTab";
import SetupTab from "./components/Setup/SetupTab";

import { Network } from "./types/Network";
import { AppService } from "./services/AppService";
import { RocketpoolData } from "./types/RocketpoolData";
import { toEtherString } from "./utils/Utils";

import { RocketpoolContext } from "./components/Providers/Context";
import RewardsTab from "./components/Rewards/RewardsTab";

function Dashboard ({
  activeTab,
}: {
  activeTab: string;
}): JSX.Element {
  const { rocketpoolValue, updateRocketpoolValue } = React.useContext(RocketpoolContext);
  const [ isLoading, setIsLoading ] = useState(false);
  console.log(activeTab)

  const appService = new AppService();
  function fetchData() {
    setIsLoading(true);
    Promise.all([
      appService.getEnvironment("NETWORK"),
      appService.getWalletStatus(),
      appService.getNodeStatus(),
      appService.getNodeSync(),
      appService.getNetworkRplPrice(),
    ]).then((values) => {
      updateRocketpoolValue(new RocketpoolData(values[0] as Network, values[1], values[2], values[3], values[4]));
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    fetchData();

		const interval = setInterval(() => {
			fetchData();
		}, 60000)

		return () => clearInterval(interval)
  }, []);

  const refreshRocketpoolData = () => {
    fetchData();
  }

  return (
    <div className="App">
      {isLoading && (
        <>
          <LinearProgress sx={{ marginTop: "1px" }} />
          {!rocketpoolValue?.walletStatus && (
            <>Loading Rocket Pool data on-chain...</>
          )}
        </>
      )}
      {rocketpoolValue?.walletStatus && (
        <>
        {rocketpoolValue.walletStatus.walletInitialized && (
          <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", marginTop: 1 }}>
            <Chip 
              variant="outlined"
              label={`Address: ${rocketpoolValue.walletStatus.accountAddress}`} />
            &nbsp;&nbsp;
            <Chip 
              variant="outlined"
              label={`${toEtherString(rocketpoolValue.nodeStatus?.accountBalances.eth ?? 0)} ETH`} />
            &nbsp;&nbsp;
            <Chip 
              variant="outlined"
              label={`${toEtherString(rocketpoolValue.nodeStatus?.accountBalances.rpl ?? 0)} RPL`}  />
          </Box>
        )}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 3 }}>
            <Box sx={{ width: "80%", maxWidth: 850, borderRadius: "3em", border: "1px solid black", padding: 3 }}>
              <div className="content">
                {activeTab === "Setup" && <SetupTab onRefreshRockpoolData={refreshRocketpoolData} />}
                {activeTab === "Rewards" && <RewardsTab />}
                {activeTab === "Info" && <InfoTab />}
              </div>
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default Dashboard;
