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
  const newMessage = new ChatMessage(args)

  return await newMessage.save()
}
