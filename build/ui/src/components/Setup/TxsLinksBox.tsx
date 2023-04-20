import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "@mui/material";

function TxsLinksBox({ txs }: { txs: string[] }): JSX.Element {
  return (
    <div>
      {txs.map((tx, index) => (
        <Link
          href={`https://goerli.etherscan.io/tx/${tx}`}
          variant="subtitle1"
          underline="always"
          target="_blank"
          rel="noopener"
          key={index}
        >
          View transaction {index + 1} on Etherscan
          <OpenInNewIcon fontSize="inherit" />
          <br />
        </Link>
      ))}
    </div>
  );
}

export default TxsLinksBox;
