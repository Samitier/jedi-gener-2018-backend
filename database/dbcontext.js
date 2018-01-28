/*
    DbContext configures the database & worksas an interface for node orm
*/
const   orm = require("orm"),
        { promisify } = require("util")

const   deck = require("../models/deck.model"),
        user = require("../models/user.model")
        card = require("../models/card.model")
        // usersSeed = require("./seeds/users.seed")

class Dbcontext {
    
    constructor() {
        this.init()
    }

    _connect (connectionString) {
        let connect = promisify(orm.connect)
        return connect(connectionString)
    }

    _drop () {
        return new Promise ((resolve, reject) => {
            this.db.drop(err=>{
                if(err) reject(err)
                else resolve()
            })
        })
    }

    _sync() {
        return new Promise ((resolve, reject) => {
            this.db.sync(err=>{
                if(err) reject(err)
                else resolve()
            })
        })
    }

    async init() {
        try {
			// Connecting to the database
			this.db = await this._connect(process.env.DB_CONNECTION_STRING)
            console.log(" - Database connected successfully.")
            
            // Defining DB Models
            user.define(this.db)
            deck.define(this.db)
            card.define(this.db)

            // Defining DB Relationships
            deck.associate(this.db)
            card.associate(this.db)

            // Dropping database (if on development)
            if (process.env.ENV === 'development') {
                // await this._drop()
                // console.log(" - Database dropped.")
            }

            // Syncing database & creating tables
            await this._sync()
            console.log(" - Models synced successfully.")

            // Seeding all models (if on development)
            // if (process.env.ENV === 'development') {
			// 	this.create("user", usersSeed)
            //     console.log(" - Models seeded successfully.")
            // }
        }
        catch(err) {
            return console.error(err)
        }
    }

    get (model, id) {
        let get = promisify(this.db.models[model].get)
        return get(id)
    }

    find (model, where = {}) {
        let find = promisify(this.db.models[model].find)
        return find(where)
    }

    create (model, data) {
        let create = promisify(this.db.models[model].create)
        return create(data)
    }

    update (model, data) {
        return new Promise( (resolve, reject) => {
            model.save(data, (err, newQuote) => {
                if(err) reject(err)
                else resolve(newQuote)
            })
        })
    }

    remove (model) {
        let remove = promisify(model.remove)
        return remove()
    }
}

module.exports = new Dbcontext ()