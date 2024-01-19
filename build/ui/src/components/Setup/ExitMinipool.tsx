import { Box, Typography } from "@mui/material";
import { Minipool } from "../../types/MinipoolStatus";
import MinipoolCard from "./MinipoolCard";

function ExitMinipool({
  data,
  rpExplorerUrl,
}: {
  data: Minipool;
  rpExplorerUrl?: string;
}): JSX.Element {
  return (
    <div className="minipool-container">
      <div className="validators-container">
        <div className="exit-info">
          <Typography variant="h5">
            Exiting Minipool #{data.validator.index}
          </Typography>
          <Typography variant="body1">
            To stop running a minipool and access the full balance locked on the
            Beacon Chain, follow the steps below:
          </Typography>
          <Box component="ol" sx={{ pl: 2, mt: 1 }}>
            <Typography variant="body1">
              <b>1. Initiate exit:</b> Click the "Exit" button on the right to
              send a voluntary exit for the minipool's validator to the beacon
              chain.
            </Typography>
            <Typography variant="body1">
              <b>2. Wait for Exit:</b> Wait until the validator has exited. You
              can check its status at [INSERT URL HERE] (beaconcha.in +
              validator pk).
            </Typography>
            <Typography variant="body1">
              <b>3. Wait for Funds:</b> Wait until the minipool balance is sent
              to your minipool address (withdrawable epoch reached).
            </Typography>
            <Typography variant="body1">
              <b>4. Finalize Exit:</b> Once the validator has exited, click the
              "Close" button on the right.
            </Typography>
            <Typography variant="body1">
              <b>5. Wait for minipool finalization:</b> Wait for the transaction
              to be validated (check here). ETH will be refunded to your
              withdrawal address, and the minipool will change to a finalized
              state.
            </Typography>
            <Typography variant="body1">
              <b>6. Withdraw RPL:</b> Now, you can withdraw the staked RPL by
              clicking on "Withdraw RPL".
            </Typography>
          </Box>
        </div>
        <div className="exit-minipool-card-container">
          <MinipoolCard
            data={data}
            rpExplorerUrl={rpExplorerUrl}
            hideActions={true}
          />
        </div>
      </div>
      <div className="actions-container">Actions</div>
    </div>
  );
}

export default ExitMinipool;
