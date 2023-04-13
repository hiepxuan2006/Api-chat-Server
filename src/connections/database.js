const { createMongoConnection } = require("../schemas/createMongoConnection")
const createStore = require("../schemas")

const MONGODB_URI = process.env.MONGODB_URI
console.log("MONGODB_URI:", MONGODB_URI)

const originConnection = createMongoConnection(
  "mongodb+srv://hiepxuan2006:Hiepxuan2006@cluster0.pzzy0qz.mongodb.net/media?retryWrites=true&w=majority"
)

module.exports = createStore(originConnection)
