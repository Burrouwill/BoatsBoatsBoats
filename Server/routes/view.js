var express = require('express');
var router = express.Router();
var ProductController = require('../controllers/product');

router.get('/', async function(req, res) {
    const controller = new ProductController(res.locals.dburi,'products');
    const product = await controller.getData(7);
    res.render("home", {
        // TODO:, replace this with array of actual `Boat[]` from db
        products: [
            product,
        ],
        admin: true // TODO: Decide by authorization
    });
});

router.get('/login', function(req, res) {
    res.render("login", { layout: 'basic' });
});

router.get('/register', function(req, res) {
    res.render("register", { layout: 'basic' });
});

router.get('/products/:productId/edit', async function(req, res) {
    const controller = new ProductController(res.locals.dburi,'products');
    const product = await controller.getData(req.params.productId);
    res.render("product_edit", { product });
});

router.get('/products/new', async function(req, res) {
    res.render("product_edit", { creation: true, product: { name: "New Product", imgUrl: "/assets/boats/Add.png", description: "Fill out description", price: 14.99 } });
});

module.exports = router;
