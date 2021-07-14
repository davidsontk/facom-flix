<template>
  <v-app>
    <h3 class="ml-2">Gerenciar Categorias</h3>
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
                    v-on:click="editarCategoria(categoria)"
                  >
                    Editar
                  </v-btn>
                </td>
                <td>
                  <v-btn color="error" v-on:click="excluirCategoria(categoria)">
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
          Nova Categoria
        </v-btn>

        <v-card class="mx-auto my-12" width="350px" max-height="550px">
          <div class="pa-2" max-width="300">
            <div class="text-center">
              <h4 v-if="cadastroCategoria">Cadastrar Categoria</h4>
              <h4 v-else>Editar Categoria</h4>
            </div>

            <v-form
              ref="formEditar"
              v-model="valida"
              lazy-validation
              max-width="300"
            >
              <v-text-field
                v-model="categoriaSelecionada.nome"
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
  name: "GerenciarCategoria",
  data: () => ({
    listaCategorias: [],
    categoriaSelecionada: new Object(),
    categoriaRules: [(v) => !!v || "Categoria é necessário"],
    valida: true,
    cadastroCategoria: true,
  }),
  created() {
    this.buscarCategorias();
  },
  methods: {
    buscarCategorias() {
      this.$http
        .get("/categoria")
        .then((response) => {
          this.listaCategorias = response.data;
        })
        .catch((error) => {
          this.$toast.error("Erro ao buscar categorias");
          console.log(error);
        });
    },
    editarCategoria(categoria) {
      this.cadastroCategoria = false;
      this.categoriaSelecionada = categoria;
    },
    cancelarOperacao() {
      this.limparCategoriaSelecionada();
      this.cadastroCategoria = true;
      this.resetValidation();
    },
    excluirCategoria(categoria) {
      this.$http
        .delete("/categoria/" + categoria.id)
        .then((response) => {
          this.buscarCategorias();
          this.$toast.success(response.data.message);
        })
        .catch((error) => {
          this.$toast.error("Erro ao excluir categoria");
          console.log(error);
        });
    },
    novoCadastro() {
      this.limparCategoriaSelecionada();
      this.cadastroCategoria = true;
    },
    resetValidation() {
      this.$refs.formEditar.resetValidation();
    },
    limparCategoriaSelecionada() {
      this.categoriaSelecionada = new Object();
    },
    salvar() {
      if (this.cadastroCategoria) {
        this.$http
          .post("/categoria", {
            nome: this.categoriaSelecionada.nome,
          })
          .then((response) => {
            this.buscarCategorias();
            this.limparCategoriaSelecionada();
            this.resetValidation();
            this.$toast.success(response.data.message);
          })
          .catch((error) => {
            this.$toast.error("Erro ao cadastrar categoria");
            console.log(error);
          });
      } else {
        this.$http
          .put("/categoria", {
            id: this.categoriaSelecionada.id,
            nome: this.categoriaSelecionada.nome,
          })
          .then((response) => {
            this.buscarCategorias();
            this.limparCategoriaSelecionada();
            this.resetValidation();
            this.$toast.success(response.data.message);
          })
          .catch((error) => {
            this.$toast.error("Erro ao cadastrar categoria");
            console.log(error);
          });
      }
    },
  },
};
</script>

<style>
</style>