const { getConnection } = require("../connections/redis")

module.exports = async (...args) => {
  const redis = getConnection()

  return redis.hset.apply(redis, args)
}
