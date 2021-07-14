const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('AulaEtiqueta', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        idAula: {
            type: DataTypes.INTEGER,
            field: 'id_aula',
            allowNull: false,
            references:{
                model: 'Aula',
                key: 'id'
            }
        },
        idEtiqueta: {
            type: DataTypes.INTEGER,
            field: 'id_etiqueta',
            allowNull: false,
            references:{
                model: 'Etiqueta',
                key: 'id'
            }
        },
    }, {
        tableName: 'aula_etiqueta' // forcar o nome da tabela no banco
    });

    // sequelize.models.AulaEtiqueta.hasOne(sequelize.models.Etiqueta, {foreignKey: 'id', sourceKey: 'idEtiqueta', as:'detalhesEtiqueta'});
    // sequelize.models.AulaEtiqueta.hasOne(sequelize.models.Aula, {foreignKey: 'id', sourceKey: 'idAula', as:'detalhesAula'});

    sequelize.models.Aula.belongsToMany(sequelize.models.Etiqueta, {
        through: "AulaEtiqueta",
        as: "listaEtiquetas",
        foreignKey: "idAula" 
    });

    sequelize.models.Etiqueta.belongsToMany(sequelize.models.Aula, {
        through:"AulaEtiqueta",
        as: "listaAulas",
        foreignKey: "idEtiqueta" 
    });

};