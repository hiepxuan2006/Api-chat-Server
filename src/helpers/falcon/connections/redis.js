const { connectRedis } = require("../../../connections/redisConnection")

const _store = {
  connection: null,
}

exports.createConnection = async () => {
  _store.connection = await connectRedis()
  return _store.connection
}

exports.getConnection = () => {
  return _store.connection
}
