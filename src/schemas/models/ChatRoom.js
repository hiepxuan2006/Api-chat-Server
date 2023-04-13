const { Schema } = require("mongoose")

const ChatRoom = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    las_message: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = ChatRoom
