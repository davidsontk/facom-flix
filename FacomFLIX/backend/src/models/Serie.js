const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('SerieAula', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        descricao: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        nome: {
            type: DataTypes.STRING(500),
            allowNull: false,
        }
    }, {
        tableName: 'serie_de_aula' // forcar o nome da tabela no banco
    });
};