'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsToMany(models.User, {
        through : {
          model : "PurchaseBooks"
        }
      })

      Book.hasMany(models.PurchaseBook, {
        as : "purchasedBook", foreignKey : "id"
      })
    }
  };
  Book.init({
    title: DataTypes.STRING,
    publicationDate: DataTypes.DATE,
    pages: DataTypes.INTEGER,
    author: DataTypes.STRING,
    isbn: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    cloudinary_id_bookFile: DataTypes.STRING,
    cloudinary_id: DataTypes.STRING,
    bookFile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};