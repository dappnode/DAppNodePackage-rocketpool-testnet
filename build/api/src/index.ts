import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import shelljs from "shelljs";
import cors from "cors";
import appConfig from "./AppConfig";
const { API_PORT = 3000, ROCKETPOOL_API_URL = "http://127.0.0.1:8280" } = process.env;

const ROCKETPOOL_SETTINGS = "/app/rocketpool/user-settings.yml";
const WEI_PER_ETH = BigInt("1000000000000000000");

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1/environment/:key", (req, res) => {
  const command = `echo $${req.params.key}`;
  const value = shelljs.exec(command).stdout.trim();
  const response = {
    value: value,
  };
  res.send(response);
});

app.get("/api/v1/config", (req, res) => {
  res.send(appConfig.getConfig());
});

app.get("/api/v1/w3s-status", async (req, res) => {
  try {
    const response = await fetch(
      `${appConfig.getConfig().w3sUrl}/upcheck`,
    );
    const responseOK = response.ok && response.statusText === "OK";
    const responseJson = {
      "status": responseOK ? "success" : "error",
      "error": !responseOK ? response.statusText : "",
    }
    res.send(responseJson);
  } catch (error) {
    console.log(error);
    const responseJson = {
      "status": "error",
      "error": "Web3Signer not available",
    }
    res.send(responseJson);
  }
});

app.get("/api/v1/version", async (req: Request, res: Response) => {
  res.send(await callRocketpoolApi("/api/version"));
});

app.get("/api/v1/megapool/next-validator-bond", async (req: Request, res: Response) => {
  try {
    const status = await callRocketpoolApi("/api/megapool/status");
    if (status.status !== "success") {
      res.send(status);
      return;
    }

    const megapool = status.megapoolDetails ?? {};
    const activeValidatorCount = Number(megapool.activeValidatorCount ?? 0);
    const nodeBond = BigInt(megapool.nodeBond ?? 0);
    const nodeQueuedBond = BigInt(megapool.nodeQueuedBond ?? 0);
    const bondedEth = nodeBond + nodeQueuedBond;

    const bondRequirement = await callRocketpoolApi(
      "/api/node/get-bond-requirement",
      { numValidators: String(activeValidatorCount + 1) }
    );
    if (bondRequirement.status !== "success") {
      res.send(bondRequirement);
      return;
    }

    let nextValidatorBond = BigInt(bondRequirement.bondRequirement ?? 0) - bondedEth;
    if (nextValidatorBond < WEI_PER_ETH) {
      nextValidatorBond = WEI_PER_ETH;
    }
    if (nextValidatorBond > BigInt(32) * WEI_PER_ETH) {
      nextValidatorBond = BigInt(32) * WEI_PER_ETH;
    }

    res.send({
      status: "success",
      error: "",
      bondRequirement: nextValidatorBond.toString(),
      activeValidatorCount,
      nodeBond: nodeBond.toString(),
      nodeQueuedBond: nodeQueuedBond.toString(),
      megapoolDeployed: megapool.deployed ?? false,
    });
  } catch (error) {
    console.log(error);
    res.send({ status: "error", error: String(error) });
  }
});

// POST /api/v1/rocketpool-command-custom
app.post("/api/v1/rocketpool-command-custom", async (req: Request, res: Response) => {
  console.log(req.body.cmd);
  // Keep the advanced shell as an explicit escape hatch for now, but use the
  // v1.20 CLI (no removed `api` subcommand). Main UI calls use the HTTP API.
  var result = shelljs.exec(
    `/usr/local/bin/rocketpool --settings ${ROCKETPOOL_SETTINGS} ${req.body.cmd}`
  ).stdout;
  res.send(result);
});

// POST /api/v1/rocketpool-command
app.post("/api/v1/rocketpool-command", async (req: Request, res: Response) => {
  console.log(req.body.cmd);
  res.send(await executeCommand(req.body.cmd));
});

async function executeCommand(cmd: string) {
  const resultJson = await executeRocketpoolCommand(cmd);
  if (resultJson.status == "success") {
    if (cmd.startsWith("node deposit")) {
      await executeCommand(`wait ${resultJson.txHash}`);
      const validatorPubkeys = resultJson.validatorPubkeys ?? [];
      for (const validatorPubkey of validatorPubkeys) {
        await importKey(ensureHexPrefix(validatorPubkey));
      }
    } else if (TX_COMMANDS.some((prefix) => cmd.startsWith(prefix)) && resultJson.txHash) {
      // Exit / distribute / claim-refund all broadcast an on-chain tx and
      // return a txHash; wait for it to be mined before reporting success.
      await executeCommand(`wait ${resultJson.txHash}`);
    }
  }
  return resultJson;
}

