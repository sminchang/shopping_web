const Sequelize = require('sequelize');

module.exports = class Cart extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      productId: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cost: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Cart',
      tableName: 'carts',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Cart.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    //db.Cart.belongsTo(db.Comment, { foreignKey: 'productId', targetKey: 'comment', onDelete:'CASCADE' });
  }
};
