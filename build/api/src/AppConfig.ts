import shelljs from "shelljs";

interface Config {
  network: string;
  brainAPIUrl: string;
  brainUIUrl: string;
  w3sUrl: string;
  rpExplorerUrl: string;
  explorerUrl: string;
  package: string;
}

class AppConfig {
  private static instance: AppConfig;
  private config: Config;

  private constructor() {
    const network = shelljs.exec(`echo $NETWORK`).stdout.trim() || "holesky";
    const isMainnet = network === "mainnet";
    const w3sSuffix = isMainnet ? "" : "-holesky";
    const networkPrefix = isMainnet ? "" : "holesky.";
    this.config = {
      network: network,
      brainAPIUrl: `http://brain.web3signer${w3sSuffix}.dappnode:3000`,
      brainUIUrl: `http://brain.web3signer${w3sSuffix}.dappnode`,
      w3sUrl: `http://web3signer.web3signer${w3sSuffix}.dappnode:9000`,
      rpExplorerUrl: `https://${networkPrefix}rocketscan.io`,
      explorerUrl: `https://${networkPrefix}etherscan.io`,
      package: isMainnet ? `rocketpool.public.dappnode` : `rocketpool-testnet.public.dappnode`,
    };
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public getConfig(): Config {
    return this.config;
  }
}
const appConfig = AppConfig.getInstance();
export default appConfig;