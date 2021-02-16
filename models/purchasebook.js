'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PurchaseBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PurchaseBook.belongsTo(models.Transaction,{
        as : "PurchasedBooks", foreignKey : "transactionId"
      })

      PurchaseBook.belongsTo(models.Book, {
        as : "book"
      })
    }
  };
  PurchaseBook.init({
    transactionId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PurchaseBook',
  });
  return PurchaseBook;
};