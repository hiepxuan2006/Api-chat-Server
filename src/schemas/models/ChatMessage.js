const { Schema } = require("mongoose")

module.exports = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      require: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      require: true,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)
