const Falcon = require("./falcon/Falcon")
const redisURI = process.env.REDIS_URI

console.log("REDIS_URI", redisURI)

const falcon = Falcon()

module.exports = falcon
