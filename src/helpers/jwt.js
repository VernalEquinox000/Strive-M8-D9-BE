const jwt = require("jsonwebtoken");

const { JWT_SECRET, JTW_REFRESH_SECRET } = process.env;
const User = require("../models/user")
/*
 * @param {Object} newUser
 */
/* exports.signJWT = (payload) => {
	const modifiedPayload = {
		iss: "linkedin",
		sub: payload._id,
		iat: new Date().getTime(),
	};

	return JWT.sign(modifiedPayload, JWT_SECRET, { expiresIn: "20d" });
}; */
const authenticate = async user => {
	try {
		const newAccessToken = await generateToken({ _id: user._id })
		const newRefreshToken = await generateRefreshToken({ _id: user._id })
		user.refreshTokens = user.refreshTokens.concat({token:newRefreshToken})
		await user.save()

		return {token: newAccessToken, refreshToken: newRefreshToken}
	} catch (error) {
		console.log(error)
		throw new ApiError()
		
	}
}

const generateToken = payload => 
	new Promise((res, rej) => 
		jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (error, token) => {
			if (error) rej(error)
			res(token)
		}))

const verifyToken = token => 
	new Promise((res, rej) => {
		jwt.verify(token, JWT_SECRET, (error, decoded) => {
			if (error) rej(error)
			res(decoded)
	})
	})

const generateRefreshToken = payload => 
	new Promise((res, rej) => 
		jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "1h" }, (error, token) => {
			if (error) rej(error)
			res(token)
		}))

const verifyRefreshToken = token => 
	new Promise((res, rej) => {
		jwt.verify(token, JWT_REFRESH_SECRET, (error, decoded) => {
			if (error) rej(error)
			res(decoded)
	})
	})


const refreshToken = async oldRefreshToken => {
    const decoded = await verifyRefreshToken(oldRefreshToken)
    
    const user = await user.findOne({ _id: decoded._id })
    
    if (!user) {
        throw new Error("where d'you think to go?!")
    
    }

    const currentRefreshToken = user.refreshTokens.find(
        t=>t.token ===oldRefreshToken
    )

    if (!currentRefreshToken) { throw new ApiError("your token sucks") }


    const newAccessToken = await generateToken({ _id: user._id })
    const newRefreshToken = await generateRefreshToken({ _id: user._id })

    const newRefreshTokens = user.refreshTokens
        .filter(t => t.token != oldRefreshToken).concat({ token: newRefreshToken })
    
    user.refreshTokens = [...newRefreshTokens]
    
    await user.save()
    return {token:newAccessToken, refreshToken:newRefreshToken}
    
}

    module.exports = {authenticate, generateToken, verifyToken, refreshToken}