const express = require('express');
const Product = require('../models/product');

const { isLoggedIn } = require('./helpers');

const fs = require('fs');
const multer = require('multer');

const router = express.Router();

const DIR = 'public/'

try {
    fs.readdirSync(DIR);
} catch (error) {
    fs.mkdirSync(DIR);
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, DIR);
        },
        filename(req, file, done) {  
            done(null, `${Date.now()}_${file.originalname}`);
        }
    })
});

router.route('/')
    .get(isLoggedIn, async (req, res) => {
        try {
            const products = await Product.findAll({
                where: { userId: req.user.id },
                attributes: ['id', 'productPath', 'cost', 'comment']
            });
            res.render('product', {
                title: require('../package.json').name,
                port: process.env.PORT,
                user: req.user,
                product: products
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

router.post('/create', upload.single('file'), async (req, res, next) => {
        const userId = req.user.id;
        const file = req.file.path;
        const cost = req.body.cost;
        const comment = req.body.comment;
        try {
            console.log(file);
            await Product.create({ userId, productPath: file, cost, comment });
            res.redirect('/');
        } catch (err) {
            console.error(err);
            next(err);
        }
}); 

router.get('/delete/:id', async (req, res, next) => {
    try {
        const product = await Product.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'productPath']
        });
        fs.unlink(product.dataValues.productPath, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('파일이 성공적으로 삭제되었습니다.');}
            });
        const result = await Product.destroy({
            where: { id: req.params.id }
        });
        if (result) next();
        else next('error');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
