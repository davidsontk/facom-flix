<template>
    <v-container>
        <v-row>
        <v-col md-6>
            <v-row>
                <v-container>
                    <iframe
                        :src="aula.link">
                    </iframe>
                    <div class="titulo-video">
                        <h1>{{aula.nome}}</h1>
                        <h6>Enviado por {{usuarioUpload.nome}}</h6>
                    </div>
                </v-container>
            </v-row>
            <v-row>
                
                <v-container>
                    <v-col>
                        <v-row class="titulo-comentario">
                            <h3 v-if="comentarios.length == 1">{{comentarios.length}} Comentário</h3>
                            <h3 v-if="comentarios.length > 1">{{comentarios.length}} Comentários</h3>
                        </v-row>
                        <v-row v-for="(comentario, i) in comentarios" :key="i">
                            <div class="comentario">
                                <v-row>
                                    <v-col>
                                        <h4>{{comentario.detalhesUsuario.nome}}</h4>
                                    </v-col>
                                    <v-col v-if="comentario.detalhesUsuario.id == getIdUsuarioLogado()" style="padding-left:30px;padding-right:2px">
                                        <v-btn
                                                color="normal"
                                                x-small
                                                v-on:click="editar(comentario)"
                                                class="mr-2"
                                            >
                                            Editar
                                        </v-btn>
                                    </v-col>
                                    <v-col v-if="comentario.detalhesUsuario.id == getIdUsuarioLogado()" style="padding-left:2px;">
                                        <v-btn
                                                color="normal"
                                                x-small
                                                v-on:click="excluir(comentario.id)"
                                                class="mr-2"
                                            >
                                            Excluir
                                        </v-btn>
                                    </v-col>
                                </v-row>
                                <p>{{comentario.descricao}}</p>
                            </div>
                        </v-row>
                        <v-row>
                            <v-container>
                                <v-col>
                                    <v-row>
                                        <v-form
                                            ref="formComentario"
                                            v-model="valida"
                                            lazy-validation
                                            width="100%"
                                            max-width="1200"
                                            >
                                            <v-text-field
                                                v-model="comentario.descricao"
                                                :rules="comentarioRules"
                                                label="Adicionar um novo comentário"
                                                required
                                            ></v-text-field>
                                        </v-form>
                                    </v-row>
                                    <v-row>
                                        <div class="text-center">
                                            <v-btn
                                                color="success"
                                                :disabled="!valida"
                                                v-on:click="salvar()"
                                                class="mr-2"
                                            >
                                                Comentar
                                            </v-btn>
                                            <v-btn color="error" v-on:click="limpar()">
                                                Cancelar
                                            </v-btn>
                                        </div> 
                                    </v-row>
                                </v-col>
                            </v-container>
                        </v-row>
                    </v-col>
                </v-container>
            </v-row>
        </v-col>
        <v-col md-6>
            <v-row v-for="(aula, i) in aulasSugeridas" :key="i">
                <v-card
                    class="mx-auto my-12"
                    max-width="300"
                    v-on:click="abrirAula(aula.id)"
                    >
                <template slot="progress">
                    <v-progress-linear
                    color="deep-purple"
                    height="10"
                    indeterminate
                    ></v-progress-linear>
                </template>

                <v-img height="170" :src="aula.videoThumbnail"></v-img>
                <v-card-title>{{ aula.nome }} </v-card-title>
                <v-card-text class="pb-0">
                    <v-chip small color="green" text-color="white">
                    {{ aula.quantidadeDeVisualizacoes }}
                    Visualizações
                    </v-chip>
                </v-card-text>
                <v-card-text class="pt-0">
                    <v-chip
                    class="ma-2"
                    small
                    label
                    color="orange"
                    text-color="white"
                    v-if="aula.detalhesCategoria.nome"
                    >
                    <v-icon left> mdi-star </v-icon>
                    {{ aula.detalhesCategoria.nome }}
                    </v-chip>
                    <v-chip-group column>
                    <v-chip
                        class="ma-2"
                        color="pink"
                        label
                        small
                        text-color="white"
                        v-for="etiqueta in aula.listaEtiquetas"
                        :key="etiqueta.id"
                    >
                        <v-icon left> mdi-label </v-icon>
                        {{ etiqueta.nome }}
                    </v-chip>
                    </v-chip-group>
                </v-card-text>
                </v-card>
            </v-row>
        </v-col>
        </v-row>
    </v-container>
</template>


<script>

import axios from '../../services/api';
import {getUsuarioLogado} from '../../services/auth';

function incrementarVisualizacoes(aulaId) {
    axios.post(`/aula/incrementarVisualizacoes/${aulaId}`);
}

