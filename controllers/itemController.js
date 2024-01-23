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