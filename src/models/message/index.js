const mongoose = require('mongoose')
const { Schema, model } = require("mongoose")

const messageSchema = new Schema({
    text: String,
    sender: String,
    room: String})

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;