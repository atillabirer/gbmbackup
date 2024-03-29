import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import {
  performDeploymentStep,
  setLogger,
  setDeployerStatus,
  getDeployerStatus,
} from "../../scripts/deployer";
import { WebSocketServer } from "ws";
import session from "express-session";
import cookieParser from "cookie-parser";
import { sign, verify, decode } from "jsonwebtoken";
import { writeFile } from "fs/promises";
import { Client } from 'pg'
import cors from "cors";


const secret = "supersecuresecret";
const expirationDate = 6 * 60 * 60 * 1000; //6 hours in millisec

const sockServer = new WebSocketServer({ port: 444 });

const app: Application = express();
app.use(cors());
app.options('*',cors());
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: false }))

const store = new session.MemoryStore();

app.use(session({
  secret,
  saveUninitialized: false,
  resave: false,
  cookie: { secure: true, maxAge: expirationDate },
  store

}))
app.use(cookieParser());

const PORT = 3000;

const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.jwt) {
    //check token
    verify(req.cookies.jwt, secret, {}, (error, decoded) => {
      console.log("checked")
      if (error) res.redirect('/v1/admin/login');
      if (decoded) next();
    })
  } else {
    res.redirect('/v1/admin/login');
  }
}



//app.get("/", async (req: Request, res: Response) => {
//  res.redirect('/dapp');
//});

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



app.post("/updateDeploymentStatus", async (req: Request, res: Response) => {
  const { body } = req;

  try {
    setDeployerStatus(JSON.stringify(body));

    res.status(201).send({ updated: true });
  } catch (error) {
    res.status(500).send("Generic server error!");
  }
});

app.post('/updateConfig', async (req, res) => {
  console.log("body:\n", req.body);
  try {

    await writeFile(__dirname + '/admin/config/config2.json', JSON.stringify(req.body));

    await writeFile(__dirname + '/views/config/config2.json', JSON.stringify(req.body));

    //write config to postgres
    const client = new Client({ user: "graph-node", password: "let-me-in", database: "ido", host: "localhost", port: 5432 });
    await client.connect();
    const qres = await client.query("INSERT INTO state(deploymentstatus) VALUES($1::json) ", [JSON.stringify(req.body)]);
    console.log(qres);
    res.json({ message: "ok" });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
})


app.get('/admin/login', async (req, res) => {

  res.status(200).sendFile(path.join(__dirname + "/admin/login.html"));
})



app.get("/admin/:view", jwtMiddleware, async (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname + `/admin/${req.params.view}.html`));
  } catch {
    res.status(200).sendFile(path.join(__dirname + "/admin/deployment.html"));
  }
});


app.get('/dapp', (req, res) => {
  res.redirect('/v1/dapp/tokenAuctions');
})

app.get("/dapp/:view", async (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .sendFile(path.join(__dirname + `/views/${req.params.view}.html`));
  } catch {
    res.status(200).sendFile(path.join(__dirname + "/views/tokenAuctions.html"));
  }
});

app.post("/projectDetails",async(req: Request, res: Response) => {

  const client = new Client({ user: "graph-node", password: "let-me-in", database: "ido", host: "localhost", port: 5432 });
  await client.connect();
  const qres = await client.query("insert into project_details(tokencontractaddress,product,overview,businessmodel,team,tokenutility,milestones,documents,title,image,symbol) \
  VALUES($1::text,$2::text,$3::text,$4::text,$5::text,$6::text,$7::text,$8::text,$9::text,$10::text,$11::text)", [
    req.body.tokencontractaddress, //tokencontractaddress
    req.body.product,
    req.body.overview, //overview
    req.body.businessmodel, //businessmodel
    req.body.team, //team
    req.body.tokenutility, //tokenutility
    req.body.milestones, //milestones
    req.body.documents, //documents
    req.body.name,
    req.body.image,
    req.body.symbol
  ]);
  console.log(
    req.body
  );
  res.json({ message: "ok" });

});

app.get('/projectDetails/:tokenContractAddress',async(req: Request, res: Response) => {
  if(req.params?.tokenContractAddress) {

  const client = new Client({ user: "graph-node", password: "let-me-in", database: "ido", host: "localhost", port: 5432 });
  await client.connect();
  const qres = await client.query("SELECT * FROM project_details WHERE tokencontractaddress = $1::text", [
    req.params.tokenContractAddress
  ]);
  res.json(qres.rows);
  } else {
    res.status(404).json({"error":"Not Found"});
  }
})

app.post('/login/password', async (req, res) => {
  //if the username and password is good, generate a jwt token and then put it in users cookies
  try {
    const db = new Client({
      user: "graph-node",
      password: "let-me-in",
      database: "ido",
    })
    await db.connect();
    const query = await db.query("SELECT * FROM state WHERE admin = $1::text AND password = $2::text", [req.body.username, req.body.password]);
    if (query.rows.length) {
      sign(query.rows[0], secret, { expiresIn: expirationDate / 1000 }, (error, encoded) => {
        if (error) res.status(500).json({ error: "Signing error" })
        if (encoded) res.cookie('jwt', encoded, { maxAge: expirationDate }).redirect('/v1/admin/admin');
      })


    } else {
      res.json({ error: "error" });
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
})

app.get("/whale/:id/:jsonOrImage", async (req: Request, res: Response) => {
  req.params.id = "10";
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

app.use("/admin", jwtMiddleware, express.static(path.join(__dirname + "/admin")));

app.use("/dapp", express.static(path.join(__dirname + "/views")));

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
