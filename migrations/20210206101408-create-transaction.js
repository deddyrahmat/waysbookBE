'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      numberAccount: {
        type: Sequelize.STRING
      },
      transferProof: {
        type: Sequelize.STRING
      },
      cloudinary_id: {
        type: Sequelize.STRING
      },
      remainingActive: {
        type: Sequelize.INTEGER
      },
      userStatus: {
        type: Sequelize.STRING
      },
      paymentStatus: {
        type: Sequelize.STRING
      },
      descCancel: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};