// Megapool commands that submit an on-chain transaction returning a txHash to wait on.
// (megapool exit-validator is a beacon voluntary exit and returns no txHash.)
const TX_COMMANDS = [
  "megapool exit-queue",
  "megapool notify-validator-exit",
  "megapool distribute",
  "megapool claim-refund",
];

async function executeRocketpoolCommand(cmd: string) {
  const parts = splitCommand(cmd);
  const [group, action, ...args] = parts;

  if (group === "wait") {
    return callRocketpoolApi("/api/wait", { txHash: action });
  }

  if (group === "wallet") {
    if (action === "status") return callRocketpoolApi("/api/wallet/status");
    if (action === "init") return callRocketpoolApi("/api/wallet/init", {}, "POST");
    if (action === "recover") return callRocketpoolApi("/api/wallet/recover", { mnemonic: args.join(" ") }, "POST");
  }

  if (group === "node") {
    if (action === "status") return callRocketpoolApi("/api/node/status");
    if (action === "sync") return callRocketpoolApi("/api/node/sync");
    if (action === "can-register") return callRocketpoolApi("/api/node/can-register", { timezoneLocation: args[0] });
    if (action === "register") return callRocketpoolApi("/api/node/register", { timezoneLocation: args[0] }, "POST");
    if (action === "can-set-primary-withdrawal-address") return callRocketpoolApi("/api/node/can-set-primary-withdrawal-address", { address: args[0], confirm: args[1] });
    if (action === "set-primary-withdrawal-address") return callRocketpoolApi("/api/node/set-primary-withdrawal-address", { address: args[0], confirm: args[1] }, "POST");
    if (action === "can-set-smoothing-pool-status") return callRocketpoolApi("/api/node/can-set-smoothing-pool-status", { status: args[0] });
    if (action === "set-smoothing-pool-status") return callRocketpoolApi("/api/node/set-smoothing-pool-status", { status: args[0] }, "POST");
    if (action === "stake-rpl-allowance") return callRocketpoolApi("/api/node/stake-rpl-allowance");
    if (action === "stake-rpl-approve-rpl") return callRocketpoolApi("/api/node/stake-rpl-approve-rpl", { amountWei: args[0] }, "POST");
    if (action === "can-stake-rpl") return callRocketpoolApi("/api/node/can-stake-rpl", { amountWei: args[0] });
    if (action === "stake-rpl") return callRocketpoolApi("/api/node/stake-rpl", { amountWei: args[0] }, "POST");
    if (action === "can-deposit") return callRocketpoolApi("/api/node/can-deposit", depositParams(args));
    if (action === "deposit") return callRocketpoolApi("/api/node/deposit", depositParams(args, true), "POST");
    if (action === "rewards") return callRocketpoolApi("/api/node/rewards");
    if (action === "get-rewards-info") return callRocketpoolApi("/api/node/get-rewards-info");
    if (action === "can-claim-rewards") return callRocketpoolApi("/api/node/can-claim-rewards", { indices: args[0] });
    if (action === "claim-rewards") return callRocketpoolApi("/api/node/claim-rewards", { indices: args[0] }, "POST");
    if (action === "can-claim-and-stake-rewards") return callRocketpoolApi("/api/node/can-claim-and-stake-rewards", { indices: args[0], stakeAmount: args[1] });
    if (action === "claim-and-stake-rewards") return callRocketpoolApi("/api/node/claim-and-stake-rewards", { indices: args[0], stakeAmount: args[1] }, "POST");
  }

  if (group === "network") {
    if (action === "node-fee") return callRocketpoolApi("/api/network/node-fee");
    if (action === "rpl-price") return callRocketpoolApi("/api/network/rpl-price");
  }

  if (group === "minipool" && action === "status") {
    return callRocketpoolApi("/api/minipool/status");
  }

  if (group === "megapool") {
    if (action === "status") return callRocketpoolApi("/api/megapool/status");
    if (action === "get-new-validator-bond-requirement") return callRocketpoolApi("/api/megapool/get-new-validator-bond-requirement");

    // --- Exit lifecycle ---
    // Exit a validator that is still in the entry queue (before it stakes).
    if (action === "can-exit-queue") return callRocketpoolApi("/api/megapool/can-exit-queue", { validatorIndex: args[0] });
    if (action === "exit-queue") return callRocketpoolApi("/api/megapool/exit-queue", { validatorIndex: args[0] }, "POST");
    // Exit an active validator (initiates the beacon-chain exit).
    if (action === "can-exit-validator") return callRocketpoolApi("/api/megapool/can-exit-validator", { validatorId: args[0] });
    if (action === "exit-validator") return callRocketpoolApi("/api/megapool/exit-validator", { validatorId: args[0] }, "POST");
    // Notify the protocol of a validator exit (post beacon exit).
    if (action === "can-notify-validator-exit") return callRocketpoolApi("/api/megapool/can-notify-validator-exit", { validatorId: args[0] });
    if (action === "notify-validator-exit") return callRocketpoolApi("/api/megapool/notify-validator-exit", { validatorId: args[0] }, "POST");

    // --- Claim / withdraw lifecycle ---
    // Read: rewards currently pending for the node's megapool.
    if (action === "pending-rewards") return callRocketpoolApi("/api/megapool/pending-rewards");
    // Read helper: estimate the node operator's share for a given amount.
    if (action === "calculate-rewards") return callRocketpoolApi("/api/megapool/calculate-rewards", { amountWei: args[0] });
    // Read helper: estimate time for funds to clear the beacon withdrawal queue.
    if (action === "beacon-withdrawal-queue-estimate") return callRocketpoolApi("/api/megapool/beacon-withdrawal-queue-estimate");
    // Distribute (claim) accrued megapool ETH/rewards to the node.
    if (action === "can-distribute") return callRocketpoolApi("/api/megapool/can-distribute");
    if (action === "distribute") return callRocketpoolApi("/api/megapool/distribute", {}, "POST");
    // Claim the node's refund (returned bond) after an exit.
    if (action === "can-claim-refund") return callRocketpoolApi("/api/megapool/can-claim-refund");
    if (action === "claim-refund") return callRocketpoolApi("/api/megapool/claim-refund", {}, "POST");
  }

  return { status: "error", error: `Unsupported Rocket Pool command: ${cmd}` };
}

