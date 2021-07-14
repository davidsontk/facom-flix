const { models, model } = require('../../configBD');
const { Op, QueryTypes } = require("sequelize");
const sequelize = require('../../configBD');

module.exports = {

    async buscarEtiquetas(req, res) {
        try {
            const listaEtiquetas = await models.Etiqueta.findAll();
    
            if (listaEtiquetas) {
                return res
                    .status(200)
                    .json(listaEtiquetas);
            }
    
            throw new Error("Erro");
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({message: "Erro ao buscar lista de etiquetas" });
        }
    },

    async cadastrarEtiqueta(req, res) {
        try {
            const etiqueta = req.body;

            if(etiqueta){
                const resultado = await models.Etiqueta.create(etiqueta);
                
                return res
                    .status(200)
                    .json({message: 'Etiqueta ' +  resultado.nome + ' criada!'});
            }
            throw new Error("Erro");
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({message: "Erro ao salvar nova etiqueta" });
        }
    },

    async apagarEtiqueta(req, res) {
        try {
            const etiqueta = req.params.id;
            if(etiqueta){

            const aula = await sequelize.query('DELETE FROM aula_etiqueta WHERE id_etiqueta = ' + etiqueta   , {
                type: QueryTypes.SELECT
            })

                await models.Etiqueta.destroy({
                    where: { id: req.params.id }
                });
                
                return res
                    .status(200)
                    .json({message: 'Etiqueta apagada!'});
            }
            throw new Error("Erro");
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({message: "Erro ao apagar etiqueta" });
        }
    },

    async editarEtiqueta(req, res) {
        try {
            const etiqueta = req.body;
            
            if(etiqueta){
                await models.Etiqueta.update(
                    etiqueta,
                    { where: { id: etiqueta.id } }
                );
                
                return res
                    .status(200)
                    .json({message: 'Etiqueta foi atualizada!'});
            }
            throw new Error("Erro");
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({message: "Erro ao editar etiqueta" });
        }
    }


};