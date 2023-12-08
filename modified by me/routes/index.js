const express = require('express');
const { User, Product, Cart } = require('../models');


const router = express.Router();
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'productPath', 'cost', 'comment', 'userId']
        });
        res.render('index', {
            title: require('../package.json').name,
            port: process.env.PORT,
            user: req.user,
            product: products,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/add/:id', async (req, res, next) => {
    const userId = req.user.id;
    const product = await Product.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'productPath', 'cost']
    });
    const productId = product.productPath;
    const cost = product.cost;
    const check = await Cart.findOne({
        where: {userId, productId}
    });
    if(!check){
    try {
        await Cart.create({ userId, productId, cost });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }}
    else{
        res.send("이미 장바구니에 포함된 항목입니다.");
    }
});

module.exports = router;
