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
  const roomNum = 12
  const userJoinGame = []
  let arrRoom = new Array(roomNum)
  for (let i = 0; i < roomNum; i++) {
    arrRoom[i] = new Array()
  }

  let arrMesRoom = new Array(roomNum)
  for (let i = 0; i < roomNum; i++) {
    arrMesRoom[i] = new Array()
  }

  let numStatusPlayer = 2
  let arrStatusPlayer = []
  arrStatusPlayer = new Array(roomNum)
  for (let i = 0; i < roomNum; i++) {
    arrStatusPlayer[i] = new Array(numStatusPlayer)
    arrStatusPlayer[i][0] = false
    arrStatusPlayer[i][1] = false
  }
  console.log("active", activeUsers.length)
  io.emit("get-users", activeUsers)
  io.on("connection", (socket) => {
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

    socket.on("error", (err) => {
      console.log("Caught flash policy server socket error: ")
      console.log(err.stack)
    })

    socket.on("users-online", async (newUserId) => {
      io.emit("users-online", activeUsers)
    })

    socket.on("disconnect", async () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
      // await falcon.set({
      //   key: "userOnlineDev",
      //   value: JSON.stringify(activeUsers),
      // })
      console.log("active", activeUsers.length)
      io.emit("get-users", activeUsers)
      const { room, player } = deleteMember(socket.id)
      if (typeof room === "number") {
        sortRoom(room)
        if (arrRoom[room].length === 0) {
          arrMesRoom[room] = []
        }
        io.to(room + "").emit("clients-get-new-player", {
          idPlayer: socket.id,
          listPlayer: arrRoom[room],
          playerLeave: player,
        })
        io.sockets.emit("clients-update-list-room", { arrRoom: arrRoom })
      }
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

    socket.on("send-message", (data) => {
      const { receiverId } = data
      const user = activeUsers.find((user) => user.userId === receiverId)

      if (user) {
        io.to(user.socketId).emit("recieve-message", data)
      }
    })

    socket.on("user-typing-message", (data) => {
      const { receiverId } = data
      const user = activeUsers.find((user) => user.userId === receiverId)
      if (user) {
        socket.to(user.socketId).emit("user-typing", data)
      }
    })

    // //////////////// game

    // socket.on("user-join-game")

    socket.on("client-join-room", function (data) {
      //
      if (data.idRoomNumber !== -1) {
        socket.join(data.idRoomNumber + "")
        if (
          !arrRoom[data.idRoomNumber].some(
            (user) => user.userId === data.userId
          )
        ) {
          arrRoom[data.idRoomNumber].length < 2
            ? arrRoom[data.idRoomNumber].push({
                idPlayer: socket.id,
                userId: data.userId,
                userName: data.userName,
                player: true,
              })
            : arrRoom[data.idRoomNumber].push({
                idPlayer: socket.id,
                userId: data.userId,
                userName: data.userName,
                player: false,
              })
        }
        io.to(data.idRoomNumber + "").emit("clients-get-new-player", {
          idPlayer: socket.id,
          listPlayer: arrRoom[data.idRoomNumber],
          arrStatusPlayer: arrStatusPlayer[data.idRoomNumber],
        })
        io.to(data.idRoomNumber + "").emit(
          "server-all-message-game",
          arrMesRoom[data.idRoomNumber]
        )
      }
      //
      io.sockets.emit("clients-update-list-room", { arrRoom: arrRoom })
    })

    socket.on("client-join-game", (data) => {
      console.log(data)
      const { room, player } = deleteMember(data.idPlayer)
      if (typeof room === "number") {
        sortRoom(room)
        arrMesRoom[room] = []
      }
      io.sockets.emit("clients-update-list-room", { arrRoom: arrRoom })
    })

    socket.on("client-send-message-game", (data) => {
      const { idRoomNumber, userId, message, userName } = data
      const mess = { userId, idPlayer: socket.id, message, userName }
      arrMesRoom[idRoomNumber].push(mess)
      io.to(data.idRoomNumber + "").emit("server-send-message-game", mess)
    })

    socket.on("user-leave-room", (data) => {
      deleteMember(data.idPlayer)
      sortRoom(data.idRoomNumber)
      io.to(data.idRoomNumber + "").emit("clients-get-new-player", {
        idPlayer: socket.id,
        listPlayer: arrRoom[data.idRoomNumber],
      })
      io.sockets.emit("clients-update-list-room", { arrRoom: arrRoom })
    })

    socket.on("client-send-location-XO", (data) => {
      io.to(data.idRoomNumber + "").emit("server-send-data-location-all", data)
    })

    socket.on("client-reload-ready", (idRoomNumber) => {
      arrStatusPlayer[idRoomNumber][0] = false
      arrStatusPlayer[idRoomNumber][1] = false
    })
    socket.on("client-send-ready", (data) => {
      const playing = isPlaying(data.userId, data.idRoomNumber, data.ready)
      if (playing) {
        arrStatusPlayer[data.idRoomNumber][0] = false
        arrStatusPlayer[data.idRoomNumber][1] = false
        io.to(data.idRoomNumber + "").emit("server-send-playing", {
          playing: playing,
          result: data,
          arrStatusPlayer: arrStatusPlayer[data.idRoomNumber],
        })
      }
    })
    socket.on("client-send-winner", (data) => {
      arrStatusPlayer[data.idRoomNumber][0] = false
      arrStatusPlayer[data.idRoomNumber][0] = false

      const winner = arrRoom[data.idRoomNumber].filter(
        (item) => item.idPlayer === socket.id
      )
      io.to(data.idRoomNumber + "").emit("server-send-client-win", {
        playing: false,
        winner: winner[0],
      })
    })
  })

  const reloadStatus = (idRoomNumber) => {
    arrStatusPlayer[idRoomNumber][0] == false
    arrStatusPlayer[idRoomNumber][1] == false
  }

  const isPlaying = (userId, idRoomNumber, ready) => {
    let locationInRoom = null
    arrRoom.forEach((element) => {
      element.forEach((item, index) => {
        if (item.userId === userId) {
          locationInRoom = index
        }
      })
    })
    if (typeof locationInRoom === "number") {
      arrStatusPlayer[idRoomNumber][locationInRoom] = ready
    }
    if (
      arrStatusPlayer[idRoomNumber][0] == true &&
      arrStatusPlayer[idRoomNumber][1] == true
    ) {
      return true
    } else {
      return false
    }
  }

  const sortRoom = (idRoomNumber) => {
    const player = arrRoom[idRoomNumber].filter(
      (member) => member.player === true
    )
    if (player.length < 2) {
      const viewers = arrRoom[idRoomNumber]
        .filter((member) => member.player === false)
        .map((item, index) => {
          switch (player.length) {
            case 0:
              if (index === 0 || index === 1) {
                item.player = true
              }
            // eslint-disable-next-line no-fallthrough
            case 1:
              if (index === 0) {
                item.player = true
              }
              break
            default:
              break
          }
          return item
        })
      arrRoom[idRoomNumber] = [...player, ...viewers]
    }
  }

  const deleteMember = (idPlayer) => {
    let room = null
    let player = false
    arrRoom.forEach((element, index) => {
      element.forEach((item) => {
        if (item.idPlayer === idPlayer) {
          room = index
          player = item.player
        }
      })
    })

    if (typeof room === "number") {
      const dataRoomNew = arrRoom[room].filter(
        (member) => member.idPlayer !== idPlayer
      )
      arrRoom[room] = dataRoomNew
      return { room, player }
    } else {
      return { room, player }
    }
  }
}
