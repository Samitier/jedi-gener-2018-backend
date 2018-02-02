/*
    This class creates and configures the node Server
*/

const   express = require("express"),
        http = require("http"),
        bodyParser = require("body-parser"),
        cookieParser = require("cookie-parser"),
		path = require("path"),
		cors = require('cors')

const   router = require("./router")
        dbcontext = require("./database/dbcontext")
        
class Server {

    constructor() {
        this.init()
    }

    init() {
        this.app = express()
        // Setting the body parser to work with JSON
		this.app.use(bodyParser.json())
		this.app.use(cors())
        this.app.use(cookieParser())
        // Setting the static file server to the folder "public"
        this.app.use(express.static(path.join(__dirname, "./public")))
        // Adding the API routing
        this.app.use("/api", router)
        // Returning angular app if no middleware has been hit
		this.app.use(
            (req, res) => res.sendFile(path.join(__dirname, "./public/index.html"))
        )
    }

    // this function starts a server listening to the port "port"
    start(port=3000) {
        this.app.set('port', port)
        let server = http.createServer(this.app)
        server.listen(port)
        server.on(
            "listening",
            () => console.log("Server listening on port " + port)
        )
    }
}

module.exports = Server