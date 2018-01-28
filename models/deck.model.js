class Deck {
	define(db) {
		db.define("deck", {
			title: {
				type: "text",
				required: true,
			},
			description: {
				type: "text",
			},
		})
	}

	associate (db) {
        let { user, deck } = db.models
        deck.hasOne('user', user, { reverse: "decks" })
    }
}

module.exports = new Deck()