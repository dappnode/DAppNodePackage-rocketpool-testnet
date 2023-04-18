import React from "react";
import "./balanceButton.css";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function BalanceButton({
  setShowBalanceBox,
}: {
  setShowBalanceBox: (show: boolean) => void;
}): JSX.Element {
  return (
    <span className="round-button" onClick={() => setShowBalanceBox(true)}>
      <AccountBalanceWalletIcon />
    </span>
  );
}

export default BalanceButton;
