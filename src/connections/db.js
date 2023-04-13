const mongoose = require("mongoose")
module.exports.connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://hiepxuan2006:Hiepxuan2006@cluster0.pzzy0qz.mongodb.net/media?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )

    console.log("MongoDB connected")
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