function depositParams(args: string[], includeExecuteParams = false): Record<string, string> {
  const params: Record<string, string> = {
    amountWei: args[0],
    minFee: args[1],
    salt: args[2],
    expressTickets: args[3],
    count: args[6] ?? args[4] ?? "1",
  };
  if (includeExecuteParams) {
    params.useCreditBalance = args[3];
    params.expressTickets = args[4];
    params.submit = args[5];
    params.count = args[6] ?? "1";
  }
  return params;
}

async function callRocketpoolApi(path: string, params: Record<string, string> = {}, method = "GET") {
  const url = new URL(path, ROCKETPOOL_API_URL);
  const init: RequestInit = { method };

  if (method === "GET") {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  } else {
    init.body = new URLSearchParams(params).toString();
    init.headers = { "Content-Type": "application/x-www-form-urlencoded" };
  }

  const response = await fetch(url, init);
  const text = await response.text();
  try {
    return parseRocketpoolJson(text);
  } catch (error) {
    return { status: response.ok ? "success" : "error", error: response.ok ? "" : text, output: text };
  }
}

function parseRocketpoolJson(text: string) {
  // Rocket Pool returns wei amounts as JSON numbers. Preserve large integers as
  // strings so Node/React never round transaction amounts beyond MAX_SAFE_INTEGER.
  return JSON.parse(text.replace(/(:\s*)(-?\d{16,})(\s*[,}])/g, '$1"$2"$3'));
}

function splitCommand(cmd: string): string[] {
  const matches = cmd.match(/"([^"]*)"|'([^']*)'|\S+/g) ?? [];
  return matches.map((part) => part.replace(/^['"]|['"]$/g, ""));
}

function ensureHexPrefix(value: string): string {
  return value.startsWith("0x") ? value : `0x${value}`;
}

// POST /api/v1/minipool/import
app.post("/api/v1/minipool/import", async (req: Request, res: Response) => {
  console.log("Try to import key to the brain");
  res.send(await importKey(req.body.pubkey));
});

// function that imports the keys from teku to a given url
async function importKey(validatorPubkey: string): Promise<ImportKeyResponseData> {
  console.log("Import key to the brain");
  var keystoreJson = shelljs.exec(
    `cat /rocketpool/data/validators/teku/keys/${validatorPubkey}.json`
  ).stdout;
  var password = shelljs.exec(
    `cat /rocketpool/data/validators/teku/passwords/${validatorPubkey}.txt`
  ).stdout;
  return await postValidatorData({
    keystores: [keystoreJson],
    passwords: [password],
    tags: ["rocketpool"],
    feeRecipients: ["0xa347c391bc8f740caba37672157c8aacd08ac567"],
  });
}

// async function to POST fetch
async function postValidatorData(data = {}): Promise<ImportKeyResponseData> {
  const response = await fetch(
    `${appConfig.getConfig().brainAPIUrl}/eth/v1/keystores`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    }
  );
  console.log(response.ok);
  if (response.ok) {
    const { data }: { data: ImportKeyResponseData } = await response.json();
    console.log(data);
    return data;
  }
  return {
    data: [{
      status: "error",
      message: "Keystore cannot be imported",
    }]
  };
}

app.listen(API_PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${API_PORT}`);
});

interface ImportKeyResponseData {
  data: ImportKeyResponse[];
}
interface ImportKeyResponse {
  status: string;
  message?: string;
}
