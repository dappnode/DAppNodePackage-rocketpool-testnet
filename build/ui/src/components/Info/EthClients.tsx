import { Alert, Box, Card, Container, Typography } from "@mui/material";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import React, { useEffect, useState } from "react";
import { RocketpoolContext } from "../Providers/Context";
import { WaitResponse } from "../../types/WaitResponse";
import { AppService } from "../../services/AppService";

function EthClients(): JSX.Element {
  const { rocketpoolValue } = React.useContext(RocketpoolContext);
  const [w3sStatusResponse, setW3sStatusResponse] = useState<WaitResponse>();
  const appService = new AppService();

  async function fetchData() {
    const w3sStatus = await appService.getW3sStatus();
    setW3sStatusResponse(w3sStatus);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function EcStatusComponent(): JSX.Element {
    const isEcSynced =
      rocketpoolValue?.nodeSync?.ecStatus.primaryEcStatus.isSynced || false;

    const ecSyncProgress =
      rocketpoolValue?.nodeSync?.ecStatus.primaryEcStatus.syncProgress || 0;

    return statusComponent({
      isSynced: isEcSynced,
      SyncPrgress: ecSyncProgress,
    });
  }

  function CcStatusComponent(): JSX.Element {
    const isCcSynced =
      rocketpoolValue?.nodeSync?.bcStatus.primaryEcStatus.isSynced || false;

    const ccSyncProgress =
      rocketpoolValue?.nodeSync?.bcStatus.primaryEcStatus.syncProgress || 0;

    return statusComponent({
      isSynced: isCcSynced,
      SyncPrgress: ccSyncProgress,
    });
  }

  function SignerStatusComponent(): JSX.Element {
    const isSignerOnline = w3sStatusResponse?.status === "success";

    return statusComponent({
      isSynced: isSignerOnline,
      SyncPrgress: 1,
      isWeb3Signer: true,
    });
  }

  function statusComponent({
    isSynced,
    SyncPrgress,
    isWeb3Signer,
  }: {
    isSynced: boolean;
    SyncPrgress: number;
    isWeb3Signer?: boolean;
  }): JSX.Element {
    // Return a green power icon that says sycned if the client is synced
    // Return a red power off icon that says not synced if the client is not synced and put the

    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {isSynced ? (
          <PowerIcon sx={{ fontSize: 24, color: "green" }} />
        ) : (
          <PowerOffIcon sx={{ fontSize: 24, color: "red" }} />
        )}
        <Typography sx={{ fontSize: 16 }}>
          {isWeb3Signer
            ? isSynced
              ? "Connected"
              : "Not Connected"
            : isSynced
            ? `Synced (${SyncPrgress * 100}%)`
            : `Not Synced (${SyncPrgress * 100}%)`}
        </Typography>
      </div>
    );
  }

  return (
    <Container>
      <Card
        sx={{
          p: 2,
          mt: 2,
          border: "none",
          boxShadow: "none",
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Card
              sx={{
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontWeight: "bold", p: 2 }}>
                  Execution Client
                </Typography>
                <EcStatusComponent />
              </div>
            </Card>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <SyncAltRoundedIcon sx={{ mb: 4, fontSize: 48 }} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Card
              sx={{
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontWeight: "bold", p: 2 }}>
                  Consensus Client
                </Typography>
                <CcStatusComponent />
              </div>
            </Card>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TrendingFlatRoundedIcon sx={{ mb: 4, fontSize: 48 }} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Card
              sx={{
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ fontWeight: "bold", p: 2 }}>
                  Signer
                </Typography>
                <SignerStatusComponent />
              </div>
            </Card>
          </Box>
        </Box>
      </Card>
      {w3sStatusResponse?.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {w3sStatusResponse?.error}
        </Alert>
      )}
    </Container>
  );
}

export default EthClients;
