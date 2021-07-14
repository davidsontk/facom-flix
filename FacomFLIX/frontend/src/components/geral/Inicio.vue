<template>
  <v-app>
    <v-container>
    <h3 class="ml-2">Bem vindo, {{ nomeUsuarioLogado }}</h3>
    <div class="text-center" style="padding-top:20px">
      <h3>Professor em destaque</h3>
      <v-row style="padding-bottom: 30px">
        <v-card style="margin-top: 5px!important" class="mx-auto my-6" max-width="350" v-if="professorEmDestaque != ''">
          <v-card-title>Nome: {{professorEmDestaque.nome}}</v-card-title>
            <div class="my-4 subtitle-1">Contato: {{professorEmDestaque.email}}</div>
            <div>
              <p>Suas aulas são as mais vistas!! 
              No total de <strong>{{professorEmDestaque.quantidadeDeVisualizacoes}} </strong> visualizações</p>
            </div>
        </v-card>
      </v-row>
    </div>
    <div class="text-center">
      <h3>Aulas em destaque</h3>
      <v-row >
              <v-card style="margin-top: 10px!important"
                  v-for="(aula, i) in aulas" :key="i"
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
        </div>
    </v-container>
  </v-app>
</template>

<script>
import { getUsuarioLogado } from "../../services/auth";

export default {
  name: "Inicio",
  data: () => ({
    nomeUsuarioLogado: "",
    professorEmDestaque: "",
    aulas: []
  }),
  created() {
    this.nomeUsuarioLogado = getUsuarioLogado().nome;
    this.buscarProfessorDestaque();
    this.carregarAulasDestaque();
  },
  methods: {
    buscarProfessorDestaque() {
      this.$http
        .get("/aula/quantidadeAula/destaque")
        .then((response) => {
          this.professorEmDestaque = response.data;
        })
        .catch((error) => {
          this.$toast.error("Erro ao buscar professor em destaque");
          console.log(error);
        });
    },
    carregarAulasDestaque() {
            this.$http.get(`/aula/destaque`)
                .then(r => {
                    this.aulas = r.data;
                    this.aulas.forEach((aula) => {
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
    abrirAula(id) {
          this.$router.push({ path: `/aulas/${id}` })
    }
  },
};
</script>

<style scoped>
  h3 {
    font-weight: normal;
  }
</style>