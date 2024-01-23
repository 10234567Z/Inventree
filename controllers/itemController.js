const Category = require("../models/Category")
const Item = require("../models/Item")

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
    const [categoriesNum, itemsNum] = await Promise.all([
        Category.countDocuments({}).exec(),
        Item.countDocuments({}).exec()
    ])

    res.render("index", {
        title: "Inventree",
        categoriesNum: categoriesNum,
        itemsNum: itemsNum
    })
})

exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item.find({}, "name").exec()
    res.render("item_list", {
        title: "List of Items",
        allItems: allItems
    })
})
exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec()

    if (item === null) {
        const error = new Error("item not found")
        error.status = 404
        return next(error)
    }

    res.render("item_detail", {
        title: "Details of Item",
        item: item
    })
})

exports.item_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, "name").exec()
    res.render("item_form", {
        title: "Create Item",
        allCategories: allCategories,
    });
})

exports.item_create_post = [
    body("name")
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage("Name too small")
        .isLength({ max: 100 })
        .withMessage("Too many characters in name"),
    body("description")
        .trim()
        .isLength({ min: 10 })
        .escape()
        .withMessage("Description too small")
        .isLength({ max: 500 })
        .withMessage("Description word limit reached"),
    body("price")
        .trim()
        .isInt({ min: 1 })
        .escape()
        .withMessage("Price too small"),
    body("in_stock")
        .trim()
        .isInt({ min: 1 })
        .escape()
        .withMessage("Stock can't be in negative"),
    asyncHandler(async (req, res, enxt) => {
        const error = validationResult(req)

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            in_stock: req.body.in_stock
        })

        const allCategories = await Category.find({}, "name").exec()

        if (!error.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("item_form", {
                title: "Create Item",
                item: item,
                allCategories: allCategories,
                errors: error.array(),
            });
            return;
        } else {
            // Data from form is valid.

            // Save author.
            await item.save();
            // Redirect to new author record.
            res.redirect(item.url);
        }
    })
]

exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id)
        .populate("category")
        .exec();

    if (item === null) {
        // No results.
        res.redirect("/items");
    }

    res.render("item_delete", {
        title: "Delete Item",
        item: item,
    });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    await Item.findByIdAndDelete(req.body.id);
    res.redirect("/items");
});