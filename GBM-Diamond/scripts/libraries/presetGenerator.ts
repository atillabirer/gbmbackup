
let GBMPresetArray = [];

let gbmTimeSeries = [{
        "displayTime": "1h",
        "timePrefix": "hour-1",
        "auctionDuration": "3600",
        "hammerTimeDuration": "300",
        "cancellationPeriodDuration": "600"
    }, {
        "displayTime": "6h",
        "timePrefix": "hour-6",
        "auctionDuration": "21600",
        "hammerTimeDuration": "600",
        "cancellationPeriodDuration": "1200"
    },
    {
        "displayTime": "24h",
        "timePrefix": "hour-24",
        "auctionDuration": "86400",
        "hammerTimeDuration": "1200",
        "cancellationPeriodDuration": "2400"
    },{
        "displayTime": "3 days",
        "timePrefix": "day-3",
        "auctionDuration": "259200",
        "hammerTimeDuration": "1800",
        "cancellationPeriodDuration": "3600"
    },{
        "displayTime": "7 days",
        "timePrefix": "day-7",
        "auctionDuration": "604800",
        "hammerTimeDuration": "3600",
        "cancellationPeriodDuration": "7200"
    },
]

let gbmAuctionSettings = [{
        "displayName": "Zero (0%)",
        "incentivePrefix": "English",
        "stepMin": "5000",
        "incentiveMin": "0",
        "incentiveMax": "0",
        "incentiveGrowthMultiplier": "0",
        "firstMinBid": "1",
        "potentialTotal": "0"
    },{
        "displayName": "Low (0.5%-2%)",
        "incentivePrefix": "Low",
        "stepMin": "5000",
        "incentiveMin": "500",
        "incentiveMax": "2000",
        "incentiveGrowthMultiplier": "1620",
        "firstMinBid": "1",
        "potentialTotal": "6000"
    },{
        "displayName": "Medium (0.5%-5%)",
        "incentivePrefix": "Medium",
        "stepMin": "5000",
        "incentiveMin": "500",
        "incentiveMax": "5000",
        "incentiveGrowthMultiplier": "4970",
        "firstMinBid": "1",
        "potentialTotal": "10000"
    },{
        "displayName": "High (1%-10%)",
        "incentivePrefix": "High",
        "stepMin": "10000",
        "incentiveMin": "1000",
        "incentiveMax": "10000",
        "incentiveGrowthMultiplier": "11000",
        "firstMinBid": "1",
        "potentialTotal": "15000"
    },{
        "displayName": "Degen (2%-20%)", 
        "incentivePrefix": "Degen",
        "stepMin": "20000",
        "incentiveMin": "2000",
        "incentiveMax": "20000",
        "incentiveGrowthMultiplier": "27000",
        "firstMinBid": "1",
        "potentialTotal": "25000"
    }
];


export function generateAllPresetsFromOffset(_offset: any){
    let offset = parseInt(_offset);

    let serie : Array<any> = [];

    for(let i = 0; i < gbmTimeSeries.length; i++){
        for(let j = 0; j < gbmAuctionSettings.length; j++){
            offset++;
            let obj:any = {...{"name": "" + gbmAuctionSettings[j].incentivePrefix + "_" + gbmTimeSeries[i].timePrefix},...gbmAuctionSettings[j], ...gbmTimeSeries[i]};
            //obj.name = "GBM_" + gbmAuctionSettings[j].incentivePrefix + "_" + gbmTimeSeries[i].timePrefix;
            obj.presetIndex = "" + offset;
            serie.push(obj);
        }
    }

    return serie;
}