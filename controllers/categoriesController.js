const Category = require("../models/Category")
const Item = require("../models/Item")

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.categories_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().exec()
    res.render("category_list", {
        title: "List of Categories",
        allCategories: allCategories
    })
})

exports.categories_detail = asyncHandler(async (req, res, next) => {
    const [category, category_items] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name").exec()
    ])

    if (category === null) {
        const error = new Error("Item not found")
        error.status = 404
        return next(error)
    }

    res.render("category_detail", {
        title: "Details of Category",
        category: category,
        category_items: category_items
    })
})


exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", { title: "Create Category" })
})

exports.category_create_post = [
    body("name")
        .trim()
        .isLength({ min: 5 })
        .escape()
        .withMessage("Too small name for genre")
        .isLength({ max: 100 })
        .withMessage("Too long name for genre"),
    body("description")
        .trim()
        .isLength({ min: 10 })
        .escape()
        .withMessage("Description too small")
        .isLength({ max: 500 })
        .withMessage("Description word limit reached"),
    asyncHandler(async (req, res, next) => {
        const error = validationResult(req)

        const category = new Category({
            name: req.body.name,
            description: req.body.description
        })

        if (!error.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: error.array(),
            });
            return;
        } else {
            // Data from form is valid.

            // Save author.
            await category.save();
            // Redirect to new author record.
            res.redirect(category.url);
        }
    })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, category_items] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name").exec()
    ])


    if (category === null) {
        res.redirect("/categories")
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_items: category_items
    })
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, category_items] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name").exec()
    ])

    if (category_items.length > 0) {
        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            category_items: category_items
        })
        return
    }
    else {
        await Category.findByIdAndDelete(req.body.id)
        res.redirect("/categories")
    }
})

exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (category === null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
    }

    res.render("category_form", {
        title: "Update Category",
        category: category
    });
})

exports.category_update_post = [
    body("name")
        .trim()
        .isLength({ min: 5 })
        .escape()
        .withMessage("Too small name for genre")
        .isLength({ max: 100 })
        .withMessage("Too long name for genre"),
    body("description")
        .trim()
        .isLength({ min: 10 })
        .escape()
        .withMessage("Description too small")
        .isLength({ max: 500 })
        .withMessage("Description word limit reached"),
    asyncHandler(async (req, res, next) => {
        const error = validationResult(req)

        const category = new Category({
            _id: req.params.id,
            name: req.body.name,
            description: req.body.description
        })

        if (!error.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: error.array(),
            });
            return;
        } else {
            // Data from form is valid.

            // Save author.
            await Category.findByIdAndUpdate(req.params.id , category)
            // Redirect to new author record.
            res.redirect(category.url);
        }
    })
]