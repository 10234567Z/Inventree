var express = require('express');
var router = express.Router();
const category_controller = require("../controllers/categoriesController")
const item_controller = require("../controllers/itemController")

/* GET home page. */
router.get('/', item_controller.index);

router.get('/categories', category_controller.categories_list)
router.get('/items' ,item_controller.item_list)
router.get('/categories/:id' , category_controller.categories_detail)

module.exports = router;
