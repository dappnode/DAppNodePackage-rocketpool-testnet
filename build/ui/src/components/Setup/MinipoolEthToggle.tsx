import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CanDeposit } from "../../types/CanDeposit";

export type ValidatorDepositMode = "megapool" | "8" | "16";

function MinipoolEthToggle({
  depositMode,
  setDepositMode,
  setCanDeposit,
  refreshData,
  includeMegapool = true,
  includeLegacyMinipools = true,
}: {
  depositMode: ValidatorDepositMode;
  setDepositMode: (depositMode: ValidatorDepositMode) => void;
  setCanDeposit?: React.Dispatch<React.SetStateAction<CanDeposit | undefined>>;
  refreshData?: (selectedMode: ValidatorDepositMode) => void;
  includeMegapool?: boolean;
  includeLegacyMinipools?: boolean;
}): JSX.Element {
  const handleMinipoolEthChange = (
    event: React.MouseEvent<HTMLElement>,
    newDepositMode: ValidatorDepositMode | null
  ) => {
    if (newDepositMode) {
      setDepositMode(newDepositMode);
      setCanDeposit && setCanDeposit(undefined);
      refreshData && refreshData(newDepositMode);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={depositMode}
      exclusive
      onChange={handleMinipoolEthChange}
      aria-label="minipool"
      className="minipool-eth-button-group"
    >
      {includeMegapool && (
        <ToggleButton
          value="megapool"
          aria-label="4 ETH megapool validator"
          className="minipool-eth-left-button"
        >
          4 ETH Megapool
        </ToggleButton>
      )}
      {includeLegacyMinipools && (
        <ToggleButton
          value="8"
          aria-label="8 ETH minipool"
          className={includeMegapool ? undefined : "minipool-eth-left-button"}
        >
          8 ETH Minipool
        </ToggleButton>
      )}
      {includeLegacyMinipools && (
        <ToggleButton
          value="16"
          aria-label="16 ETH minipool"
          className="minipool-eth-right-button"
        >
          16 ETH Minipool
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  );
}

export default MinipoolEthToggle;
