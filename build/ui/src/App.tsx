import React, { useState } from "react";
import "./App.css";
import TopBar from "./components/TopBar/TopBar";
import Dashboard from "./Dashboard";
import { RocketpoolProvider } from "./components/Providers/Context";

function App() {
  const [activeTab, setActiveTab] = useState<string>("Setup");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <RocketpoolProvider>
      <div className="App">
        <header className="App-header">
          <TopBar onTabClick={(tab: string) => handleTabClick(tab)} />
          <Dashboard activeTab={activeTab} />
        </header>
      </div>
    </RocketpoolProvider>
  );
}

export default App;
