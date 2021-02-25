const User = require("../models/user")
const { verifyToken } = require("../helpers/jwt")

const authorize = async (req, res, next) => {
    try {

        const token = req.header("Authorization").replace("Bearer", "")
        const decoded = await verifyToken(token)
        const user = await User.findOne({ _id: decoded._id })
        console.log(decoded._id)

        if (!user) { throw new Error("No user found!") }
        
        req.token = token
        req.user = user
        next()

    } catch (error) {
        console.log(error)
        next(error)
        
    }
}

module.exports = { authorize }