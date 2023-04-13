const {getConnection} = require('../connections/redis')

module.exports = async (...args) => {
    const redis = getConnection()
    const result = await redis.hexists.apply(redis, args)

    return !!result
}
