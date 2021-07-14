const express = require("express");
const jwt = require("jsonwebtoken");
const routes = express.Router();

const UsuarioController = require("./controllers/UsuarioController");
const AulaController = require("./controllers/AulaController");
const SerieController = require("./controllers/SerieController");
const CategoriaController = require("./controllers/CategoriaController");
const EtiquetaController = require("./controllers/EtiquetaController");
const ComentarioController = require("./controllers/ComentarioController");

const autenticarUsuario = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res
            .status(401)
            .json({ success: false, message: "Usuário não está autenticado" }).end();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usuario) => {
        if(err) {
            res
            .status(403)
            .json({ success: false, message: "Usuário sem permissão para essa transação" }).end();
        }
        
        req.usuario = usuario;
        next()
    });
}

routes.get("/usuario", UsuarioController.mostrarTipoUsuario); // mostrar tipo usuarios disponiveis
routes.post("/usuario", UsuarioController.cadastrarUsuario); // cadastrar usuario
routes.post("/usuario/login", UsuarioController.loginUsuario); // login usuario
routes.get("/usuario/dados-usuario/:login", autenticarUsuario, UsuarioController.buscarUsuarioPorLogin); // buscar dados de usuario por login
routes.get("/usuario/:id", autenticarUsuario, UsuarioController.buscarUsuarioPorId); // buscar dados de usuario por login
routes.put('/usuario', autenticarUsuario, UsuarioController.editarUsuario);

routes.get('/aula/destaque', autenticarUsuario, AulaController.buscarAulasDestaque);
routes.get("/aula", autenticarUsuario, AulaController.mostrarAulas);
routes.post("/aula", autenticarUsuario, AulaController.cadastrarAula);
routes.delete("/aula/:id", autenticarUsuario, AulaController.apagarAula);
routes.put("/aula", autenticarUsuario, AulaController.editarAula);
routes.get("/aula/buscarPorNome/:nomeAula", autenticarUsuario, AulaController.buscarAulasPorNome);
routes.get("/aula/buscarPorNomeCategoria/:nomeCategoria", autenticarUsuario, AulaController.buscarAulasPorCategoria);
routes.post("/aula/busca-dinamica", autenticarUsuario, AulaController.buscarAulaPorNomeECategoria);
routes.post("/aula/incrementarVisualizacoes/:id", autenticarUsuario, AulaController.incrementarVisualizacoes);
routes.get("/aula/comentarios/:aulaId", autenticarUsuario, ComentarioController.buscarPorAula);
routes.get("/aula/:usuarioUpload", autenticarUsuario, AulaController.buscarAulasPorUsuario);
routes.get('/aula/quantidadeAula/destaque', autenticarUsuario, AulaController.buscarQuantidadeVisualizacaoAulas);


routes.post("/comentario/", autenticarUsuario, ComentarioController.cadastrarComentario);
routes.put("/comentario/", autenticarUsuario, ComentarioController.editarComentario);
routes.delete("/comentario/:id", autenticarUsuario, ComentarioController.apagarComentario);



routes.get("/serie", autenticarUsuario, SerieController.mostrarSeries);
routes.post("/serie", autenticarUsuario, SerieController.cadastrarSerie);
routes.delete("/serie/:id", autenticarUsuario, SerieController.apagarSerie);
routes.put("/serie", autenticarUsuario, SerieController.editarSerie);

routes.get("/categoria", autenticarUsuario, CategoriaController.buscarCategorias);
routes.post("/categoria", autenticarUsuario, CategoriaController.cadastrarCategoria);
routes.delete("/categoria/:id", autenticarUsuario, CategoriaController.apagarCategoria);
routes.put("/categoria", autenticarUsuario, CategoriaController.editarCategoria);

routes.get("/etiqueta", autenticarUsuario, EtiquetaController.buscarEtiquetas);
routes.post("/etiqueta", autenticarUsuario, EtiquetaController.cadastrarEtiqueta);
routes.delete("/etiqueta/:id", autenticarUsuario, EtiquetaController.apagarEtiqueta);
routes.put("/etiqueta", autenticarUsuario, EtiquetaController.editarEtiqueta);

module.exports = routes;
