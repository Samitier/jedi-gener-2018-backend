class Card {
	define(db) {
		db.define("card", {
			value: {
				type: "text",
				required: true,
			},
			suit: {
				type: "text",
				required: true,
			},
			image: {
				type: "text"
			}
		})
	}

	associate (db) {
        let { card, deck } = db.models
        card.hasOne('deck', deck, { autoFetch: true, reverse: "cards" })
    }
}

module.exports = new Card()