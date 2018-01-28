/*
    Initialize the server & set the global vars via dotenv
*/

require("dotenv").config()
const Server = require("../app")

let server = new Server()
server.start(process.env.PORT)