const Category = require("../models/Category")
const Item = require("../models/Item")

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.categories_list = asyncHandler(async (req , res , next) => {
    const allCategories = await Category.find().exec()
    res.render("category_list" , {
        title: "List of Categories",
        allCategories: allCategories
    })
})

exports.categories_detail = asyncHandler(async (req , res , next ) => {
    const [category , category_items] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id} , "name").exec()
    ])

    if(category === null){
        const error = new Error("Author not found")
        error.status = 404
        return next(error)
    }

    res.render("category_detail" , {
        title: "Details of Category",
        category: category,
        category_items: category_items
    })
})