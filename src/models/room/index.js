const mongoose = require('mongoose')
const { Schema, model } = require("mongoose")

const roomSchema = new Schema({
  name: String,
  members: [{ username: String, socketId: String }],
})
const Room = mongoose.model("Room", roomSchema);
module.exports = Room;