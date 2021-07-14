const { DataTypes } = require('sequelize');

 module.exports = (sequelize) => {
    sequelize.define('TipoUsuario', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        descricao: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    }, {
        tableName: 'tipo_usuario' // forcar o nome da tabela no banco
    });
};


