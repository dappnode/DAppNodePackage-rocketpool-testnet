import React from 'react';
import { RocketpoolData } from "../../types/RocketpoolData";

interface RocketpoolState {
  rocketpoolValue?: RocketpoolData;
  updateRocketpoolValue: (newValue: RocketpoolData) => void;
}

export const RocketpoolContext = React.createContext<RocketpoolState>({
  rocketpoolValue: undefined,
  updateRocketpoolValue: () => {},
});

interface Props {
    children: React.ReactNode
}

export const RocketpoolProvider: React.FC<Props> = ({ children }) => {
  const [rocketpoolValue, setRocketpoolValue] = React.useState<RocketpoolData>();

  const updateRocketpoolValue = (newValue: RocketpoolData) => {
    setRocketpoolValue(newValue);
  };

  const state: RocketpoolState = {
    rocketpoolValue,
    updateRocketpoolValue,
  };

  return <RocketpoolContext.Provider value={state}>{children}</RocketpoolContext.Provider>;
};