import { Alert, Card, CardHeader, Chip, IconButton } from "@mui/material";
import { toEtherString } from "../../utils/Utils";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { RocketpoolContext } from "../Providers/Context";
import "./balanceBox.css";
import CopyableTextField from "./CopyableAddress";

function BalanceBox({
  setShowBalanceBox,
}: {
  setShowBalanceBox: (show: boolean) => void;
}): JSX.Element {
  const { rocketpoolValue } = React.useContext(RocketpoolContext);

  return (
    <Card className="dismissable-card" sx={{ boxShadow: 4, padding: 1 }}>
      <CardHeader
        title={"Balance"}
        action={
          <IconButton onClick={() => setShowBalanceBox(false)}>
            <CloseIcon />
          </IconButton>
        }
        titleTypographyProps={{ variant: "h6", color: "text.secondary" }}
        sx={{ marginY: -1.5 }}
      />

      <hr />

      {rocketpoolValue?.walletStatus?.accountAddress ? (
        <>
          <CopyableTextField
            value={rocketpoolValue?.walletStatus?.accountAddress}
            label="Address"
          />
          <Chip
            variant="outlined"
            label={`${toEtherString(
              rocketpoolValue?.nodeStatus?.accountBalances.eth ?? 0
            )} ETH`}
            sx={{ marginRight: 1 }}
          />
          <Chip
            variant="outlined"
            label={`${toEtherString(
              rocketpoolValue?.nodeStatus?.accountBalances.rpl ?? 0
            )} RPL`}
            sx={{ marginLeft: 1 }}
          />
        </>
      ) : (
        <Alert severity="error" variant="filled" sx={{ margin: 2 }}>
          No account address detected
        </Alert>
      )}
    </Card>
  );
}

export default BalanceBox;
