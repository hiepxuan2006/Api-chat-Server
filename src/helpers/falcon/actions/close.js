const {getConnection} = require('../connections/redis')


module.exports = async () => {
    const redis = getConnection()


    return new Promise((resolve, reject) => {
        redis.quit((error) => {
            if (error) {
                return reject(error)
            }

            return resolve(true)
        })
    })
}
