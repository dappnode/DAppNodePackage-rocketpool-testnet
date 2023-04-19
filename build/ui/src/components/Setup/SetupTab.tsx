import React, { useState, useEffect } from "react";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import WalletInit from "./WalletInit";
import RegisterNode from "./RegisterNode";
import Minipools from "./Minipools";
import { RocketpoolContext } from "../Providers/Context";
import "./setupTab.css";

interface SetupTabProps {
  onRefreshRockpoolData: () => void;
}

enum SetupSteps {
  WalletInit = "WalletInit",
  RegisterNode = "RegisterNode",
  Minipools = "Minipools",
}

const steps = [
  {
    label: "Wallet Init",
  },
  {
    label: "Register Node",
  },
  {
    label: "Minipools",
  },
];

const SetupTab: React.FC<SetupTabProps> = ({
  onRefreshRockpoolData,
}): JSX.Element => {
  const [activeStep, setActiveStep] = useState<SetupSteps>(
    SetupSteps.WalletInit
  );
  const { rocketpoolValue } = React.useContext(RocketpoolContext);

  const handleActiveTab = (tab: SetupSteps) => {
    setActiveStep(tab);
  };

  useEffect(() => {
    if (!rocketpoolValue?.walletStatus?.walletInitialized) {
      handleActiveTab(SetupSteps.WalletInit);
    } else if (
      rocketpoolValue?.walletStatus?.walletInitialized &&
      !rocketpoolValue?.nodeStatus?.registered
    ) {
      handleActiveTab(SetupSteps.RegisterNode);
    } else if (
      rocketpoolValue?.walletStatus?.walletInitialized &&
      rocketpoolValue?.nodeStatus?.registered
    ) {
      handleActiveTab(SetupSteps.Minipools);
    }
  }, [rocketpoolValue]);

  return (
    <div className="container">
      <Box className="stepper-container">
        <Stepper
          activeStep={Object.keys(SetupSteps).indexOf(activeStep)}
          orientation="vertical"
        >
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel
                componentsProps={{ label: { style: { fontSize: "1.3rem" } } }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box className="step-content">
        {activeStep === "WalletInit" && <WalletInit />}
        {activeStep === "RegisterNode" && (
          <RegisterNode
            data={rocketpoolValue}
            onRefreshRockpoolData={onRefreshRockpoolData}
          />
        )}
        {activeStep === "Minipools" && <Minipools data={rocketpoolValue} />}
      </Box>
    </div>
    /*<div
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
    </div>*/
  );
};

export default SetupTab;
