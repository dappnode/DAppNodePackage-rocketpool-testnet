import React, { useState, useEffect } from "react";
import { Typography, Button, Box, Grid, CircularProgress, Link } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import { AppService } from "../../services/AppService";
import { RocketpoolData } from "../../types/RocketpoolData";
import { toEther } from "../../utils/Utils";
import { MinipoolStatus } from "../../types/MinipoolStatus";
import MinipoolCard from "./MinipoolCard";

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
        console.log("minipool details")
        fetchData();
    }, []);

    return (
        <Box>
            <div>
                <Button disabled={isLoading} variant="contained" endIcon={<AddIcon />} onClick={() => onAddMinipoolClick(true)} >
                    Add Minipool
                </Button>
            </div>
            {isLoading && <CircularProgress sx={{ marginTop: 1 }} />}
            <Grid container sx={{ display: "flex", justifyContent: "center", marginTop: 2, width: "100%" }}>
                {minipoolStatus?.minipools.map((minipool) => (
                    <MinipoolCard data={minipool} />
                ))}
            </Grid>
            {minipoolStatus?.error && (<Typography variant="body1" sx={{ color:"red" }}>❗️{minipoolStatus?.error}</Typography>)}
            <Link href="http://brain.web3signer-prater.dappnode/" variant="subtitle1" underline="always" target="_blank" rel="noopener">
                Check your validator keys here
                <OpenInNewIcon fontSize="inherit" />
            </Link>
            <Typography variant="subtitle1" sx={{ marginTop: 2 }} >
                You can backup your wallet and validator keys at any time at
            </Typography>
            <Link href="http://my.dappnode/#/packages/rocketpool-testnet.public.dappnode.eth/backup" variant="subtitle1" underline="always" target="_blank" rel="noopener">
                http://my.dappnode/#/packages/rocketpool-testnet.public.dappnode.eth/backup
                <OpenInNewIcon fontSize="inherit" />
            </Link>
        </Box>
    );
}

export default MinipoolDetails;