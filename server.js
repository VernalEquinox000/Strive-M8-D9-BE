const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http") //need to be added
const routes = require("./src/routes");

//new stuff for the socket
const createSocketServer = require("./socket")

const {
	notFoundHandler,
	forbiddenHandler,
	badRequestHandler,
	unAuthorizedHandler,
	genericHandler,
} = require("./src/helpers/errorHandling");

//INITIAL SETUP
const server = express();
const port = process.env.PORT;
const mongodbUri = process.env.MONGODB_URI;

//NEW STUFF----httpServer for socket
const httpServer = http.createServer(server)
createSocketServer(httpServer)

// MIDDLEWARES
server.use(cors());
server.use(express.json());

//ROUTES
server.use("/api", routes);

//ERROR HANDLING MIDDLEWARES
server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(unAuthorizedHandler);
server.use(genericHandler);

//CONNECTION
mongoose
	.connect(mongodbUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to DB..."))
	.catch((e) => console.log("DB connection error:", e));

httpServer.listen(port, () => {
	if (server.get("env") === "production") {
		console.log("Server is running on CLOUD on Port: ", port);
	} else {
		console.log("Server is running LOCALLY on Port: ", port);
	}
});
