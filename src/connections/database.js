const { createMongoConnection } = require("../schemas/createMongoConnection")
const createStore = require("../schemas")

const MONGODB_URI = process.env.MONGODB_URI
console.log("MONGODB_URI:", MONGODB_URI)

const originConnection = createMongoConnection(MONGODB_URI)

module.exports = createStore(originConnection)
