'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Aula extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Aula.init({
    link: DataTypes.STRING,
    nome: DataTypes.STRING,
    quantidadeDeVisualizacoes: DataTypes.INTEGER,
    usuarioUpload: DataTypes.INTEGER,
    serie: DataTypes.INTEGER,
    categoria: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Aula',
  });
  return Aula;
};