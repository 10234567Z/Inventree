const Category = require("../models/Category")
const Item = require("../models/Item")

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async(req , res , next) => {
    const [categoriesNum , itemsNum ] = await Promise.all([
        Category.countDocuments({}).exec(),
        Item.countDocuments({}).exec()
    ])

    res.render("index", {
        title: "Inventree",
        categoriesNum: categoriesNum,
        itemsNum: itemsNum
    })
})

exports.item_list = asyncHandler(async(req , res , next) =>{
    const allItems = await Item.find({} , "name").exec()
    res.render("item_list" , {
        title: "List of Items",
        allItems: allItems
    })
})
exports.item_detail = asyncHandler(async (req , res , next ) => {
    const item = await Item.findById(req.params.id).exec()

    if(item === null){
        const error = new Error("item not found")
        error.status = 404
        return next(error)
    }

    res.render("item_detail" , {
        title: "Details of Item",
        item: item
    })
})