export default {
    data: () => ({
        valida: true,
        aula: {},
        aulasSugeridas: [],
        usuarioUpload: {},
        comentarios: [],
        comentario: {},
        comentarioRules: [(v) => !!v || "É necessário informar um comentário"]

    }),
    created() {
        this.carregarAula(this.$route.params.id);
        this.carregarComentarios(this.$route.params.id);
    },
    watch: {
        $route(to, from) {
            console.log(to, from);
            this.carregarAula(this.$route.params.id);
            this.carregarComentarios(this.$route.params.id);
        }
    },
    methods: {
        carregarAula(id) {
            axios.get(`/aula`)
            .then( r => {
                const aulas = r.data;
                aulas.forEach(a => {
                    if (a.id == id) {
                        this.aula = a;
                        this.aula.link = this.aula.link.replace("watch?v=", "embed/");
                        incrementarVisualizacoes(a.id);
                        this.carregarAulasSugeridas(a.detalhesCategoria.nome);
                        this.carregarUsuarioUpload(a.usuarioUpload);
                    }
                })
            })
        },
        carregarUsuarioUpload(idUsuario) {
            this.$http.get(`/usuario/${idUsuario}`)
                .then(r => {
                    this.usuarioUpload = r.data;
                })
        },
        carregarComentarios(id) {
            axios.get(`/aula/comentarios/${id}`)
            .then( r => {
                this.comentarios = r.data;
            })
        },
        carregarAulasSugeridas(categoria) {
            axios.get(`/aula/buscarPorNomeCategoria/${categoria}`)
                .then(r => {
                    this.aulasSugeridas = r.data;
                    this.aulasSugeridas = this.aulasSugeridas.filter(aula => aula.id != this.$route.params.id);
                    this.aulasSugeridas.forEach((aula) => {
                        let video_id = aula.link.split("v=")[1];
                        const ampersandPosition = video_id.indexOf("&");
                        console.log(video_id);
                        if (ampersandPosition != -1) {
                            aula.videoThumbnail = `https://img.youtube.com/vi/${video_id.substring(
                            0,
                            ampersandPosition
                            )}/0.jpg`;
                        } else {
                            aula.videoThumbnail = `https://img.youtube.com/vi/${video_id}/0.jpg`;
                        }
                    });
                })
        },
        salvar() {
            this.comentario.usuario = getUsuarioLogado().id;
            this.comentario.aula = this.$route.params.id;
            if (this.comentario.id) {
                 this.$http.put(`/comentario/`, this.comentario)
                .then(r => {
                        if (r.data.success) {
                            this.$toast.success("Comentário atualizado!");
                        }
                        this.carregarComentarios(this.$route.params.id);
                })
                .catch(e => {
                    this.$toast.error("Erro ao alterar o comentário")
                    console.error(e);
                });
            } else {
                this.$http.post(`/comentario`, this.comentario)
                    .then(r => {
                        if (r.data.success) {
                            this.$toast.success("Comentário realizado!");
                        }
                        this.carregarComentarios(this.$route.params.id);
                    })
                    .catch(e => {
                        this.$toast.error("Erro ao salvar comentário");
                        console.error(e);
                    });
            }
            
                this.limpar();
        },
        limpar() {
            this.comentario = {};
            this.$refs.formComentario.resetValidation();
        },
        excluir(id) {
            this.$http.delete(`/comentario/${id}`)
                .then(r => {
                    this.$toast.success(r.data.message);
                    this.carregarComentarios(this.$route.params.id);
                })
                .catch( e => {
                    this.$toast.error("Não foi possível excluir o comentário, tente novamente");
                    console.error(e);
                })
        },
        editar(comentario) {
            const c = {};
            c.descricao = comentario.descricao;
            c.id = comentario.id;
            this.comentario = c;
        },
        getIdUsuarioLogado() {
            return getUsuarioLogado().id;
        },
        abrirAula(id) {
             this.$router.push({ path: `/aulas/${id}` }).catch(err => {console.error(err)});
        }
    }


}
</script>

<style scoped>

    .comentario {
        padding: 5px 0px 0px 5px;
    }
    .titulo-comentario {
        padding: 5px 0px 10px 0px;
    }
    h6,h3,h1 {
        font-weight: normal;
    }
    h1 {
        font-size: 1.5em;
    }
    iframe {
        border: none;
        width: 664px;
        height: 360px;
    }


@media (max-width: 480px) {
    iframe {
        width: 400px;
        height: 225px;
    }
}
@media (max-width: 400px) {
    iframe {
        width: 350px;
        height: 202px;
    }
}
</style>