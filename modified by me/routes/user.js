const express = require('express');
const bcrypt = require('bcrypt')
const User = require('../models/user');

const router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
        try {
            const users = await User.findAll({
                attributes: ['id']
            });

            res.render('user', {
                title: require('../package.json').name,
                port: process.env.PORT,
                users: users.map(user => user.id)
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        const { id, password, name } = req.body;

        const user = await User.findOne({ where: { id } });
        if (user) {
            next('이미 등록된 사용자 아이디입니다.');
            return;
        }
        try {
            const hash = await bcrypt.hash(password, 12);
            if(await bcrypt.compare(req.body.compare, hash)){
            await User.create({
                id,
                password: hash,
                name
            });

            res.redirect('/');
        }
        else{
            next('비밀번호가 일치하지 않습니다.');
        }
        } catch (err) {
                console.error(err);
                next(err);
            }
        }

    );

module.exports = router;
