const { getConnection, createConnection } = require("../connections/redis")

module.exports = async (args = {}) => {
  const redis = getConnection()
  const { key, value } = args
  return await redis.set(key, value)
}
