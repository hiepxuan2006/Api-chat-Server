const { Schema } = require("mongoose")

const ChatRoom = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
        index: true,
      },
    ],
    last_message: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
      index: true,
    },
    last_member: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      index: true,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
      trim: true,
    },
    is_group: {
      type: Boolean,
      default: false,
    },
    admin: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = ChatRoom
