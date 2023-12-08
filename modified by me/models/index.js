const Sequelize = require('sequelize');
const User = require('./user');
const Product = require('./product');
const Cart = require('./cart');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

const db = {
    sequelize,
    User,
    Product,
    Cart
};

User.init(sequelize);
Product.init(sequelize);
Cart.init(sequelize);

User.associate(db);
Product.associate(db);
Cart.associate(db);

module.exports = db;
