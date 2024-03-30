import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import shelljs from "shelljs";
import cors from "cors";
import appConfig from "./AppConfig";
const { API_PORT = 3000 } = process.env;

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

app.get("/api/v1/version", (req: Request, res: Response) => {
  var version = shelljs.exec(`/usr/local/bin/rocketpoold --version`).stdout;
  res.send(version);
});

// POST /api/v1/rocketpool-command-custom
app.post("/api/v1/rocketpool-command-custom", (req: Request, res: Response) => {
  console.log(req.body.cmd);
  var result = shelljs.exec(
    `/usr/local/bin/rocketpoold --settings /app/rocketpool/user-settings.yml api ${req.body.cmd}`
  ).stdout;
  res.send(result);
});

// POST /api/v1/rocketpool-command
app.post("/api/v1/rocketpool-command", (req: Request, res: Response) => {
  console.log(req.body.cmd);
  res.send(executeCommand(req.body.cmd));
});

// function that executes the command using shelljs
function executeCommand(cmd: string) {
  var result = shelljs.exec(
    `/usr/local/bin/rocketpoold --settings /app/rocketpool/user-settings.yml api ${cmd}`
  ).stdout;
  // conver result to json and check if result response "status":"success"
  var resultJson = JSON.parse(result);
  if (resultJson.status == "success") {
    if (cmd.startsWith("node deposit")) {
      // {"status":"success","error":"","txHash":"0x72162c8ac6b6fd9afe7c5b95166b7dc9c20df10031404fb09ad32db4bd9400c9","minipoolAddress":"0x14866919e7043288676eca918f6fc40d6f4616e0","validatorPubkey":"8eaccddb3ff58d68be44c1302b58d747350ef7e63c6c5fd555d356b8ab41f7cd61bb94f315897558c5d193324eec6ebc","scrubPeriod":3600000000000}
      executeCommand(`wait ${resultJson.txHash}`);
      importKey(`0x${resultJson.validatorPubkey}`);
    }
  }
  return result;
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
  var result = executeCommand("network stats")
  var resultJson = JSON.parse(result);
  // {"status":"success","error":"","totalValueLocked":154065.36778698865,"depositPoolBalance":18000,"minipoolCapacity":0,"stakerUtilization":0.7200199796420917,"nodeFee":0.14,"nodeCount":250,"initializedMinipoolCount":0,"prelaunchMinipoolCount":1,"stakingMinipoolCount":3991,"withdrawableMinipoolCount":0,"dissolvedMinipoolCount":29,"finalizedMinipoolCount":1555,"rplPrice":0.008993398770564952,"totalRplStaked":822088.2867094534,"effectiveRplStaked":660207.0232549048,"rethPrice":1.0201782729033397,"smoothingPoolNodes":109,"SmoothingPoolAddress":"0xa347c391bc8f740caba37672157c8aacd08ac567","smoothingPoolBalance":0.04406549738382312}
  var smoothingPoolAddress = resultJson.SmoothingPoolAddress;
  return await postValidatorData({
    keystores: [keystoreJson],
    passwords: [password],
    tags: ["rocketpool"],
    feeRecipients: [smoothingPoolAddress],
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

String.prototype.startsWith = function (str) {
  return this.indexOf(str) === 0;
};

interface ImportKeyResponseData {
  data: ImportKeyResponse[];
}
interface ImportKeyResponse {
  status: string;
  message?: string;
}
