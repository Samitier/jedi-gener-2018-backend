const   bcrypt = require("bcrypt-nodejs"),
        jwt = require("jsonwebtoken"),
        { promisify } = require("util")

const   dbcontext = require("../database/dbcontext"),
        httpResponse = require("../utils/http-response")

let _generateToken = email => {
    return jwt.sign( 
        { email }, 
        process.env.SERVER_PRIVATE_KEY, 
        { expiresIn: "7 days" } 
    )
}

class AuthController {
    
    async login(req, res) {
        let { email, password } = req.body
        try {
            let users = await dbcontext.find("user", { email })
            if (!users.length || !bcrypt.compareSync(password, users[0].password)) {
                return httpResponse.unauthorized(res)
            }
            let token =  _generateToken(users[0].email)
            res.cookie("api-token", token)
            return httpResponse.ok(res, { token })
        }
        catch(e) {
            httpResponse.error(res, e)
        }
	}
	
	async signIn(req, res) {
		let user = req.body
		try {
			await dbcontext.create("user", user)
			let token =  _generateToken(user.email)
			res.cookie("api-token", token)
			return httpResponse.ok(res, { token })
		}
		catch(e) {
            httpResponse.badRequest(res, e)
        }
	}

    async authenticate(req, res, next) {
        let token = req.cookies["api-token"] || req.header["api-token"]
        if(!token) return httpResponse.unauthorized(res)
        let verify = promisify(jwt.verify)
        try {
            let decoded = await verify(token, process.env.SERVER_PRIVATE_KEY)
            let users = await dbcontext.find("user", { email: decoded.email })
            if (!users.length) return httpResponse.unauthorized(res, e)
            req.loggedUser = users[0]
            next()
        }
        catch(e) {
            httpResponse.unauthorized(res, e)
        }
    }
}

module.exports = new AuthController()