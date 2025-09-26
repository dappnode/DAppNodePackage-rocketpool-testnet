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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            justifyContent: "center",
            gap: { xs: 1.5, sm: 0.8, md: 0.6 },
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
            "& > *": {
              flex: { xs: "1 1 100%", sm: "0 0 auto" },
              minWidth: { xs: "100%", sm: "140px", md: "150px" },
              maxWidth: { xs: "100%", sm: "160px", md: "170px" },
            },
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
                borderRadius: 1.5,
                p: { xs: 1.2, sm: 1.2, md: 1.3 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                minHeight: { xs: "auto", sm: "85px", md: "90px" },
                boxShadow: { xs: 1, sm: 1.5 },
              }}
            >
              <div style={{ alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ 
                  fontWeight: "bold", 
                  pb: { xs: 1, sm: 1.2 }, 
                  px: 0.5,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" }
                }}>
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
              justifyContent: "center",
              minHeight: { xs: "40px", sm: "70px", md: "75px" },
            }}
          >
            <SyncAltRoundedIcon sx={{ mb: { xs: 1.7, sm: 3.4, md: 3.6 }, fontSize: { xs: 27, sm: 41, md: 43 } }} />
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
                borderRadius: 1.5,
                p: { xs: 1.2, sm: 1.2, md: 1.3 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                minHeight: { xs: "auto", sm: "85px", md: "90px" },
                boxShadow: { xs: 1, sm: 1.5 },
              }}
            >
              <div style={{ alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ 
                  fontWeight: "bold", 
                  pb: { xs: 1, sm: 1.2 }, 
                  px: 0.5,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" }
                }}>
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
              justifyContent: "center",
              minHeight: { xs: "40px", sm: "70px", md: "75px" },
            }}
          >
            <TrendingFlatRoundedIcon sx={{ mb: { xs: 1.7, sm: 3.4, md: 3.6 }, fontSize: { xs: 27, sm: 41, md: 43 } }} />
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
                borderRadius: 1.5,
                p: { xs: 1.2, sm: 1.2, md: 1.3 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                minHeight: { xs: "auto", sm: "85px", md: "90px" },
                boxShadow: { xs: 1, sm: 1.5 },
              }}
            >
              <div style={{ alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ 
                  fontWeight: "bold", 
                  pb: { xs: 1, sm: 1.2 }, 
                  px: 0.5,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" }
                }}>
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
