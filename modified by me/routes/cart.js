const express = require('express');
const { User, Product, Cart } = require('../models');

const router = express.Router();
router.get('/', async (req, res, next) => {
    try {
        const products = await Cart.findAll({
            where: {userId : req.user.id},
            attributes: ['id', 'productId', 'cost']
        });
        res.render('cart', {
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

router.post('/submit', async (req, res, next) => {
    const action = req.body.action;
    const cartId = req.body.id;
    if(action==='delete'){
        try{    
            const result = await Cart.destroy({
                where: { id: cartId }
            });
            if (result) res.redirect('/');
            else next('error');
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
    if(action==='payment'){
        res.send("결제중입니다.");
    }

});

module.exports = router;
