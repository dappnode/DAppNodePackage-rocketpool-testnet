import Toolbar from "@mui/material/Toolbar";
import { Box, Chip, ButtonGroup, Button, Tooltip } from "@mui/material";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { RocketpoolData } from "../../types/RocketpoolData";

const pages = ["Setup", "Rewards", "Info"];

export default function ToolBar({
  data,
  onTabClick,
}: {
  data?: RocketpoolData;
  onTabClick: (tab: string) => void;
}): JSX.Element {
  const ecSynced = data?.nodeSync?.ecStatus.primaryEcStatus.isSynced;
  const bcSynced = data?.nodeSync?.bcStatus.primaryEcStatus.isSynced;

  const handleTabClick = (tab: any) => {
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
    <Toolbar>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          lineHeight: "1rem",
        }}
      >
        <img src="/assets/rocketpool_logo.png" alt="logo" height={40} />
        &nbsp;&nbsp;
        <p>
          <b>Rocket Pool</b>
        </p>
        {data?.network && (
          <>
            &nbsp;&nbsp;
            <Chip color="secondary" label={data?.network} />
          </>
        )}
      </div>
      <div style={{ marginLeft: "auto" }}>
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
      </div>
      <div style={{ paddingLeft: 20 }}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          sx={{
            // Align center horizontally
            display: "flex",
            justifyContent: "center",
          }}
        >
          {pages.map((page, index) => (
            <Button key={index} onClick={() => handleTabClick(page)}>
              <b>{page}</b>
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </Toolbar>
  );
}
