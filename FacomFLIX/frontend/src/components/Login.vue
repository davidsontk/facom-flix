<template>
  <v-app>
    <v-card class="mx-auto my-12" width="500px" max-height="550px">
      <!-- <v-row class="text-center ma-0 pa-2"> -->
      <div class="text-center pa-2">
        <v-btn text color="primary" v-bind:class="{ clicado: loginUsuario}"  v-on:click="loginOuCadastrar(true)">
          Entrar
        </v-btn>
        <v-btn text color="primary" v-bind:class="{ clicado: !loginUsuario}"  v-on:click="loginOuCadastrar(false)">
          Cadastrar-se
        </v-btn>
      </div>

      <div class="pa-2" v-if="loginUsuario">
        <v-form ref="formLogin" v-model="validaLogin" lazy-validation>
          <v-text-field
            v-model="login"
            :rules="loginRules"
            label="Login"
            required
          ></v-text-field>

          <v-text-field
            v-model="senha"
            :rules="senhaRules"
            type="password"
            label="Senha"
            required
          ></v-text-field>
        </v-form>
        <div class="text-center">
          <v-btn color="success" :disabled="!validaLogin" v-on:click="logar()">
            Acessar
          </v-btn>
        </div>
      </div>

      <div class="pa-2" v-if="!loginUsuario">
        <v-form ref="formCadastro" v-model="validaCadastro" lazy-validation>
          <v-text-field
            v-model="nome"
            :rules="nomeRules"
            label="Nome"
            required
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="loginCadastro"
            :rules="loginCadastroRules"
            label="Login"
            required
          ></v-text-field>

          <v-text-field
            v-model="senhaCadastro"
            :rules="senhaCadastroRules"
            type="password"
            label="Senha"
            required
          ></v-text-field>

          <v-text-field
            v-model="matricula"
            :rules="matriculaRules"
            label="Matrícula"
            type="number"
            required
          ></v-text-field>

          <v-select
            v-model="perfilUsuario"
            v-on:change="verificarPerfilDoUsuario"
            item-value="src"
            :items="items"
            :rules="[(v) => !!v || 'Perfil é necessário']"
            label="Perfil"
            required
          ></v-select>
        </v-form>
        <div class="text-center">
          <v-btn
            color="success"
            :disabled="!validaCadastro"
            v-on:click="cadastrar"
          >
            Cadastrar
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-app>
</template>

<script>
import { autenticado, salvarLogin } from "@/services/auth";

export default {
  name: "Login",
  data: () => ({
    loginUsuario: true,
    validaLogin: true,
    validaCadastro: true,
    login: "",
    loginRules: [(v) => !!v || "Login é necessário"],
    senha: "",
    senhaRules: [(v) => !!v || "Senha é necessária"],
    perfilUsuario: 1,
    items: ["Aluno", "Professor", "Administrador"],
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
  beforeRouteEnter(to, from, next) {
    return autenticado() ? next("/") : next();
  },
  methods: {
    loginOuCadastrar(value) {
      this.loginUsuario = value;
      this.limparCampos();
      this.resetValidation();
    },
    validarFormularioLogin() {
      return this.$refs.formLogin.validate();
    },
    validarFormularioCadastro() {
      return this.$refs.formCadastro.validate();
    },
    reset() {
      if (this.$refs.formLogin != undefined) {
        this.$refs.formLogin.reset();
      }
      if (this.$refs.formCadastro != undefined) {
        this.$refs.formCadastro.reset();
      }
    },
    resetValidation() {
      if (this.$refs.formLogin != undefined) {
        this.$refs.formLogin.resetValidation();
      }
      if (this.$refs.formCadastro != undefined) {
        this.$refs.formCadastro.resetValidation();
      }
    },
    limparCampos() {
      this.login = "";
      this.senha = "";
      this.nome = "";
      this.email = "";
      this.senhaCadastro = "";
      this.loginCadastro = "";
      this.matricula = "";
      this.perfilUsuario = null;
    },
    verificarPerfilDoUsuario(value) {
      console.log("value", value);
      switch (value) {
        case "Professor":
          this.tipoUsuario = 1;
          break;
        case "Aluno":
          this.tipoUsuario = 2;
          break;
        case "Administrador":
          this.tipoUsuario = 3;
          break;
        default:
          this.tipoUsuario = 2;
          break;
      }
    },
    logar() {
      if (this.validarFormularioLogin()) {
        this.$http
          .post("/usuario/login", {
            login: this.login,
            senha: this.senha,
          })
          .then((response) => {
            salvarLogin(response.data.usuario); // salvando usuario no local storage
            this.$router.push("/inicio");
          })
          .catch((error) => {
            this.senha = "";
            if (error.response) {
              if (error.response.status == 401) {
                this.$toast.error(error.response.data.message);
              }
            } else {
              this.$toast.error("Erro no login");
            }
            console.log(error);
          });
      }
    },
    cadastrar() {
      if (this.validarFormularioCadastro()) {
        this.$http
          .post("/usuario", {
            nome: this.nome,
            email: this.email,
            senha: this.senhaCadastro,
            login: this.loginCadastro,
            tipoUsuario: this.tipoUsuario,
            matricula: this.matricula,
          })
          .then((response) => {
            this.$toast.success(response.data.message);
            this.limparCampos();
            this.resetValidation();
            this.loginUsuario = true;
          })
          .catch((error) => {
            if (error.response) {
              this.$toast.error(error.response.data.message);
            } else {
              this.$toast.error("Erro ao cadastrar usuário");
            }
            console.log(error);
          });
      }
    },
  },
};
</script>

<style scoped>
.clicado {
  background-color:#BBDEFB;
}

</style>