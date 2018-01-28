/*
    This class will create all the available routes for the API & 
    relate them to the controller's middleware
*/ 
const express = require("express")

const   decksController = require("./controllers/decks.controller"),
        authController = require("./controllers/auth.controller"),
        cardsController = require("./controllers/cards.controller")


class Router {

    constructor() {
        this.router = express.Router()
        this.addRoutes()
    }

    addRoutes() {
        /*
            AUTH
        */
        this.router.post("/auth/login", authController.login)
        this.router.post("/auth/signin", authController.signIn)


        /*
            DECKS
        */
        this.router.route("/decks")
            .get(decksController.getAll)
            .post(authController.authenticate, decksController.create)
        this.router.route("/decks/:id")
            .get(decksController.getSingle)
            .put(authController.authenticate, decksController.update)
			.delete(authController.authenticate, decksController.remove)
			
        /*
            CARDS
        */
        this.router.route("/cards")
            .get(cardsController.getAll)
            .post(authController.authenticate, cardsController.create)
        this.router.route("/cards/:id")
            .get(cardsController.getSingle)
            .put(authController.authenticate, cardsController.update)
            .delete(authController.authenticate, cardsController.remove)
    }
}

module.exports = new Router().router