let deploy = require("./deploy.ts");

let conf = JSON.parse(require("../gbm.config.ts").conf);

const AUTOMATED_TEST:boolean = true;

if (true) {
    deploy.main(true);
}