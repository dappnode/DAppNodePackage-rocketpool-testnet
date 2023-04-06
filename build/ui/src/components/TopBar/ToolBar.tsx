import Toolbar from "@mui/material/Toolbar";
import { Box, Chip, Grid, Typography, ButtonGroup, Button } from "@mui/material";

import { Network } from "../../types/Network";
import { NodeSync } from "../../types/NodeSync";
import { RocketpoolData } from "../../types/RocketpoolData";

const pages = [ "Setup", "Rewards", "Info" ];

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

  return (
    <Toolbar>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          lineHeight: "50px",
        }}
      >
        <img src="/assets/rocketpool_logo.png" alt="logo" height={50} />
        &nbsp;&nbsp;
        <p>Rocket Pool</p>
        {data?.network && (
          <>
            &nbsp;&nbsp;
            <Chip color="secondary" label={data?.network} />
          </>
        )}
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
          {pages.map((page) => (
            <Button onClick={() => handleTabClick(page)}>
            {page}
          </Button>
          ))}
        </ButtonGroup>
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
          <Grid container direction="column">
            <Grid item>
              <Grid container spacing={0.5}>
                <Grid item>
                  <Chip 
                    label={`Execution client`}
                    sx={{ backgroundColor: ecSynced ? "#81C784": "#E57373" }}
                  />
                </Grid>
                <Grid item>
                  <Chip 
                    label={`Consensus client`} 
                    sx={{ backgroundColor: bcSynced ? "#81C784": "#E57373" }}
                  />
                </Grid>
                {data?.nodeStatus?.isAtlasDeployed && (
                  <Grid item>
                    <Chip
                      label={`Atlas`}
                      sx={{ backgroundColor: "#81C784" }}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Typography variant="body1"></Typography>
          </Grid>
        </Box>
      </div>
    </Toolbar>
  );
}
