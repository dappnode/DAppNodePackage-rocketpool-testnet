import shelljs from "shelljs";

interface Config {
  network: string;
  brainAPIUrl: string;
  brainUIUrl: string;
  w3sUrl: string;
  rpExplorerNodeUrl: string;
  explorerUrl: string;
  package: string;
}

class AppConfig {
  private static instance: AppConfig;
  private config: Config;

  private constructor() {
    const network = shelljs.exec(`echo $NETWORK`).stdout.trim() || "prater";
    const isMainnet = network === "mainnet";
    const w3sSuffix = isMainnet ? "" : "-prater";
    const clPrefix = isMainnet ? "" : "prater.";
    const elPrefix = isMainnet ? "" : "goerli.";
    this.config = {
      network: network,
      brainAPIUrl: `http://brain.web3signer${w3sSuffix}.dappnode:3000`,
      brainUIUrl: `http://brain.web3signer${w3sSuffix}.dappnode:3000`,
      w3sUrl: `http://web3signer.web3signer${w3sSuffix}.dappnode:9000`,
      rpExplorerNodeUrl: `https://${clPrefix}rocketscan.io`,
      explorerUrl: `https://${elPrefix}etherscan.io`,
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