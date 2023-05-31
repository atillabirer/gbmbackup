import express, { Application, Request, Response } from "express";
import path from "path";
import { performDeploymentStep, setDiamondAddress, setDiamondCutFacetAddress, addToPreviousCuts, addToPreviousFacets, HardhatNetworkSetup_Before, HardhatNetworkSetup_After } from "../../scripts/deploy";
import { WebSocketServer } from "ws";

const sockServer = new WebSocketServer({ port: 443 });

const app: Application = express();
app.use(express.json());
app.use(express.static(path.join(__dirname+'/views')));

const PORT = 3000;

app.get("/", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/auctionlist.html'))
);

app.get("/auctions", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/auctionlist.html'))
);

app.get("/admin", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/config.html'))
);

app.get("/auction", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/auction.html'))
);

app.get("/deployment", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/deployment.html'))
);

app.get("/tokens", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/nft.html'))
);

function setDeploymentStatus(diamondCutAddress: string, diamondAddress: string, stringifiedCut: string, stringifiedFacets: string) {
    setDiamondCutFacetAddress(diamondCutAddress);
    setDiamondAddress(diamondAddress);
    try {
        addToPreviousCuts(JSON.parse(stringifiedCut));
        addToPreviousFacets(JSON.parse(stringifiedFacets));
    } catch (e) {

    }
}

sockServer.on('connection', ws => {
    let step = 0;
    /*
        Can extend the onClose to control a cancellation token that fully
        stops whatever hardhat is doing.
     */
    ws.on('close', () => {}) 
    
    ws.on('message', async function (data) {
        let receivedMsg = `${data}`;
        let commands = receivedMsg.split(" || ");
        if (commands[0] === 'PRE-DEPLOYMENT') {
            await HardhatNetworkSetup_Before(commands[1]);
            ws.send("SERVER || ACK");
            return;
        }
        if (commands[0] === 'POST-DEPLOYMENT') {
            console.log(commands);
            await HardhatNetworkSetup_After(commands[1], parseInt(commands[2]));
            return;
        }
        if (commands[0] === 'SERVER') return;
        setDeploymentStatus(commands[3], commands[4], commands[5], commands[6])
        let returnedMsgs = await performDeploymentStep(parseInt(commands[2]));
        ws.send(returnedMsgs[0]);
        ws.send(returnedMsgs[1]);
    })
    ws.onerror = function () {
      console.log('websocket error')
    }
   })

try {
    app.listen(PORT, (): void => {
        console.log(`GBM Deployer & Demo running on port ${PORT}`);
    });
} catch (error: any) {
    console.error(`Error occured: ${error.message}`);
}
