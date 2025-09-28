const db = require("../database/database")

class Product {
    constructor(productData) {
        this.title = productData.title,
        this.summary = productData.summary,
        this.price = +productData.price, // forces a convertion to a number
        this.description = productData.description,
        this.image = productData.image // name of the image file
        this.imagePath = `product-data/images/${productData.image}`
        this.imageURL = `/products/assets/images/${productData.image}`
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
        await db.getDB().collection("products").insertOne(productDocument)
    }
}

module.exports = Product