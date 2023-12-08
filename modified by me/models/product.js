const Sequelize = require('sequelize');

module.exports = class Product extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      productPath: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      cost: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      comment: {
        type: Sequelize.STRING(300),
        allowNull: false,
      }
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Product',
      tableName: 'products',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Product.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    //db.Comment.hasMany(db.Cart, { foreignKey: 'productId', sourceKey: 'productPath', onDelete: 'cascade' });
  }
};
