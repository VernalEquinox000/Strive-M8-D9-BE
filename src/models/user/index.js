const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		username: { type: String },
		bio: { type: String },
		title: { type: String },
		area: { type: String },
		image: {
			type: String,
			default:
				"https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-24.jpg",
		},
		experiences: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" },
		],
		friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		friendRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		refreshTokens : [{token: { type: String}}]
	},
	{ timestamp: true }
);

/**
 * Enyrcyp user password before saving DB
 */
userSchema.methods.hashPassword = async function () {
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (error) {
		console.log("Bcryp hash error: ", error);
		next(error);
	}
};

/*
 * Checks entered password and hashed password in DB
 * returns boolean
 * @param {String} enteredPassword
 */
/* userSchema.methods.isValidPassword = async function (enteredPassword) {
	try {
		return await bcrypt.compare(enteredPassword, this.password);
	} catch (error) {
		console.log("Bcrypt password check error: ", error);
		next(error);
	}
}; */

userSchema.pre("save", async function (next) {
    const user = this // 
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8)
    /*     bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("B4c0/\/", salt, function(err, hash) {
        // Store hash in your password DB.
    }); */
    }
    next()
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.__v

    return userObj
}

userSchema.statics.findByCredentials = async function (name, password) {
    console.log(name,password)
    const user = await this.findOne({ name })
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) return user
        else return ("password not valid")
    }
    else return ("user not found!")
    }

const User = mongoose.model("User", userSchema);
module.exports = User;
