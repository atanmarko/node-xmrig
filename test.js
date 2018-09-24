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

var userWallet = "SFXtzUofCsNdZZ8N9FRTp6185fw9PakKrY22DWVMtWGYFgPnFsA66cf7mgqXknyteb7T9FzMA3LfmBN2C6koS8yPcN1iC33FLyR";
var pool = "127.0.0.1:1111";
var maxCpuUsage = 25;

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
    console.log("JS: Ending mining...");
    miner.stopMining();
    console.log("JS: Mining ended");
}

var counter = 0;
function checkStatus(arg) {
    console.log("JS: Hashrate:" + miner.getStatus());
    counter++;
    if (counter < 50)
       setTimeout(checkStatus, 2000);
    else
       setTimeout(stopMining, 2000);
}

setTimeout(checkStatus, 2000);
