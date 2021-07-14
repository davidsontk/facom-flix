const { DataTypes } = require('sequelize');
const bcrypt = require("bcrypt");


 module.exports = (sequelize) => {
    sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            field: 'id_usuario',
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        dataCriacao: {
            type: DataTypes.DATE,
            field: 'data_criacao',
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        login: {
            type: DataTypes.STRING(25),
            allowNull: false,
        },
        tipoUsuario: {
            type: DataTypes.INTEGER,
            field: 'fk_tipo_usuario',
            allowNull: false,
            references:{
                model: 'TipoUsuario',
                key: 'id'
            } 
        },
        matricula: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, 
    {
        tableName: 'usuario', // forcar o nome da tabela no banco
        hooks: {
            beforeCreate:async (usuario, options) => {
                let hash = await  bcrypt.hash(usuario.senha, bcrypt.genSaltSync(8));
                usuario.senha = hash;
            }
        }
    });
};