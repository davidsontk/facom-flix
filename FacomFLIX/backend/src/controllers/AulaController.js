require('dotenv').config();
const { models, model } = require('../../configBD');
const { Op, QueryTypes  } = require("sequelize");
const sequelize = require('../../configBD');
const { response } = require('express');

module.exports = {
    async mostrarAulas (req, res) {
        try {
            const Aula = await models.Aula.findAll({
                order:[
                    ['categoria', 'ASC']
                ],
                include: [
                    { model: models.Categoria, as: 'detalhesCategoria'}, 
                    { model: models.SerieAula, as: 'detalhesSerie'},
                    { model: models.Etiqueta, as: 'listaEtiquetas',
                    attributes: ["id", "nome"], // definir os atributos que podem vir da tabela etiqueta
                    through: {
                        attributes: [], // deixar apenas os atributos de etiqueta
                      }
                    }
                ] 
            });
    
            if (Aula) {
                return res.json(Aula);
            }
    
            throw new Error("Erro");
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao encontrar aula" });
        }
    },

    async cadastrarAula (req, res){
        try {
            let aula = req.body;
            let listaEtiquetas =  req.body.listaEtiquetas;
            
            if (aula != null) {
                aula.quantidadeDeVisualizacoes = 0;
                
                aula = await models.Aula.create(aula);

                // const teste = forzao;
                for(etiqueta of listaEtiquetas) {
                    let etiquetaSave = {
                        idAula: aula.id,
                        idEtiqueta: etiqueta 
                    }
                    await models.AulaEtiqueta.create(etiquetaSave);
                }  
                    
                return res
                    .status(201)
                    .json({ success: true, message: "Aula cadastrada!", aula: aula }).end();
            }

            
            throw new Error("Erro");

        } catch (error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao cadastrar aula" });
        }
    },

    async apagarAula (req, res){
        try {
            await models.Aula.destroy({
                where: { id: req.params.id }
            });

            return res
                .status(200)
                .json({ sucess: true, message: "Aula removida"}).end();
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, message: "Erro ao apagar aula" });
        }
    },

    async editarAula (req, res){
        try {
            let aula = req.body;
            let listaEtiquetas =  req.body.listaEtiquetas;

            if (aula && aula.id) {
                
                const contador = await sequelize.query('SELECT COUNT(*) FROM aula_etiqueta where id_aula = ' + aula.id, {
                    type: QueryTypes.SELECT
                });
                
                if (contador[0].count > 1) {
                    await sequelize.query('DELETE FROM aula_etiqueta where id_aula = ' + aula.id, {
                        type: QueryTypes.DELETE
                    });
                }
                
                await models.Aula.update(aula, {where: {id: aula.id}});

                for(etiqueta of listaEtiquetas) {
                    let etiquetaSave = {
                        idAula: aula.id,
                        idEtiqueta: etiqueta 
                    }
                    await models.AulaEtiqueta.create(etiquetaSave);
                }

                return res
                    .status(201)
                    .json({ success: true, message: "Aula atualizada!"}).end();
            }
            throw new Error("Erro");

        } catch (error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao editar aula" });
        }
    },

    async buscarAulasPorNome(req, res) {
        try {
            const listaAulas = await models.Aula.findAll({ 
                where: { nome: { [Op.iLike]: '%'+req.params.nomeAula+'%'} }, 
                include: [
                    { model: models.Categoria, as: 'detalhesCategoria'}, 
                    { model: models.SerieAula, as: 'detalhesSerie'},
                    { model: models.Etiqueta, as: 'listaEtiquetas',
                    attributes: ["id", "nome"], // definir os atributos que podem vir da tabela etiqueta
                    through: {
                        attributes: [], // deixar apenas os atributos de etiqueta
                      }
                    }
                ] 
            }); // required: true, para trazer apenas aulas vinculadas com o Model Categorias
            if(listaAulas) {
                return res
                    .status(200)
                    .json(listaAulas);
            }
            return res
                .status(200)
                .json([]);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({message: "Erro ao buscar aula por nome"});
        }
    },

    async buscarAulasPorCategoria(req, res){
        try {
            const listaAulas = await models.Aula.findAll({
                include: 
                [
                    {   
                        model: models.Categoria, 
                        as: 'detalhesCategoria',
                        where: { nome: { [Op.iLike]: '%'+req.params.nomeCategoria+'%' }},
                    },
                    { model: models.SerieAula, as: 'detalhesSerie'},
                    {model: models.Etiqueta, as: 'listaEtiquetas'}
                ] 

            });
    
            if(listaAulas) {
                return res
                    .status(200)
                    .json(listaAulas);
            }

            return res
                .status(200)
                .json([]);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({message: "Erro ao buscar aula por nome da categoria"});
        }
    },

    async buscarAulaPorNomeECategoria(req, res){
        try {
            let where = '';
            let parametros = req.body; 

            if (parametros.nomeAula != ""){
                where = { nome: { [Op.iLike]: '%'+parametros.nomeAula+'%'} };

                if (parametros.categoria) {
                    where = { nome: { [Op.iLike]: '%'+parametros.nomeAula+'%'}, categoria: parametros.categoria  } ;
                }
            } else if (parametros.categoria) {
                where = { categoria:parametros.categoria};
            }

            const listaAulas = await models.Aula.findAll({
                where: where, 
                include: 
                [
                    {   
                        model: models.Categoria, 
                        as: 'detalhesCategoria'
                    },
                    { model: models.SerieAula, as: 'detalhesSerie'},
                    { model: models.Etiqueta, as: 'listaEtiquetas',
                    attributes: ["id", "nome"], // definir os atributos que podem vir da tabela etiqueta
                    through: {
                        attributes: [], // deixar apenas os atributos de etiqueta
                      }
                    }
                ] 

            });
    
            if(listaAulas) {
                return res
                    .status(200)
                    .json(listaAulas);
            }

            return res
                .status(200)
                .json([]);
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({message: "Erro ao buscar aula por nome da categoria"});

        }
    },
    
    async incrementarVisualizacoes(req, res) {
        try {
            
            if (req.params.id) {
                
                aula = await models.Aula.increment('quantidadeDeVisualizacoes', {where: {id: req.params.id}});
                return res
                    .status(201)
                    .json({ success: true, message: "Visualizações incrementadas!"}).end();
            }
            throw new Error("Erro");

        } catch (error) {
            console.log(error.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao editar aula" });
        }
    },

    async buscarAulasPorUsuario(req, res) {
        try {
            const Aula = await models.Aula.findAll({
                where: { usuarioUpload: req.params.usuarioUpload }, 
                order:[
                    ['nome', 'ASC']
                ],
                include: [
                    { model: models.Categoria, as: 'detalhesCategoria'}, 
                    { model: models.SerieAula, as: 'detalhesSerie'},
                    { model: models.Etiqueta, as: 'listaEtiquetas',
                    attributes: ["id", "nome"], // definir os atributos que podem vir da tabela etiqueta
                    through: {
                        attributes: [], // deixar apenas os atributos de etiqueta
                      }
                    }
                ] 
            });
    
            if (Aula) {
                return res.json(Aula);
            }
    
            throw new Error("Erro");
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao encontrar aula" });
        }
    },

    async buscarQuantidadeVisualizacaoAulas(req, res){
        try {
            const aula = await sequelize.query('SELECT fk_usuario_upload as usuarioUpload, sum(quantidade_de_visualizacoes) ' +
            'from aula group by fk_usuario_upload  order by sum(quantidade_de_visualizacoes) desc limit 1' , {
                type: QueryTypes.SELECT
            })

            const usuarioUpload = await models.Usuario.findByPk(aula[0].usuarioupload);
            let usuarioDestaque = {
                nome: usuarioUpload.nome,
                email: usuarioUpload.email,
                quantidadeDeVisualizacoes: aula[0].sum
            } 
            if (usuarioDestaque) {
                return res
                .status(200)
                .json(usuarioDestaque);
            }
    
            throw new Error("Erro");
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao localizar usuario destaque" });
        }
    },

    async buscarAulasDestaque(req, res){
        try {
            const aulas = await models.Aula.findAll({
                order:[
                    [sequelize.col('quantidadeDeVisualizacoes'), 'DESC']
                ],
                limit: 3,
                include: [
                    { model: models.Categoria, as: 'detalhesCategoria'}, 
                    { model: models.SerieAula, as: 'detalhesSerie'},
                    { model: models.Etiqueta, as: 'listaEtiquetas',
                    attributes: ["id", "nome"], // definir os atributos que podem vir da tabela etiqueta
                    through: {
                        attributes: [], // deixar apenas os atributos de etiqueta
                      }
                    }
                ] 
            });

            if (aulas) {
                return res
                .status(200)
                .json(aulas);
            }
    
            throw new Error("Erro");
    
        } catch (e) {
            console.log(e.message);
            return res
                .status(500)
                .json({ success: false, message: "Erro ao carregar aulas em destaque" });
        }
    }


    
}


   




