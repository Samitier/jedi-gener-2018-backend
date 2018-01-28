const 	dbcontext = require("../database/dbcontext"),
		httpResponse = require("../utils/http-response")

class CardsController {

    async getAll(req, res, next) {
        try {
            httpResponse.ok(res, await dbcontext.find("card"))
        } 
        catch (error) {
            httpResponse.notFound(res, err)
        }
    }

    async getSingle(req, res, next) {
        let { id } = req.params
        try {
            httpResponse.ok(res, await dbcontext.get("card", id))
        }
        catch(err) {
            httpResponse.notFound(res, err) 
        }
    }

    async create (req, res, next) {
		let userCard = req.body
        try {
            httpResponse.ok(res, await dbcontext.create("card", userCard))
        }
        catch(err) {
            httpResponse.badRequest(res, err)
        }
    }

    async update (req, res, next) {
        let { id } = req.params,
			userCard = req.body
		delete userCard.id
        try {
			let card = await dbcontext.get("card", id)
			if (card.deck.user_id !== req.loggedUser.id) return httpResponse.badRequest(res, err)
            httpResponse.ok(res, await dbcontext.update(card, userCard))
        } 
        catch (err) {
            httpResponse.badRequest(res, err)
        }
    }

    async remove(req, res, next) {
        let { id } = req.params
        try {
            let card = await dbcontext.get("card", id)
            await dbcontext.remove(card)
            httpResponse.ok(res, card)
        }
        catch(err) {
            httpResponse.badRequest(res, err)
        }
    }
}

module.exports = new CardsController()