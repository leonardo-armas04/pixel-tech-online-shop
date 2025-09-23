const bcrypt = require("bcryptjs")
const db = require("../database/database")

class User {
    constructor(name,lastName,email,password,street,postalCode,city) {
        this.name = name
        this.lastName = lastName
        this.email = email
        this.password = password
        this.address = {
            street: street,
            postalCode: postalCode,
            city: city
        }
    }

    // Store user data in the database
    async signUp() {
        const hassdedPassword = await bcrypt.hash(this.password,12)
        await db.getDB().collection("users").insertOne({
            name: this.name,
            lastname: this.lastName,
            email: this.email,
            password: hassdedPassword,
            address: this.address
        })
    }
}

module.exports = User