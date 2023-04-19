import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, CircularProgress, Alert } from "@mui/material";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import { MinipoolStatus } from "../../types/MinipoolStatus";
import MinipoolCard from "./MinipoolCard";
import "./miniPool.css";
import MinipoolActions from "./MinipooActions";

interface MinipoolDetailsProps {
  data?: RocketpoolData;
  onAddMinipoolClick: (add: boolean) => void;
}

const MinipoolDetails: React.FC<MinipoolDetailsProps> = ({
  data,
  onAddMinipoolClick,
}): JSX.Element => {
  const [minipoolStatus, setMinipoolStatus] = useState<MinipoolStatus>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const appService = new AppService();

  async function fetchData() {
    setIsLoading(true);
    var minipoolStatus = await appService.getNodeMinipoolStatus();
    setMinipoolStatus(minipoolStatus);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="minipool-container">
      <div className="validators-container">
        <Box>
          {isLoading && <CircularProgress sx={{ marginTop: 1 }} />}
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: 2,
              width: "100%",
            }}
          >
            {minipoolStatus?.minipools.map((minipool, index) => (
              <MinipoolCard data={minipool} key={index} />
            ))}
          </Grid>
          {minipoolStatus?.error && (
            <Alert variant="filled" severity="error">
              {minipoolStatus?.error}
            </Alert>
          )}
        </Box>
      </div>
      <div className="actions-container">
        <MinipoolActions
          onAddMinipoolClick={onAddMinipoolClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MinipoolDetails;
