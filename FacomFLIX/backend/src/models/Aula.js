const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Aula', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        link: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'link_aula'
        },
        nome: {
            type: DataTypes.STRING(70),
            allowNull:  false
        },
        quantidadeDeVisualizacoes: {
            type: DataTypes.INTEGER,
            allowNull:  true,
            field: 'quantidade_de_visualizacoes'
        },
        usuarioUpload: {
            type: DataTypes.INTEGER,
            field: 'fk_usuario_upload',
            allowNull: false,
            references:{
                model: 'Usuario',
                key: 'id'
            }
        },
        serie: {
            type: DataTypes.INTEGER,
            field: 'fk_serie',
            allowNull: false,
            references:{
                model: 'SerieAula',
                key: 'id'
            }
        },
        categoria: {
            type: DataTypes.INTEGER,
            field: 'fk_categoria',
            allowNull: false,
            references:{
                model: 'Categoria',
                key: 'id'
            }
        }
    }, {
        tableName: 'aula' // forcar o nome da tabela no banco
    });

    // sequelize.models.Aula.hasOne(sequelize.models.Usuario, {foreignKey: 'id', sourceKey: 'usuarioUpload'}); -- n precisamos no momento
    sequelize.models.Aula.hasOne(sequelize.models.Categoria, {foreignKey: 'id', sourceKey: 'categoria', as:'detalhesCategoria'});
    sequelize.models.Aula.hasOne(sequelize.models.SerieAula, {foreignKey: 'id', sourceKey: 'serie', as:'detalhesSerie'});
    //sequelize.models.Categoria.belongsTo(sequelize.models.Aula); -- se categoria tivesse uma key de Usuario, teria que adicionar isso aqui
};
