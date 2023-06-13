
let GBMPresetArray = [];

let gbmTimeSeries = [{
        "timePrefix": "hour-1",
        "auctionDuration": "3600",
        "hammerTimeDuration": "300",
        "cancellationPeriodDuration": "600"
    }, {
        "timePrefix": "hour-6",
        "auctionDuration": "21600",
        "hammerTimeDuration": "600",
        "cancellationPeriodDuration": "1200"
    },
    {
        "timePrefix": "hour-24",
        "auctionDuration": "86400",
        "hammerTimeDuration": "1200",
        "cancellationPeriodDuration": "2400"
    },{
        "timePrefix": "day-3",
        "auctionDuration": "259200",
        "hammerTimeDuration": "1800",
        "cancellationPeriodDuration": "3600"
    },{
        "timePrefix": "day-7",
        "auctionDuration": "120",
        "hammerTimeDuration": "120",
        "cancellationPeriodDuration": "20"
    },
]

let gbmAuctionSettings = [{
        "incentivePrefix": "English",
        "stepMin": "5000",
        "incentiveMin": "0",
        "incentiveMax": "0",
        "incentiveGrowthMultiplier": "0",
        "firstMinBid": "1"
    },{
        "incentivePrefix": "Low",
        "stepMin": "5000",
        "incentiveMin": "500",
        "incentiveMax": "2000",
        "incentiveGrowthMultiplier": "1620",
        "firstMinBid": "1"
    },{
        "incentivePrefix": "Medium",
        "stepMin": "5000",
        "incentiveMin": "500",
        "incentiveMax": "5000",
        "incentiveGrowthMultiplier": "4970",
        "firstMinBid": "1"
    },{
        "incentivePrefix": "High",
        "stepMin": "10000",
        "incentiveMin": "1000",
        "incentiveMax": "10000",
        "incentiveGrowthMultiplier": "11000",
        "firstMinBid": "1"
    },{
        "incentivePrefix": "Degen",
        "stepMin": "20000",
        "incentiveMin": "2000",
        "incentiveMax": "20000",
        "incentiveGrowthMultiplier": "27000",
        "firstMinBid": "1"
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