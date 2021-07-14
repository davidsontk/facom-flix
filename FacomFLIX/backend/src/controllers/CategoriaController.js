const { models, model } = require('../../configBD');
const { Op } = require("sequelize");

module.exports = {

    async buscarCategorias(req, res) {
        try {
            const listaCategorias = await models.Categoria.findAll();
    
            if (listaCategorias) {
                return res
                    .status(200)
                    .json(listaCategorias);
            }
    
            throw new Error("Erro");
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({message: "Erro ao buscar lista de categorias" });
        }
    },

    async cadastrarCategoria(req, res) {
        try {
            const categoria = req.body;
            console.log(categoria);
            if(categoria){
                const resultado = await models.Categoria.create(categoria);
                
                return res
                    .status(200)
                    .json({message: 'Categoria ' +  resultado.nome + ' criada!'});
            }
            throw new Error("Erro");
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({message: "Erro ao salvar nova categoria" });
        }
    },

    async apagarCategoria(req, res) {
        try {
            const categoria = req.params.id;
            if(categoria){
                await models.Categoria.destroy({
                    where: { id: req.params.id }
                });
                
                return res
                    .status(200)
                    .json({message: 'Categoria apagada!'});
            }
            throw new Error("Erro");
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({message: "Erro ao apagar categoria" });
        }
    },

    async editarCategoria(req, res) {
        try {
            const categoria = req.body;
            console.log(categoria);
            if(categoria){
                await models.Categoria.update(
                    categoria,
                    { where: { id: categoria.id } }
                );
                
                return res
                    .status(200)
                    .json({message: 'Categoria foi atualizada!'});
            }
            throw new Error("Erro");
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({message: "Erro ao editar categoria" });
        }
    }


};