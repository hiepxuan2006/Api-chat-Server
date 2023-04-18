const { default: mongoose } = require("mongoose")
const { getModel } = require("../connections/database")

const ChatRoom = getModel("ChatRoom")
const ChatMessage = getModel("ChatMessage")

module.exports.getChatsMessage = async (args = {}) => {
  const { members = [] } = args
  const chatRoom = await ChatRoom.findOne({
    members: { $all: members },
  }).lean()
  if (!chatRoom) {
    const newChatRoom = new ChatRoom({
      members: members,
    })
    const chat = await newChatRoom.save()

    return { chatRoom: chat._id, message: [] }
  }

  const message = await ChatMessage.find({ chatId: chatRoom._id })
  return { message, chatRoom: chatRoom._id }
}

module.exports.sendMessage = async (args = {}) => {
  const { chatId, senderId } = args
  const newMessage = new ChatMessage(args)
  const message = await newMessage.save()
  await ChatRoom.findOneAndUpdate(
    { _id: chatId },
    { $set: { last_message: message, last_member: senderId } }
  )
  return newMessage
}

module.exports.getMessageRoom = async (args = {}) => {
  const { chatId } = args
  const message = await ChatMessage.aggregate([
    { $match: { chatId: new mongoose.Types.ObjectId(chatId) } },
    {
      $lookup: {
        from: "accounts",
        localField: "senderId",
        foreignField: "_id",
        as: "senderId",
      },
    },
    {
      $unwind: "$senderId",
    },
    {
      $project: {
        "senderId.password": 0,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d ", date: "$createdAt" } },
        list: { $push: "$$ROOT" },
      },
    },
    { $sort: { _id: -1 } },
  ])
  return { chatId, message }
}

module.exports.createNewChat = async (args = {}) => {
  const { members = [], name, image, admin } = args
  if (!members.length || members.length < 2) throw new Error("missing params")

  if (members.length === 2) {
    const chatRoom = await ChatRoom.findOne({
      members: { $all: members },
      is_group: false,
    }).lean()
    if (chatRoom) {
      return chatRoom
    }
  }
  if (members.length > 2) {
    const newChatRoom = new ChatRoom({
      members,
      is_group: true,
      admin: admin,
      name,
      image,
    })

    return await newChatRoom.save()
  } else {
    const newChatRoom = new ChatRoom({
      members,
    })
    return await newChatRoom.save()
  }
}
