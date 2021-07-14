<template>
  <v-app>
    <h3 class="ml-2">Gerenciar Series</h3>
    <v-row>
      <v-col cols="6">
        <v-simple-table max-width="400px">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Nome</th>
                <th class="text-left">Editar</th>
                <th class="text-left">Excluir</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(serie, i) in listaSeries" :key="i">
                <td>{{ serie.id }}</td>
                <td>{{ serie.nome }}</td>
                <td>
                  <v-btn
                    color="success"
                    v-on:click="editarSerie(serie)"
                  >
                    Editar
                  </v-btn>
                </td>
                <td>
                  <v-btn color="error" v-on:click="excluirSerie(serie)">
                    Excluir
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col cols="6">
        <v-btn color="primary" v-on:click="novoCadastro()">
          Nova Serie
        </v-btn>

        <v-card class="mx-auto my-12" width="350px" max-height="550px">
          <div class="pa-2" max-width="300">
            <div class="text-center">
              <h4 v-if="cadastroSerie">Cadastrar Serie</h4>
              <h4 v-else>Editar Serie</h4>
            </div>

            <v-form
              ref="formEditar"
              v-model="valida"
              lazy-validation
              max-width="300"
            >
              <v-text-field
                v-model="serieSelecionada.nome"
                :rules="serieRules"
                label="Serie"
                required
              ></v-text-field>
            </v-form>
            <div class="text-center">
              <v-btn
                color="success"
                :disabled="!valida"
                v-on:click="salvar()"
                class="mr-2"
              >
                Salvar
              </v-btn>

              <v-btn color="error" v-on:click="cancelarOperacao()">
                Cancelar
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: "GerenciarSerie",
  data: () => ({
    listaSeries: [],
    serieSelecionada: new Object(),
    serieRules: [(v) => !!v || "Serie é necessário"],
    valida: true,
    cadastroSerie: true,
  }),
  created() {
    this.buscarSeries();
  },
  methods: {
    buscarSeries() {
      this.$http
        .get("/serie")
        .then((response) => {
          this.listaSeries = response.data;
        })
        .catch((error) => {
          this.$toast.error("Erro ao buscar series");
          console.log(error);
        });
    },
    editarSerie(serie) {
      this.cadastroSerie = false;
      this.serieSelecionada = serie;
    },
    cancelarOperacao() {
      this.limparSerieSelecionada();
      this.cadastroSerie = true;
      this.resetValidation();
    },
    excluirSerie(serie) {
      this.$http
        .delete("/serie/" + serie.id)
        .then((response) => {
          this.buscarSeries();
          this.$toast.success(response.data.message);
        })
        .catch((error) => {
          this.$toast.error("Erro ao excluir serie");
          console.log(error);
        });
    },
    novoCadastro() {
      this.limparSerieSelecionada();
      this.cadastroSerie = true;
    },
    resetValidation() {
      this.$refs.formEditar.resetValidation();
    },
    limparSerieSelecionada() {
      this.serieSelecionada = new Object();
    },
    salvar() {
      if (this.cadastroSerie) {
        this.$http
          .post("/serie", {
            nome: this.serieSelecionada.nome,
          })
          .then((response) => {
            this.buscarSeries();
            this.limparSerieSelecionada();
            this.resetValidation();
            this.$toast.success(response.data.message);
          })
          .catch((error) => {
            this.$toast.error("Erro ao cadastrar serie");
            console.log(error);
          });
      } else {
        this.$http
          .put("/serie", {
            id: this.serieSelecionada.id,
            nome: this.serieSelecionada.nome,
          })
          .then((response) => {
            this.buscarSeries();
            this.limparSerieSelecionada();
            this.resetValidation();
            this.$toast.success(response.data.message);
          })
          .catch((error) => {
            this.$toast.error("Erro ao cadastrar serie");
            console.log(error);
          });
      }
    },
  },
};
</script>

<style>
</style>