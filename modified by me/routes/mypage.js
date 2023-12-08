const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/user');

const { logout } = require('./helpers');


const router = express.Router();

router.route('/')
    .get(async (req, res, next) => 
    res.render('mypage', {
        title: require('../package.json').name,
        port: process.env.PORT,
        user: req.user
    }));

router.post('/update', async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        if(await bcrypt.compare(req.body.compare, hash)){
            const result = await User.update({
                password: hash,
                name: req.body.name
            },{
                where: { id: req.body.id }
            });
            if (result) res.redirect('/');
            else next(`There is no user with ${req.params.id}.`);
        }
        else{
            next('compare가 일치하지 않습니다.');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { id: req.params.id }
        });

        if (result) next();
        else next(`There is no user with ${req.params.id}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
}, logout);


module.exports = router;
