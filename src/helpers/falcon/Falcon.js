const { createConnection, getConnection } = require("./connections/redis")

module.exports = () => {
  createConnection()

  return {
    getConnection,
    ...require("./actions/index"),
  }
}
