'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(200),
        allowNull:false
      },
      dataCriacao: {
        type: Sequelize.DATE,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      login: {
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      tipoUsuario: {
        type: Sequelize.INTEGER,
        field: 'fk_tipo_usuario',
        allowNull: false,
        references:{
          model: {
            tableName: 'tipo_usuario',
            schema: 'public'
          },
          key: 'id'
        } 
      },
      matricula: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuario');
  }
};