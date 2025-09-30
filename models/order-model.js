const db = require("../database/database")
const mongoDB = require("mongodb")

class Order {
    // status => pending, fulfilled, canceled
    constructor(cart,userData,status="pending",date,orderId) {
        this.productData = cart
        this.userData = userData
        this.status = status
        this.date = new Date(date)
        if (this.date) {
            this.formattedDate = this.date.toLocaleDateString("en-CA",{
                weekday: "short",
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        }
        this.id = orderId
    }

    static transformOrderDocument(orderDoc) {
        return new Order(
            orderDoc.productData,
            orderDoc.userData,
            orderDoc.status,
            orderDoc.date,
            orderDoc._id
        );
    }

    static transformOrderDocuments(orderDocs) {
        return orderDocs.map(this.transformOrderDocument);
    }

    static async findAll() {
        const orders = await db
            .getDB()
            .collection('orders')
            .find()
            .sort({ _id: -1 })
            .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findAllForUser(userId) {
        const uid = new mongoDB.ObjectId(userId);

        const orders = await db
            .getDB()
            .collection('orders')
            .find({ 'userData._id': uid })
            .sort({ _id: -1 })
            .toArray();

        return this.transformOrderDocuments(orders);
    }

    static async findById(orderId) {
        const order = await db
            .getDB()
            .collection('orders')
            .findOne({ _id: new mongoDB.ObjectId(orderId) });

        return this.transformOrderDocument(order);
    }

    save() {
        if (this.id) {
            // Updating
            const orderId = new mongoDB.ObjectId(this.id);
            return db
                .getDB()
                .collection('orders')
                .updateOne({ _id: orderId }, { $set: { status: this.status } })
        } else {
            // Adding a new
            const orderDocument = {
                userData: this.userData,
                productData: this.productData,
                date: new Date(),
                status: this.status
            }

            return db.getDB().collection("orders").insertOne(orderDocument)
        }
    }
}

module.exports = Order