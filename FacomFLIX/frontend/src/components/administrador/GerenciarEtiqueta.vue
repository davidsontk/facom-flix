<template>
  <v-app>
    <h3 class="ml-2">Gerenciar Etiquetas</h3>
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
              <tr v-for="(categoria, i) in listaCategorias" :key="i">
                <td>{{ categoria.id }}</td>
                <td>{{ categoria.nome }}</td>
                <td>
                  <v-btn
                    color="success"
                    v-on:click="editarEtiqueta(categoria)"
                  >
                    Editar
                  </v-btn>
                </td>
                <td>
                  <v-btn color="error" v-on:click="excluirEtiqueta(categoria)">
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
          Nova Etiqueta
        </v-btn>

        <v-card class="mx-auto my-12" width="350px" max-height="550px">
          <div class="pa-2" max-width="300">
            <div class="text-center">
              <h4 v-if="cadastroEtiqueta">Cadastrar Etiqueta</h4>
              <h4 v-else>Editar Etiqueta</h4>
            </div>

            <v-form
              ref="formEditar"
              v-model="valida"
              lazy-validation
              max-width="300"
            >
              <v-text-field
                v-model="etiquetaSelecionada.nome"
                :rules="categoriaRules"
                label="Categoria"
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
  name: "GerenciarEtiqueta",
  data: () => ({
    listaCategorias: [],
    etiquetaSelecionada: new Object(),
    categoriaRules: [(v) => !!v || "Etiqueta é necessário"],
    valida: true,
    cadastroEtiqueta: true,
  }),
  created() {
    this.buscarEtiquetas();
  },
  methods: {
    buscarEtiquetas() {
      this.$http
        .get("/etiqueta")
        .then((response) => {
          this.listaCategorias = response.data;
        })
        .catch((error) => {
          this.$toast.error("Erro ao buscar etiquetas");
          console.log(error);
        });
    },
    editarEtiqueta(categoria) {
      this.cadastroEtiqueta = false;
      this.etiquetaSelecionada = categoria;
    },
    cancelarOperacao() {
      this.limparCategoriaSelecionada();
      this.cadastroEtiqueta = true;
      this.resetValidation();
      this.buscarEtiquetas();
    },
    excluirEtiqueta(categoria) {
      this.$http
        .delete("/etiqueta/" + categoria.id)
        .then((response) => {
          this.buscarEtiquetas();
          this.$toast.success(response.data.message);
        })
        .catch((error) => {
          this.$toast.error("Erro ao excluir etiqueta");
          console.log(error);
        });
    },
    novoCadastro() {
      this.limparCategoriaSelecionada();
      this.cadastroEtiqueta = true;
    },
    resetValidation() {
      this.$refs.formEditar.resetValidation();
    },
    limparCategoriaSelecionada() {
      this.etiquetaSelecionada = new Object();
    },
    salvar() {
      if (this.etiquetaSelecionada.nome == undefined){
          this.$toast.error('nome da etiqueta é necessário');
          return;
      }
      
      if (this.cadastroEtiqueta) {
        this.$http
          .post("/etiqueta", {
            nome: this.etiquetaSelecionada.nome.toUpperCase(),
          })
          .then((response) => {
            this.buscarEtiquetas();
            this.limparCategoriaSelecionada();
            this.resetValidation();
            this.$toast.success(response.data.message);
          })
          .catch((error) => {
            this.$toast.error("Erro ao cadastrar etiqueta");
            console.log(error);
          });
      } else {
        this.$http
          .put("/etiqueta", {
            id: this.etiquetaSelecionada.id,
            nome: this.etiquetaSelecionada.nome.toUpperCase(),
          })
          .then((response) => {
            this.buscarEtiquetas();
            this.limparCategoriaSelecionada();
            this.resetValidation();
            this.$toast.success(response.data.message);
          })
          .catch((error) => {
            this.$toast.error("Erro ao cadastrar etiqueta");
            console.log(error);
          });
      }
    },
  },
};
</script>

<style>
</style>