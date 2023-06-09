const express = require("express")
const router = express.Router()
const uploadCloud = require("./middlewares/uploadCloud")
const Oauth = require("./middlewares/Oauth")
const multer = require("./middlewares/multer")

const authCtrl = require("./controllers/authController")

router.post("/auth/register", authCtrl.registerAccount)
router.post("/auth/login", authCtrl.loginAccount)
router.post("/auth/get-account", authCtrl.getAccount)
router.get("/auth/get-all-account", Oauth.authorization, authCtrl.getAllAccount)
router.get("/auth/authorization", Oauth.authorization, authCtrl.authorization)

const messCtrl = require("./controllers/MessageController")

router.post("/message/get-message", messCtrl.getChatsMessage)
router.post("/message/get-message-room", messCtrl.getMessageRoom)
router.post("/message/send-message", messCtrl.sendMessage)
router.post("/message/new-chat", messCtrl.createNewChat)

const accountCtrl = require("./controllers/AccountController")

router.post("/search-account", accountCtrl.searchAccount)
router.post("/get-chat-rooms", accountCtrl.getChats)
router.post("/get-room", accountCtrl.getChatRoom)

router.post("/upload", multer.single("image"), authCtrl.uploadCloud)
module.exports = router
