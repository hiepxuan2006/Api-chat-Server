const { Schema } = require("mongoose")

module.exports = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
      require: true,
    },

    id_google: {
      type: String,
      default: null,
    },

    auth_type: [
      {
        type: String,
        enum: ["local", "google"],
        default: "local",
      },
    ],

    roles: {
      type: [String],
      default: ["customer"],
      enum: ["admin", "customer", "supper_admin"],
    },

    is_admin: {
      type: Boolean,
      default: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      default: "inactive",
      index: true,
    },
    is_online: {
      type: Boolean,
      index: true,
      default: false,
    },
    address: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      trim: true,
    },

    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],

    phone: {
      type: String,
      trim: true,
      //   require,
      // unique: true,
    },

    connected: {
      type: Schema.Types.Mixed,
      default: {},
    },

    last_time_logout: {
      type: Date,
    },

    last_time_online: {
      type: Date,
    },

    updated: {
      type: Date,
    },
    relationship: {
      type: String,
    },
    country: {
      type: String,
    },
    followers: [],
    following: [],
  },
  { timestamps: true }
)
