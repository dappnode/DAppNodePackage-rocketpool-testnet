import { Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";

function MinipoolActions({
  onAddMinipoolClick,
  isLoading,
}: {
  onAddMinipoolClick: (add: boolean) => void;
  isLoading: boolean;
}) {
  return (
    <>
      <div className="button-container">
        <Button
          disabled={isLoading}
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => onAddMinipoolClick(true)}
        >
          Add Minipool
        </Button>
      </div>
      <div className="button-container">
        <Button
          href="http://brain.web3signer-prater.dappnode/"
          variant="contained"
          color="primary"
          target="_blank"
          rel="noopener"
          endIcon={<OpenInNewIcon />}
        >
          Check validators
        </Button>
      </div>
      <div className="button-container">
        <Button
          href="http://my.dappnode/#/packages/rocketpool-testnet.public.dappnode.eth/backup"
          variant="contained"
          color="primary"
          target="_blank"
          rel="noopener"
          endIcon={<OpenInNewIcon />}
        >
          Backup
        </Button>
      </div>
    </>
  );
}

export default MinipoolActions;
