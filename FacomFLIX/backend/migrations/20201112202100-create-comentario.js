'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comentario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      descricao: {
        type: Sequelize.STRING(280),
        allowNull: false,
        field: 'descricao'
      },
      usuario: {
        type: Sequelize.INTEGER,
        field: 'fk_usuario_assistente',
        allowNull: false,
        references:{
          model:{
            tableName: 'usuario',
            schema: 'public'
          }, 
          key: 'id'
        }
      },
      aula: {
        type: Sequelize.INTEGER,
        field: 'fk_aula',
        allowNull: false,
        references:{
          model: {
            tableName: 'aula',
            schema: 'public'
          },
           key: 'id'
        }
      },    
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comentario');
  }
};