const {getConnection} = require('../connections/redis')

module.exports = async (...args) => {
    const [key, field] = args
    const redis = getConnection()

    const value = await redis.hget.apply(redis, [key, field])

    try {
        return JSON.parse(value)
    } catch (e) {
        return value
    }
}
