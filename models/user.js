'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Transaction, {
        as : "users", foreignKey : "userId"
        // as : "transactions", foreignKey : "userId"
      })

      User.belongsToMany(models.Book, {
        through : {
          model : "BookUsers",
        },
        as : "purchasesbooks",
        foreignKey: "bookId"
      })
    }
  };
  User.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role: DataTypes.STRING,
    cloudinary_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};