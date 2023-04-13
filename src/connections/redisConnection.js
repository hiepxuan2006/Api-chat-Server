const redis = require("redis")

module.exports.connectRedis = async () => {
  const url =
    "redis://redis-18599.c295.ap-southeast-1-1.ec2.cloud.redislabs.com:18599"
  const client = redis.createClient({
    url,
    password: "bx4cf6SHDfH7blNjCB2UyVBk3HUBrqEv",
  })
  client.on("connect", () => console.log("DB redis connected"))
  client.on("error", (err) => console.log("client Connection Error", err))
  client.connect()
  return client
}
