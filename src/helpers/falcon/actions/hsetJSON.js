const {getConnection} = require('../connections/redis')

module.exports = async (...args) => {
    const [key, field, value] = args

    const dataString = JSON.stringify(value)
    const redis = getConnection()

    return redis.hset.apply(redis, [key, field, dataString])
}
