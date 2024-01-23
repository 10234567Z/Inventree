const mongoose = require("mongoose")

const Schema = mongoose.Schema


const ItemSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
    description: { type: String, required: true, minLength: 10, maxLength: 500 },
    category: { type: Schema.Types.ObjectId, ref: "Item" },
    price: {type: Number , required: true , min: 1},
    in_stock: {type: Number , required: true , min: 0}
})


ItemSchema.virtual("url").get(function(){
    return `/items/${this._id}`;
})

module.exports = mongoose.model("Item" , ItemSchema)