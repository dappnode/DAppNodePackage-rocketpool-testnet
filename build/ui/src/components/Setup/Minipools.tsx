import React, { useState, useEffect } from "react";
import { Typography, Button, Box } from "@mui/material";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import CreateMinipool from "./CreateMinipool";
import MinipoolDetails from "./MinipoolDetails";

interface MinipoolsProps {
  data?: RocketpoolData;
}

const Minipools: React.FC<MinipoolsProps> = ({
    data,
}): JSX.Element => {
    const [isCreatingMinipool, setIsCreatingMinipool] = useState<boolean>(false);
    const appService = new AppService();

    const addMinipoolClick = (add: boolean) => {
        setIsCreatingMinipool(add);
    };

    async function fetchData() {
        var allowance = await appService.getNodeStakeRplAllowance();
    }

    useEffect(() => {
        console.log("minipools")
        setIsCreatingMinipool((data?.nodeStatus?.minipoolCounts.total ?? 0) === 0)
    }, []);

    return (
        <Box>
            {isCreatingMinipool && <CreateMinipool data={data} onAddMinipoolClick={addMinipoolClick} />}
            {!isCreatingMinipool && <MinipoolDetails data={data} onAddMinipoolClick={addMinipoolClick} />}
        </Box>
    );
}

export default Minipools;
