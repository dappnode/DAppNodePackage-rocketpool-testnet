import { Box } from "@mui/system";
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
          Exiting Minipool #{data.validator.index}
          <p>
            To stop running a minipool and access the full balance locked on the
            Beacon Chain, the following steps must be taken:
            <ol>
              <li>
                Send a voluntary exit request for the minipool's validator from
                the Beacon Chain.
              </li>
              <li>Wait for your validator to exit.</li>
              <li>
                Wait for your validator's balance to be withdrawn to your
                minipool on the Execution layer.
              </li>
              <li>
                Close the minipool to distribute the rewards and access the
                funds.
              </li>
            </ol>
            In this Dappnode Package, you can do this by:
            <ol>
              <li>Clicking the "Exit" button on the right</li>
              <li>
                Wait until the validator has exited. You can check its status in
                INSERT_URL_HERE
              </li>
              <li>
                Once the validator has exited, click the "Close" button on the
                right
              </li>
              <li>
                When the minipool reaches finalized state (INSERT_URL_HERE), you
                can withdraw the funds by clicking the "Withdraw" button on the
                right
              </li>
            </ol>
          </p>
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
