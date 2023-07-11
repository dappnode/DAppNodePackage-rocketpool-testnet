import React, { useState, useEffect } from "react";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import CreateMinipool from "./CreateMinipool";
import MinipoolDetails from "./MinipoolDetails";
import { Minipool } from "../../types/MinipoolStatus";
import ExitMinipool from "./ExitMinipool";

interface MinipoolsProps {
  data?: RocketpoolData;
}

const Minipools: React.FC<MinipoolsProps> = ({ data }): JSX.Element => {
  const [isCreatingMinipool, setIsCreatingMinipool] = useState<boolean>(false);
  const [minipoolToExit, setMinipoolToExit] = useState<Minipool | undefined>(
    undefined
  );

  const appService = new AppService();

  const addMinipoolClick = (add: boolean) => {
    setIsCreatingMinipool(add);
  };

  async function fetchData() {
    var allowance = await appService.getNodeStakeRplAllowance();
  }

  useEffect(() => {
    setIsCreatingMinipool((data?.nodeStatus?.minipoolCounts.total ?? 0) === 0);
  }, []);

  return (
    <>
      {minipoolToExit ? (
        <ExitMinipool data={minipoolToExit} />
      ) : isCreatingMinipool ? (
        <CreateMinipool data={data} onAddMinipoolClick={addMinipoolClick} />
      ) : (
        <MinipoolDetails
          data={data}
          onAddMinipoolClick={addMinipoolClick}
          setMinipoolToExit={setMinipoolToExit}
        />
      )}
    </>
  );
};

export default Minipools;
