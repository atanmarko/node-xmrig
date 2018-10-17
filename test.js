// this is how we will require our module
const xmrigCpu = require('./')


var jsonConfig = {
    "algo": "cryptonight/1",
    "api": {
        "port": 0,
        "access-token": null,
        "worker-id": null,
        "ipv6": false,
        "restricted": true
    },
    "av": 0,
    "background": false,
    "colors": true,
    "cpu-affinity": null,
    "cpu-priority": null,
    "donate-level": 0,
    "huge-pages": true,
    "hw-aes": null,
    "log-file": null,
    "max-cpu-usage": 75,
    "pools": [
        {
            "url": "",
            "user": "",
            "pass": "x",
            "rig-id": null,
            "nicehash": false,
            "keepalive": false,
            "variant": 1
        }
    ],
    "print-time": 60,
    "retries": 5,
    "retry-pause": 5,
    "safe": false,
    "threads": null,
    "user-agent": null,
    "watch": false
};

var userWallet = "Safex5zeNaJdsHT4VBieWg1EtUMtTrVFARZm2jt2qRSef5DQK4RFcqgAMsLp4yDiQAB8W1JLBs7zgZUGErQXf8DFKQQdChvjRxQ55";
var pool = "safex.luckypool.io:3366";
var pool2 = "pool.safexnews.net:1111";
var maxCpuUsage = 75;

jsonConfig.pools[0].url = pool;
jsonConfig.pools[0].user = userWallet;
jsonConfig["max-cpu-usage"] = maxCpuUsage;

console.log("JS: User address:"+userWallet);
console.log("JS: Pool:"+pool);
console.log("JS: CPU load:"+maxCpuUsage);

var miner = null;

console.log("JS: Starting mining...");
miner = new xmrigCpu.NodeXmrigCpu(JSON.stringify(jsonConfig));
miner.startMining();
console.log("JS: Native mining started!");


function stopMining(arg) {

}

var counter = 0;
function checkStatus(arg) {

    console.log("JS: Hashrate:" + miner.getStatus());
    counter++;
    console.log("checkStatus counter:" + counter);

    if (counter < 20) {
        setTimeout(checkStatus, 1000);
    } else if (counter == 20) {
        setTimeout(stopMining, 2000);
    } else if (counter == 35) {
        setTimeout(startMining, 1000);
    } else if (counter == 200) {
        setTimeout(stopMining, 1000);
    } else {
        setTimeout(checkStatus, 1000);
    }
}

function stopMining(arg) {

    counter++;
    console.log("stopMining counter:" + counter);

    console.log("JS: Ending mining...");
    miner.stopMining();
    console.log("JS: Mining ended");


    setTimeout(checkStatus, 2000);


}
function startMining(arg) {
    jsonConfig.pools[0].url = pool2;
    counter++;
    console.log("startMining counter:" + counter);

    console.log("JS: Starting mining...");
    miner.startMining();
    console.log("JS: Mining started");


    setTimeout(checkStatus, 2000);

}


setTimeout(checkStatus, 2000);