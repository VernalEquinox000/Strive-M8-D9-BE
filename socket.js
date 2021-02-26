const socketio = require("socket.io");

const {addUserToRoom,getUsersInRoom, getUsersBySocket} = require("./src/socket_utils/users")
const addMessage = require("./src/socket_utils/messages")


//create socket server
const createSocketServer = server => {
    const io = socketio(server)

    io.on("connection", socket => {
        console.log(`new socket  connection ---> ${socket.id}`)

        socket.on("joinRoom", async data => {
            try {
                const { username, room } = await addUserToRoom({
                    socketId: socket.id,
                    ...data
                })
                socket.join(room)

                const messageToRoomMembers = {
                    sender: "Admin",
                    text: `${username} has joined the room`,
                    createdAt: new Date(),
                }

                socket.broadcast.to(room).emit("message", messageToRoomMembers)

                const roomMembers = await getUsersInRoom(room)

                io.to(room).emit("roomData", { room, users: roomMembers })
            
            } catch (error) {
                console.log(error)
            }
        })
        socket.on("sendMessage", async ({ room, message }) => {
            const user = await getUsersBySocket(room, socket.id)
            const messageContent = {
                text: message, sender: user.username, room,
            }
            await addMessage(messageContent.sender, room, messageContent.text)

            io.to(room).emit("message", messageContent)
        })
    })
}

module.exports = createSocketServer