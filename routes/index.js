var express = require('express');
var router = express.Router();
const category_controller = require("../controllers/categoriesController")
const item_controller = require("../controllers/itemController")

/* GET home page. */
router.get('/', item_controller.index);

router.get('/categories', category_controller.categories_list)
router.get('/items' ,item_controller.item_list)
router.get('/categories/:id' , category_controller.categories_detail)
router.get('/items/:id', item_controller.item_detail)

router.get('/item/create' , item_controller.item_create_get)
router.post('/item/create' , item_controller.item_create_post)

router.get('/category/create' , category_controller.category_create_get)
router.post('/category/create' , category_controller.category_create_post)

router.get('/items/:id/delete' , item_controller.item_delete_get)
router.post('/items/:id/delete' , item_controller.item_delete_post)

router.get('/categories/:id/delete' , category_controller.category_delete_get)
router.post('/categories/:id/delete' , category_controller.category_delete_post)

router.get('/categories/:id/update' , category_controller.category_update_get)
router.post('/categories/:id/update' , category_controller.category_update_post)

router.get('/items/:id/update' , item_controller.item_update_get)
router.post('/items/:id/update' , item_controller.item_update_post)

module.exports = router;
