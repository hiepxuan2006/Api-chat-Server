const _getConnection = (connection) => () => {
  return connection
}

const _getModel =
  (connection) =>
  (collection = "") => {
    try {
      const Schema = require(`./models/${collection}`)

      return connection.model(collection, Schema)
    } catch (e) {
      console.error(e)

      process.exit(1)
    }
  }

module.exports = (connection) => {
  return {
    getConnection: _getConnection(connection),
    getModel: _getModel(connection),
  }
}
