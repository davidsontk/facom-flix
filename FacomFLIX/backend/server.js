const express = require("express");
const cors = require("cors");
const sequelize = require("./configBD");
const app = express();

app.use(express.json());
app.use(cors());

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		console.log('Database connection OK!');
		await sequelize.authenticate();
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();
	console.log(`Projeto iniciado`);

}

init();

// sequelize.sync().then(
//     () => {
//         console.log('Rodando na porta 3000');
//         console.log('Conectado com o banco sucesso!');
//     },
//     (error) => {
//     console.log('Erro ao conectar ao banco' , error);
// });

// app.get('/', (err, res) => {
// 	res.status(200);
// 	res.json({ working: true });
// 	res.end();
// });

// requireDir("./src/models");
app.use("/api", require("./src/routes"));
app.listen(process.env.PORT || 3000);

module.exports = sequelize;