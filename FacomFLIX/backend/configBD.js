const { Sequelize } = require('sequelize');

var sequelize = new Sequelize('drj55vn7c0l36', 'fcaqeicsrqrwzg', 'bd8eb106388752416a310b8ca07ac2f1b87011a45764b9e3e43b6ea0f53024e1', {
    host: 'ec2-54-156-121-142.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: '5432',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    ssl: true,
    define: {
      timestamps: false  // para tirar as colunas loucas que aparece
    },
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        native: true
      }
  });

  const modelDefiners = [
    require('./src/models/TipoUsuario'),
    require('./src/models/Usuario'),
    require('./src/models/Serie'),
    require('./src/models/Categoria'),
    require('./src/models/Aula'),
    require('./src/models/Etiqueta'),
    require('./src/models/AulaEtiqueta'),
    require('./src/models/Comentario')


	// Add more models here...
	// require('./models/item'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

module.exports = sequelize;