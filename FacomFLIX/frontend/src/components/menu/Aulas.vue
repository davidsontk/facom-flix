<template>
  <v-app>
    <h3 class="ml-2">Aulas</h3>
    <v-container>
      <v-card class="mx-auto my-12" width="400px" max-height="550px">
        <div class="pa-2">
          <v-form ref="formCadastro" lazy-validation>
            <v-text-field
              v-model="nomeAula"
              label="Nome da Aula"
            ></v-text-field>

            <!-- v-on:change="verificarPerfilDoUsuario" -->

            <v-select
              v-model="categoriaSelecionaBusca"
              item-text="nome"
              item-value="id"
              :items="listaCategorias"
              menu-props="auto"
              label="Categoria"
              hide-details
              prepend-icon="mdi-star"
              single-line
              class="pb-2 pt-0"
            ></v-select>

            <!-- <v-select
              v-model="listaEtiquetasSelecionadas"
              item-text="nome"
              item-value="id"
              :items="listaEtiquetas"
              menu-props="auto"
              label="Etiqueta"
              hide-details
              prepend-icon="mdi-label"
              single-line
              multiple
            ></v-select> -->
          </v-form>
          <div class="text-center mt-4">
            <v-btn color="success mr-4" v-on:click="buscaDinamica()">
              Buscar
            </v-btn>
            <v-btn color="error" v-on:click="limparBusca()">
              Limpar Busca
            </v-btn>
          </div>
        </div>
      </v-card>

      <!-- <v-divider inset></v-divider> -->
      <!-- <v-col>
        <v-row v-for="aula in aulas" :key="aula.id">
          <v-card
            @click="abrirAula(aula.id)"
            class="mx-auto"
            width="444"
            outlined
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">
                  {{ aula.nome }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Visualizações: {{ aula.quantidadeDeVisualizacoes }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-avatar tile size="60" color="grey">
                <img :src="aula.videoThumbnail" />
              </v-list-item-avatar>
            </v-list-item>
          </v-card>
        </v-row>
      </v-col> -->

      <v-row justify="center">
        <v-card
          v-for="aula in aulas"
          :key="aula.id"
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

          <!-- <v-divider class="mx-4"></v-divider> -->
        </v-card>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "../../services/api";

export default {
  data: () => ({
    aulas: [],
    listaCategorias: [],
    listaEtiquetas: [],
    nomeAula: "",
    categoriaSelecionaBusca: "",
  }),
  created() {
    this.buscarAulas();
    this.buscarCategorias();
    this.buscarEtiquetas();
  },
  methods: {
    buscarAulas() {
      axios.get("/aula").then((r) => {
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
      });
    },
    abrirAula(id) {
      this.$router.push({ path: `/aulas/${id}` });
    },
    buscarCategorias() {
      this.$http.get("/categoria").then((response) => {
        this.listaCategorias = response.data;
      });
    },
    buscarEtiquetas() {
      this.$http.get("/etiqueta").then((response) => {
        this.listaEtiquetas = response.data;
      });
    },
    buscaDinamica() {
      console.log("nomeaula", this.nomeAula);
      console.log("categoriaSelecionada", this.categoriaSelecionaBusca);
      console.log("listaEtiquetas", this.listaEtiquetasSelecionadas);
      if (this.verificarCamposDeBusca()) {
        this.$http
          .post("aula/busca-dinamica", {
            nomeAula: this.nomeAula,
            categoria: this.categoriaSelecionaBusca,
            listaEtiquetas: this.listaEtiquetasSelecionadas,
          })
          .then((response) => {
            this.aulas = response.data;
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
          });
      } else {
        this.$toast.error("Pelo menos um campo deve estar preenchido.");
      }
    },
    limparBusca() {
      this.nomeAula = "";
      this.categoriaSelecionaBusca = "";
      this.buscarAulas();
    },
    verificarCamposDeBusca() {
      if (
        this.nomeAula != "" ||
        this.categoriaSelecionaBusca != ""
      ) {
        return true;
      }

      return false;
    },
  },
};
</script>