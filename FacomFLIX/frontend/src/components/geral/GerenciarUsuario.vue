<template>
  <v-app>
    <v-card class="mx-auto my-12" width="500px" max-height="550px">
      <!-- <v-row class="text-center ma-0 pa-2"> -->

      <div class="pa-2">
        <v-form ref="formCadastro" v-model="validaCadastro" lazy-validation>
          <v-text-field
            v-model="usuario.nome"
            :rules="nomeRules"
            label="Nome"
            required
          ></v-text-field>

          <v-text-field
            v-model="usuario.email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="usuario.login"
            :rules="loginCadastroRules"
            label="Login"
            disabled
            required
          ></v-text-field>

          <v-text-field
            v-model="usuario.senha"
            :rules="senhaCadastroRules"
            type="password"
            label="Senha"
          ></v-text-field>

          <v-text-field
            v-model="usuario.matricula"
            :rules="matriculaRules"
            label="Matrícula"
            type="number"
            required
          ></v-text-field>
        </v-form>
        <div class="text-center">
          <v-btn
            color="success"
            :disabled="!validaCadastro"
            v-on:click="editar"
          >
            Editar
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-app>
</template>

<script>
import { getUsuarioLogado, logout } from "../../services/auth";

export default {
  name: "GerenciarUsuario",
  data: () => ({
    validaCadastro: true,
    usuario: "",
    nome: "",
    nomeRules: [(v) => !!v || "Nome é necessário"],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail é necessário",
      (v) => /.+@.+\..+/.test(v) || "Insira um e-mail válido",
    ],
    senhaCadastro: "",
    senhaCadastroRules: [(v) => !!v || "Senha é necessária"],
    loginCadastro: "",
    loginCadastroRules: [(v) => !!v || "Login é necessário"],
    matricula: "",
    matriculaRules: [(v) => !!v || "Matricula é necessária"],
  }),
  created() {
    this.buscarDados();
  },
  methods: {
    validarFormularioCadastro() {
      return this.$refs.formCadastro.validate();
    },
    reset() {
      if (this.$refs.formCadastro != undefined) {
        this.$refs.formCadastro.reset();
      }
    },
    resetValidation() {
      if (this.$refs.formCadastro != undefined) {
        this.$refs.formCadastro.resetValidation();
      }
    },
    editar() {
      if (this.validarFormularioCadastro()) {
        this.usuario.senha =
          this.usuario.senha == "**" ? "" : this.usuario.senha;
        this.$http
          .put("/usuario", {
            nome: this.usuario.nome,
            email: this.usuario.email,
            senha: this.usuario.senha,
            login: this.usuario.login,
            matricula: this.usuario.matricula,
          })
          .then((response) => {
            this.$toast.success(response.data.message);
            logout();
            this.$router.push("/login");            
          })
          .catch((error) => {
            if (error.response) {
              this.$toast.error(error.response.data.message);
            } else {
              this.$toast.error("Erro ao editar usuário");
            }
            console.log(error);
          });
      }
    },
    buscarDados() {
      let usuario = getUsuarioLogado();
      this.$http
        .get("/usuario/dados-usuario/" + usuario.login)
        .then((response) => {
          this.usuario = response.data;
          this.usuario.senha = "**";
        });
    },
  },
};
</script>

<style scoped>
.clicado {
  background-color: #BBDEFB;
}
</style>