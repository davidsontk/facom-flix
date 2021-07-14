const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Comentario', {descricao: {
            type: DataTypes.STRING(280),
            allowNull: false,
            field: 'descricao'
        },
        usuario: {
            type: DataTypes.INTEGER,
            field: 'fk_usuario_assistente',
            allowNull: false,
            references:{
                model: 'Usuario',
                key: 'id'
            }
        },
        aula: {
            type: DataTypes.INTEGER,
            field: 'fk_aula',
            allowNull: false,
            references:{
                model: 'Aula',
                key: 'id'
            }
        },
    }, {
        tableName: 'comentario' // forcar o nome da tabela no banco
    });

    sequelize.models.Comentario.hasOne(sequelize.models.Aula, {foreignKey: 'id', sourceKey: 'aula', as:'detalhesAula'});
    sequelize.models.Comentario.hasOne(sequelize.models.Usuario, {foreignKey: 'id', sourceKey: 'usuario', as:'detalhesUsuario'});
};
