import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CanDeposit } from "../../types/CanDeposit";

function MinipoolEthToggle({
  minipoolEth,
  setMinipoolEth,
  setCanDeposit,
  refreshData,
}: {
  minipoolEth: 8 | 16;
  setMinipoolEth: (minipoolEth: 8 | 16) => void;
  setCanDeposit?: React.Dispatch<React.SetStateAction<CanDeposit | undefined>>;
  refreshData?: (selectedEth: number) => void;
}): JSX.Element {
  const handleMinipoolEthChange = (
    event: React.MouseEvent<HTMLElement>,
    newMinipoolEth: string
  ) => {
    const minipoolEth = Number(newMinipoolEth);

    if (minipoolEth === 8 || minipoolEth === 16) {
      setMinipoolEth(minipoolEth);
      setCanDeposit && setCanDeposit(undefined);
      refreshData && refreshData(minipoolEth);
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={minipoolEth.toString()}
      exclusive
      onChange={handleMinipoolEthChange}
      aria-label="minipool"
      className="minipool-eth-button-group"
    >
      <ToggleButton
        value="8"
        aria-label="8 ETH"
        className="minipool-eth-left-button"
      >
        8 ETH
      </ToggleButton>
      <ToggleButton
        value="16"
        aria-label="16 ETH"
        className="minipool-eth-right-button"
      >
        16 ETH
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default MinipoolEthToggle;
