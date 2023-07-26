import express, { Application, Request, Response } from "express";
import path from "path";
import {
  performDeploymentStep,
  setLogger,
  setDeployerStatus,
  getDeployerStatus,
} from "../../scripts/deployer";
import { WebSocketServer } from "ws";
import { writeFile } from "fs/promises"

const sockServer = new WebSocketServer({ port: 444 });

const app: Application = express();
app.use(express.json({ limit: "12mb" }));
app.use(express.static(path.join(__dirname + "/views")));

const PORT = 3000;

app.get("/", async (req: Request, res: Response) =>
  res.status(200).sendFile(path.join(__dirname + "/views/deployment.html"))
);

app.get("/presets", async (req: Request, res: Response) => {
  res
    .status(200)
    .json(
      JSON.parse(require(`../../scripts/libraries/gbm.default.config.ts`).conf)
    );
});

app.get("/hardhat", async (req: Request, res: Response) => {
  res.status(200).send(require("../../hardhat.config"));
});

app.get("/deploymentStatus", async (req, res) => {
  const depStatus = getDeployerStatus();

  res.status(200).send(depStatus);
});

app.get("/:view", async (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname + `/views/${req.params.view}.html`));
  } catch {
    res.status(200).sendFile(path.join(__dirname + "/views/deployment.html"));
  }
});

app.get("/whale/:id/:jsonOrImage", async (req: Request, res: Response) => {
  try {
    if (req.params.jsonOrImage === "image") {
      res
        .status(200)
        .sendFile(
          path.join(
            __dirname,
            `../../scripts/libraries/NFTTest/Medias/GBM Whale #${req.params.id}.png`
          )
        );
    } else {
      res
        .status(200)
        .send(
          require(`../../scripts/libraries/NFTTest/Whale${req.params.id}.json`)
        );
    }
  } catch {
    res.status(500).send("No such token!");
  }
});

app.post("/updateDeploymentStatus", async (req: Request, res: Response) => {
  const { body } = req;

  try {
    setDeployerStatus(JSON.stringify(body));

    res.status(201).send({ updated: true });
  } catch (error) {
    res.status(500).send("Generic server error!");
  }
});

app.post("/updateConfigPostgres", async (req: Request, res: Response) => {
  try {


    await writeFile(__dirname + "/views/config/config2.json", JSON.stringify(req.body));
    res.status(200).send({ message: "ok" });
  } catch (error) {
    res.status(500).send({ error: "updateConfigPostgres failed" });
    console.log(error);
  }

})

sockServer.on("connection", (ws) => {
  setLogger((msg: string) => {
    ws.send(`MSG || ${msg}`);
  });
  /*
        Can extend the onClose to control a cancellation token that fully
        stops whatever hardhat is doing.
     */
  ws.on("close", () => { });

  ws.on("message", async function(data) {
    let receivedMsg = `${data}`;
    let commands = receivedMsg.split(" || ");
    switch (commands[0]) {
      case "DEPLOY":
        let returnedMsgs = (await performDeploymentStep(commands[1])) ?? [
          "",
          "",
        ];
        ws.send(`STATE || ${getDeployerStatus()}`);
        ws.send(`STEP_DONE || ${returnedMsgs[0]}`);
        break;
      case "RESUME":
        setDeployerStatus(commands[1]);
        break;
      case "PURGE":
        setDeployerStatus("{}");
      default:
    }
  });
  ws.onerror = function() {
    console.log("websocket error");
  };
});

try {
  app.listen(PORT, (): void => {
    console.log(`GBM Deployer & Demo running on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
