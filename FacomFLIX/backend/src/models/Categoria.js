const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Categoria', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(500),
            allowNull: false,
        }
    }, {
        tableName: 'categoria' // forcar o nome da tabela no banco
    });
};