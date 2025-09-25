const bcrypt = require("bcryptjs")
const db = require("../database/database")

class User {
    constructor(email,password,name,lastName,street,postalCode,city) {
        this.email = email
        this.password = password
        this.name = name
        this.lastName = lastName
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

    getUserWithSameEmail() {
        return db.getDB().collection("users").findOne({ email: this.email })
    }

    comparePassword(hassdedPassword) {
        return bcrypt.compare(this.password,hassdedPassword)
    }
}

module.exports = User