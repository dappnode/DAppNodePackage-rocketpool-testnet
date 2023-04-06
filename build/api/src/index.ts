import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import shelljs from "shelljs";
import cors from "cors";
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

app.get("/api/v1/version", (req: Request, res: Response) => {
  var version = shelljs.exec(`/usr/local/bin/rocketpoold --version`).stdout;
  res.send(version);
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

// function that imports the keys from teku to a given url
function importKey(validatorPubkey: string) {
  console.log("Import key to the brain");
  var keystoreJson = shelljs.exec(
    `cat /rocketpool/data/validators/teku/keys/${validatorPubkey}.json`
  ).stdout;
  var password = shelljs.exec(
    `cat /rocketpool/data/validators/teku/passwords/${validatorPubkey}.txt`
  ).stdout;
  postValidatorData({
    keystores: [keystoreJson],
    passwords: [password],
    tags: ["rocketpool"],
    feeRecipients: ["0xd4E96eF8eee8678dBFf4d535E033Ed1a4F7605b7"],
  });
}

// async function to POST fetch
async function postValidatorData(data = {}) {
  const response = await fetch(
    `http://brain.web3signer-prater.dappnode:3000/eth/v1/keystores`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    }
  );
  console.log(response.ok);
  if (response.ok) {
    const { data }: { data: IImportKeyResponseData } = await response.json();
    console.log(data);
  }
}

app.listen(API_PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${API_PORT}`);
});

String.prototype.startsWith = function (str) {
  return this.indexOf(str) === 0;
};

interface IImportKeyResponseData {
  data: IImportKeyResponse[];
}
interface IImportKeyResponse {
  status: string;
  message?: string;
}
