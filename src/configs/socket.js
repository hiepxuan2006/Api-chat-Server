const falcon = require("../helpers/falcon")

module.exports = async (io) => {
  let activeUsers = []
  // let a = await falcon.get("userOnlineDev")
  // activeUsers = a ? JSON.parse(a) : []

  // if (!a) {
  //   await falcon.set({
  //     key: "userOnlineDev",
  //     value: JSON.stringify(activeUsers),
  //   })
  // }
  console.log("active", activeUsers.length)

  io.emit("get-users", activeUsers)
  io.on("connection", (socket) => {
    // ////////
    console.log("active", activeUsers.length)

    //
    socket.on("new-user-add", async (newUserId) => {
      console.log("active", activeUsers.length)

      if (!activeUsers.some((user) => user.userId === newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id })
      }

      // await falcon.set({
      //   key: "userOnlineDev",
      //   value: JSON.stringify(activeUsers),
      // })
      io.emit("get-users", activeUsers)
    })
    // //////////////
    socket.on("error", (err) => {
      console.log("Caught flash policy server socket error: ")
      console.log(err.stack)
    })

    // //////////////

    socket.on("users-online", async (newUserId) => {
      io.emit("users-online", activeUsers)
    })

    // //////////

    socket.on("disconnect", async () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
      // await falcon.set({
      //   key: "userOnlineDev",
      //   value: JSON.stringify(activeUsers),
      // })
      console.log("active", activeUsers.length)
      io.emit("get-users", activeUsers)
      socket.disconnect()
    })

    socket.on("user-off", async (data) => {
      activeUsers = activeUsers.filter((user) => user.userId !== data)
      // await falcon.set({
      //   key: "userOnlineDev",
      //   value: JSON.stringify(activeUsers),
      // })

      io.emit("get-users", activeUsers)
    })

    ///////////////////
    socket.on("send-message", (data) => {
      const { receiverId } = data
      const user = activeUsers.find((user) => user.userId === receiverId)

      if (user) {
        io.to(user.socketId).emit("recieve-message", data)
      }
    })
    // ////////////////////
    socket.on("user-typing-message", (data) => {
      const { receiverId } = data
      console.log(data)
      const user = activeUsers.find((user) => user.userId === receiverId)
      if (user) {
        socket.to(user.socketId).emit("user-typing", data)
      }
    })
  })
}
