const { sendSuccess, sendError } = require("../helpers/response")
const MessageActions = require("../actions/MessageActions")

module.exports.getChatsMessage = (req, res) => {
  const { body } = req
  MessageActions.getChatsMessage(body)
    .then(sendSuccess(req, res))
    .catch(req, res)
}

module.exports.sendMessage = (req, res) => {
  const { body } = req
  MessageActions.sendMessage(body).then(sendSuccess(req, res)).catch(req, res)
}
