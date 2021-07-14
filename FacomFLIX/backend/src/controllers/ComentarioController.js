require('dotenv').config();
const { models, model } = require('../../configBD');
const { Op } = require("sequelize");
const sequelize = require('../../configBD');

module.exports = {
    async buscarPorAula (req, res) {
        console.log(models);
        try {
            const Comentario = await models.Comentario.findAll({
                where: { aula: req.params.aulaId },
                order:[
                    ['id', 'desc']
                ],
                include: [
                    { model: models.Usuario, as: 'detalhesUsuario'}, 
                    { model: models.Aula, as: 'detalhesAula'},
                ] 
            });
    
            if (Comentario) {
                return res.json(Comentario);
            } else {
                return [];
            }
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao encontrar comentario!" });
        }
    },

    async cadastrarComentario (req, res){
        try {
            let comentario = req.body;
            
            if (comentario != null) {
                
                
                comentario = await models.Comentario.create(comentario);
                return res
                    .status(201)
                    .json({ success: true, message: "Comentário cadastrado!", comentario: comentario }).end();
            }

        } catch (error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao cadastrar o comentário" });
        }
    },

    async apagarComentario (req, res){
        try {
            await models.Comentario.destroy({
                where: { id: req.params.id }
            });

            return res
                .status(200)
                .json({ success: true, message: "Comentário removido"}).end();
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Erro ao apagar comentário" });
        }
    },

    async editarComentario (req, res){
        try {
            let comentario = req.body;
            
            if (comentario && comentario.id) {
                
                comentario = await models.Comentario.update(comentario, {where: {id: comentario.id}});
                return res
                    .status(201)
                    .json({ success: true, message: "Comentário atualizado!"}).end();
            }
            throw new Error("Erro");

        } catch (error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao editar comentário" });
        }
    },



    
}


   




