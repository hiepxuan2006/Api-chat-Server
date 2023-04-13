const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")

const PORT = process.env.PORT || 5000

app.use(
  cors({ origin: "https://hiepxuan-profile.netlify.app", credentials: true })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, "/../", "public")))
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://hiepxuan-profile.netlify.app"
  )
  res.setHeader("Access-Control-Allow-Credentials", true)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})
const io = new Server(
  server,
  {
    cors: {
      origin: "*",
    },
  },
  { pingTimeout: 60000 }
)
setTimeout(async () => {
  await require("./connections/redisConnection").connectRedis()
  await require("./connections/db").connectDB()
  await require("./helpers/falcon")
  require("./configs/socket")(io)

  app.use(require("./app.routes"))
  app.use("/", (req, res) => {
    res.send("hello")
  })
  server.listen(PORT, function () {
    console.log("Server started on PORT " + PORT)
  })
}, 0)
