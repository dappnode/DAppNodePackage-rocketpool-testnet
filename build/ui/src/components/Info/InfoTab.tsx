import React from "react";
import { Typography, Box, Card, Chip, Link, Container } from "@mui/material";
import { RocketpoolContext } from "../Providers/Context";
import "./infoTab.css";
import EthClients from "./EthClients";
import CopyableTextField from "../BalanceBox/CopyableAddress";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

interface InfoTabProps {}

const InfoTab: React.FC<InfoTabProps> = (): JSX.Element => {
  const { rocketpoolValue } = React.useContext(RocketpoolContext);

  function FeeDistributorSP(): JSX.Element {
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
                  <Typography sx={{ fontWeight: "bold", pb: 2, px: 1 }}>
                    Smoothing Pool
                  </Typography>

                  {rocketpoolValue?.nodeStatus?.feeRecipientInfo
                    .isInSmoothingPool ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <TaskAltIcon sx={{ color: "green" }} />
                      <Typography sx={{ fontSize: 16 }}>Active</Typography>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <CloseIcon sx={{ color: "red" }} />
                      <Typography sx={{ fontSize: 16 }}>Inactive</Typography>
                    </div>
                  )}
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
                  <Typography sx={{ fontWeight: "bold", pb: 2, px: 1 }}>
                    Fee Distributor
                  </Typography>

                  {rocketpoolValue?.nodeStatus?.isFeeDistributorInitialized ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <TaskAltIcon sx={{ color: "green" }} />
                      <Typography sx={{ fontSize: 16 }}>Initialized</Typography>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <CloseIcon sx={{ color: "red" }} />
                      <Typography sx={{ fontSize: 16 }}>
                        Uninitialized
                      </Typography>
                    </div>
                  )}
                </div>
              </Card>
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }

  function TimeZoneMinipools(): JSX.Element {
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
                  <Typography sx={{ fontWeight: "bold", pb: 2, px: 1 }}>
                    Timezone
                  </Typography>

                  {rocketpoolValue?.nodeStatus?.timezoneLocation ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Typography sx={{ fontSize: 16 }}>
                        {rocketpoolValue?.nodeStatus?.timezoneLocation.toUpperCase()}
                      </Typography>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <QuestionMarkIcon sx={{ color: "gray" }} />
                    </div>
                  )}
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
                  <Typography sx={{ fontWeight: "bold", pb: 2, px: 1 }}>
                    Minipools
                  </Typography>

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Typography sx={{ fontSize: 20 }}>
                      {rocketpoolValue?.nodeStatus?.minipoolCounts?.total}
                    </Typography>
                  </div>
                </div>
              </Card>
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Node Info
      </Typography>

      <Card
        className="network-card"
        sx={{
          borderRadius: 2,
          border: "none",
          boxShadow: "none",
          backgroundColor: "transparent",
          backgroundImage: "none",
        }}
      >
        <div className="center-elements">
          {/*<Chip
            label={rocketpoolValue?.network?.toUpperCase()}
            sx={{ fontWeight: "bold" }}
      />*/}
          <EthClients />
        </div>
      </Card>

      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        <CopyableTextField
          value={rocketpoolValue?.nodeStatus?.accountAddress || ""}
          label="Node Address"
        />
        <Link
          href={`${rocketpoolValue?.config?.rpExplorerUrl}/node/${rocketpoolValue?.nodeStatus?.accountAddress}`}
          target="_blank"
          rel="noopener"
        >
          View node in Rocket Pool Explorer
          <OpenInNewIcon fontSize="inherit" />
          <br />
        </Link>
        <TimeZoneMinipools />
        <br />
        <CopyableTextField
          value={
            rocketpoolValue?.nodeStatus?.feeRecipientInfo
              .smoothingPoolAddress || ""
          }
          label="Smoothing pool address"
        />
        <CopyableTextField
          value={rocketpoolValue?.nodeStatus?.withdrawalAddress || ""}
          label="Withdrawal address"
        />
      </Typography>

      <FeeDistributorSP />
    </Box>
  );
};

export default InfoTab;
