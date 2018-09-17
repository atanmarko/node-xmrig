var xmrigCpu

if (process.env.DEBUG) {
    xmrigCpu= require('./build/Debug/xmrigCpu.node')
} else {
    xmrigCpu= require('./build/Release/xmrigCpu.node')
}

module.exports = xmrigCpu