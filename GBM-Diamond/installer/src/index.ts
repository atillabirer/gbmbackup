import express, { Application, Request, Response } from "express";
import path from "path";
import { performDeploymentStep } from "../../scripts/deploy";
import { WebSocketServer } from "ws";

const sockServer = new WebSocketServer({ port: 443 });

const app: Application = express();
app.use(express.json());
app.use(express.static(path.join(__dirname+'/views')));

const PORT = 3003;

app.get("/", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/auctionlist.html'))
);

app.get("/auctions", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/auctionlist.html'))
);

app.get("/auction", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/auction.html'))
);

app.get("/deployment", async (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname+'/views/deployment.html'))
);

sockServer.on('connection', ws => {
    let step = 0;
    console.log('New client connected!')
    ws.send("Server: Deployment started!");
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', async function (data) {
        let message = `${data}`;
        if (message.substring(0,7) !== 'Server: ') {
            console.log(`performing deployment step ${step}`);
            let next = await performDeploymentStep(step);
            step++;
            ws.send(`Server: ${next}`)
        }
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