const 	dbcontext = require("../database/dbcontext"),
		httpResponse = require("../utils/http-response")

class DecksController {

    async getAll(req, res, next) {
        try {
            httpResponse.ok(res, await dbcontext.find("deck"))
        } 
        catch (error) {
            httpResponse.notFound(res, err)
        }
    }

    async getSingle(req, res, next) {
        let { id } = req.params
        try {
            httpResponse.ok(res, await dbcontext.get("deck", id))
        }
        catch(err) {
            httpResponse.notFound(res, err) 
        }
    }

    async create (req, res, next) {
		let userDeck = req.body
		userDeck.user_id = req.loggedUser.id
        try {
            httpResponse.ok(res, await dbcontext.create("deck", userDeck))
        }
        catch(err) {
            httpResponse.badRequest(res, err)
        }
    }

    async update (req, res, next) {
        let { id } = req.params,
			userDeck = req.body
		delete userDeck.user_id
		delete userDeck.id
        try {
			let deck = await dbcontext.get("deck", id)
			if (deck.user_id !== req.loggedUser.id) return httpResponse.badRequest(res, err)
            httpResponse.ok(res, await dbcontext.update(deck, userDeck))
        } 
        catch (err) {
            httpResponse.badRequest(res, err)
        }
    }

    async remove(req, res, next) {
        let { id } = req.params
        try {
            let deck = await dbcontext.get("deck", id)
            await dbcontext.remove(deck)
            httpResponse.ok(res, deck)
        }
        catch(err) {
            httpResponse.badRequest(res, err)
        }
    }
}

module.exports = new DecksController()