import React, { useState } from "react";
import "./App.css";
import TopBar from "./components/TopBar/TopBar";
import Dashboard from "./Dashboard";
import { RocketpoolProvider } from "./components/Providers/Context";
import { Tab } from "./types/Tabs";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("Setup");

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
  };
  return (
    <RocketpoolProvider>
      <div className="App">
        <header className="App-header">
          <TopBar onTabClick={(tab: Tab) => handleTabClick(tab)} />
          <Dashboard activeTab={activeTab} />
        </header>
      </div>
    </RocketpoolProvider>
  );
}

export default App;
