require('dotenv').config();
const { models, model } = require('../../configBD');
const { Op } = require("sequelize");

module.exports = {
    async mostrarSeries (req, res) {
        try {
            const Serie = await models.SerieAula.findAll();
    
            if (Serie) {
                return res.json(Serie);
            }
    
            throw new Error("Erro");
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao encontrar serie" });
        }
    },

    async cadastrarSerie (req, res){
        try {
            let serie = req.body;
            
            if (serie != null) {
                
                serie = await models.SerieAula.create(serie);
                return res
                    .status(201)
                    .json({ success: true, message: "Serie cadastrada!", serie: serie }).end();
            }
            throw new Error("Erro");

        } catch (error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao cadastrar serie" });
        }
    },

    async apagarSerie (req, res){
        try {
            await models.SerieAula.destroy({
                where: { id: req.params.id }
            });

            return res
                .status(200)
                .json({ sucess: true, message: "Serie removida"}).end();
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Erro ao apagar serie" });
        }
    },

    async editarSerie (req, res){
        try {
            let serie = req.body;
            
            if (serie && serie.id) {
                
                serie = await models.SerieAula.update(serie, {where: {id: serie.id}});
                return res
                    .status(201)
                    .json({ success: true, message: "Serie atualizada!"}).end();
            }
            throw new Error("Erro");

        } catch (error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao editar serie" });
        }
    },

    async mostrarSeriesPorUsuario (req, res) {
        try {
            const Serie = await models.SerieAula.findAll({
                where: { usuarioUpload: req.params.usuarioUpload }
            });
    
            if (Serie) {
                return res.json(Serie);
            }
    
            throw new Error("Erro");
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao encontrar serie" });
        }
    },
}


   




