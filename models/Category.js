const mongoose = require("mongoose")

const Schema = mongoose.Schema


const CategorySchema = new Schema({
    name: { type: String, required: true, minLength: 5, maxLength: 100 },
    description: { type: String, required: true, minLength: 10, maxLength: 500 },
})

CategorySchema.virtual("url").get(function(){
    return `/Category/${this._id}`
})

module.exports = mongoose.model("Category" , CategorySchema)