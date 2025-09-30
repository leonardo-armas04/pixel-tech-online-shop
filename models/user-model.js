const bcrypt = require("bcryptjs")
const db = require("../database/database")
const mongoDB = require("mongodb")

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

    static findById(userId) {
        const uid = new mongoDB.ObjectId(userId)

        return db.getDB().collection("users")
            .findOne({ _id:uid },{ projection: { password: 0 } })
    }

    getUserWithSameEmail() {
        return db.getDB().collection("users").findOne({ email: this.email })
    }

    async existAlready() {
        const existingUser = await this.getUserWithSameEmail()
        if (existingUser) {
            return true
        } else {
            return false
        }
    }

    comparePassword(hassdedPassword) {
        return bcrypt.compare(this.password,hassdedPassword)
    }
}

module.exports = User