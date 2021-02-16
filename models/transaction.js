'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Transaction.belongsTo(models.User, {
        as : "user", foreignKey:"userId"
      })

      Transaction.hasOne(models.PurchaseBook)
    }
  };
  Transaction.init({
    userId: DataTypes.INTEGER,
    attachment: DataTypes.STRING,
    cloudinary_id: DataTypes.STRING,
    totalPayment: DataTypes.INTEGER,
    userStatus: DataTypes.STRING,
    descCancel: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};