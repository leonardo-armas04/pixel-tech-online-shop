const mongodb = require("mongodb")
const db = require("../database/database")

class Product {
    constructor(productData) {
        this.title = productData.title,
        this.summary = productData.summary,
        this.price = +productData.price, // forces a convertion to a number
        this.description = productData.description,
        this.image = productData.image // name of the image file
        this.updateImageData()
        if (productData._id) {
            this.id = productData._id.toString()
        }
    }

    static async findAll() {
        const products = await db.getDB().collection("products").find().toArray()

        return products.map((productDocument) => {
            return new Product(productDocument)
        })
    }

    async save() {
        const productDocument = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image
        }

        if (this.id) {
            const productId = new mongodb.ObjectId(this.id)

            if (!this.image) {
                delete productDocument.image
            }

            await db.getDB()
                .collection("products")
                .updateOne({_id: productId},{$set:productDocument})
        } else {
            await db.getDB().collection("products").insertOne(productDocument)
        }

    }

    replaceImage(newImage) {
        this.image = newImage
        this.updateImageData()
    }

    updateImageData() {
        this.imagePath = `product-data/images/${this.image}`
        this.imageURL = `/products/assets/images/${this.image}`
    }

    static async findById(productId) {
        let prodId
        try {
            prodId = new mongodb.ObjectId(productId)
        } catch (error) {
            error.code = 404
            throw error
        }
        const product = await db.getDB().collection("products").findOne({_id:prodId})
        if (!product) {
            const error = new Error("Could not find product with provided ID")
            error.code = 404
            throw error
        }
        return new Product(product)
    }

    remove() {
        const productId = new mongodb.ObjectId(this.id)
        return db.getDB().collection("products").deleteOne({_id: productId})
    }
}

module.exports = Product