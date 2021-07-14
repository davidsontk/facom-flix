const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Etiqueta', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        }
    }, {
        tableName: 'etiqueta' // forcar o nome da tabela no banco
    });
};