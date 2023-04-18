const { getModel } = require("../connections/database")

const Account = getModel("Account")
const ChatRoom = getModel("ChatRoom")
const ChatMessage = getModel("ChatMessage")

module.exports.searchAccount = async (args = {}) => {
  const { limit, page, q } = args
  const skip = (page - 1) * limit
  const name = {
    $regex: new RegExp(q, "gi"),
  }

  const _accounts = Account.find({ name })
    .limit(limit)
    .select("-password")
    .skip(skip)
    .lean()
  const _total = Account.countDocuments({ name })

  const [accounts, total] = await Promise.all([_accounts, _total])
  const pages = Math.floor(total / limit)

  return { accounts, limit, page, pages }
}

module.exports.getChats = async (args = {}) => {
  const { id } = args
  const listChat = await ChatRoom.find({ members: { $in: [id] } })
    .populate({
      model: Account,
      path: "members",
      select: "-password",
    })
    .populate({
      model: ChatMessage,
      path: "last_message",
    })
    .populate({
      model: Account,
      path: "last_member",
      select: "-password",
    })
    .lean()

    .lean()

  return listChat
}

module.exports.getChatRoom = async (args = {}) => {
  const { id } = args
  const listChat = await ChatRoom.findOne({ _id: id })
    .populate({
      model: Account,
      path: "members",
      select: "-password",
    })
    .populate({
      model: ChatMessage,
      path: "last_message",
    })
    .populate({
      model: Account,
      path: "last_member",
      select: "-password",
    })
    .lean()

  return listChat
}
