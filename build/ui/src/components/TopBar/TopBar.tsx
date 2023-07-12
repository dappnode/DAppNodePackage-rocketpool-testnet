import React from "react";
import { AppBar } from "@mui/material";
import ToolBar from "./ToolBar";
import { RocketpoolContext } from "../Providers/Context";
import { Tab } from "../../types/Tabs";

export default function TopBar({
  onTabClick,
}: {
  onTabClick: (tab: Tab) => void;
}): JSX.Element {
  const { rocketpoolValue } = React.useContext(RocketpoolContext);

  return (
    <AppBar position="static">
      <ToolBar data={rocketpoolValue} onTabClick={onTabClick} />
    </AppBar>
  );
}
