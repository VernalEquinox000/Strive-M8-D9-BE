const mongoose = require('mongoose')
const MessageModel = require("../models/message/index")

const addMessage = async (sender, room, message) => {
  try {
    const newMessage = new MessageModel({ text: message, sender, room })
    const savedMessage = await newMessage.save()
    return savedMessage
    
  } catch (error) {
    console.log(error)
    
  }
}

module.exports = addMessage