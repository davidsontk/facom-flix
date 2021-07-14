'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('aula', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      link: {
        type: Sequelize.STRING(150),
        allowNull: false,
        field: 'link_aula'
      },
      nome: {
        type: Sequelize.STRING(70),
        allowNull:  false
      },
      quantidadeDeVisualizacoes: {
        type: Sequelize.INTEGER,
        allowNull:  true,
        field: 'quantidade_de_visualizacoes'
      },
      usuarioUpload: {
        type: Sequelize.INTEGER,
        field: 'fk_usuario_upload',
        allowNull: false,
        references:{
          model:{
            tableName: 'usuario',
            schema: 'public'
          }, 
          key: 'id'
        }
      },
      serie: {
        type: Sequelize.INTEGER,
        field: 'fk_serie',
        allowNull: false,
        references:{
          model: {
            tableName: 'serie_de_aula',
            schema: 'public'
          },
           key: 'id'
        }
      },
      categoria: {
        type: Sequelize.INTEGER,
        field: 'fk_categoria',
          allowNull: false,
          references:{
            model: {
            tableName: 'categoria',
            schema: 'public'
            },
            key: 'id' 
        }
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('aula');
  }
};