const RoomModel = require("../services/rooms/schema")

const addUserToRoom = async ({ username, socketId, room }) => {
  try {
    const user = await RoomModel.findOne({
      name: room,
      "members.username": username,
    })

    if (user) {
      // if user is already in room let's update sockedId

      await RoomModel.findOneAndUpdate(
        { name: room, "members.username": username },
        { "members.$.socketId": socketId }
      )
    } else {
      // if it is not let's add it to the members
      const newRoom = await RoomModel.findOneAndUpdate(
        { name: room },
        { $addToSet: { members: { username, socketId } } }
      )
    }
    return { username, room }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {addUserToRoom}