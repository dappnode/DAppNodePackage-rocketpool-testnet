import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import WalletInit from "./WalletInit";
import RegisterNode from "./RegisterNode";
import Minipools from "./Minipools";
import { RocketpoolContext } from "../Providers/Context";

interface SetupTabProps {
  onRefreshRockpoolData: () => void;
}

const SetupTab: React.FC<SetupTabProps> = ({
  onRefreshRockpoolData,
}): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>();
  const { rocketpoolValue } = React.useContext(RocketpoolContext);

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    if (!rocketpoolValue?.walletStatus?.walletInitialized) {
      handleActiveTab("WalletInit");
    } else if (
      rocketpoolValue?.walletStatus?.walletInitialized &&
      !rocketpoolValue?.nodeStatus?.registered
    ) {
      handleActiveTab("RegisterNode");
    } else if (
      rocketpoolValue?.walletStatus?.walletInitialized &&
      rocketpoolValue?.nodeStatus?.registered
    ) {
      handleActiveTab("Minipools");
    }
  }, [rocketpoolValue]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        height: "100vh",
      }}
    >
      <div className="menu">
        <div
          className={`menu-item ${
            activeTab === "WalletInit" ? "selected" : ""
          }`}
        >
          Init wallet
        </div>
        <div
          className={`menu-item ${
            activeTab === "RegisterNode" ? "selected" : ""
          }`}
        >
          Register node
        </div>
        <div
          className={`menu-item ${activeTab === "Minipools" ? "selected" : ""}`}
        >
          Minipools
        </div>
      </div>
      <Box className="detail">
        {activeTab === "WalletInit" && <WalletInit />}
        {activeTab === "RegisterNode" && (
          <RegisterNode
            data={rocketpoolValue}
            onRefreshRockpoolData={onRefreshRockpoolData}
          />
        )}
        {activeTab === "Minipools" && <Minipools data={rocketpoolValue} />}
      </Box>
    </div>
  );
};

export default SetupTab;
