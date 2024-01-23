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