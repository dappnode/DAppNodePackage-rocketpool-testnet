import Toolbar from "@mui/material/Toolbar";
import { Box, Chip, ButtonGroup, Button, Tooltip } from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { RocketpoolData } from "../../types/RocketpoolData";
import { Tab, tabs } from "../../types/Tabs";

export default function ToolBar({
  data,
  onTabClick,
}: {
  data?: RocketpoolData;
  onTabClick: (tab: Tab) => void;
}): JSX.Element {
  const ecSynced = data?.nodeSync?.ecStatus.primaryEcStatus.isSynced;
  const bcSynced = data?.nodeSync?.bcStatus.primaryEcStatus.isSynced;

  const handleTabClick = (tab: Tab) => {
    // setActiveTab(tab);
    onTabClick(tab);
  };

  function NotSyncedWarn() {
    const shouldDisplayWarning = !ecSynced || !bcSynced;

    function getNotSyncedMessage(): string {
      if (!ecSynced && !bcSynced) {
        return "Execution client and consensus client are not synced";
      } else if (!ecSynced) {
        return "Execution client is not synced";
      } else if (!bcSynced) {
        return "Consensus client is not synced";
      }
      return "";
    }

    return (
      <>
        {shouldDisplayWarning && (
          <Tooltip title={getNotSyncedMessage()}>
            <WarningRoundedIcon color="warning" fontSize="large" />
          </Tooltip>
        )}
      </>
    );
  }

  return (
    <Toolbar
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        padding: { xs: 1, sm: 2 },
        gap: { xs: 1, sm: 0 },
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          lineHeight: "1rem",
          flex: { xs: 1, sm: 0 },
        }}
      >
        <img 
          src="/assets/rocketpool_logo.png" 
          alt="logo" 
          height={40}
          style={{ maxHeight: "32px", width: "auto" }}
        />
        &nbsp;&nbsp;
        <p style={{ margin: 0, fontSize: "inherit" }}>
          <b>Rocket Pool</b>
        </p>
        {data?.network && (
          <>
            &nbsp;&nbsp;
            <Chip 
              color="secondary" 
              label={data?.network}
              size="small"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
            />
          </>
        )}
      </Box>
      <Box sx={{ 
        marginLeft: "auto", 
        display: "flex", 
        alignItems: "center", 
        gap: 2,
        flexDirection: { xs: "column", sm: "row" },
        width: { xs: "100%", sm: "auto" }
      }}>
        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", sm: "auto" },
              "& .MuiButton-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "4px 8px", sm: "6px 16px" },
                minWidth: { xs: "auto", sm: "64px" },
                flex: { xs: 1, sm: "none" },
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Button key={index} onClick={() => handleTabClick(tab)}>
                <b>{tab}</b>
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <Box
          sx={{
            padding: 0.5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NotSyncedWarn />
        </Box>
      </Box>
    </Toolbar>
  );
}
