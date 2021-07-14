<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center pr-4">
        <router-link 
        to="/inicio"
         v-slot="{ href, navigate, isActive }">
          <v-icon
          large
            dark
            :active="isActive"
            :href="href"
            @click="navigate"
          >
            mdi-home
          </v-icon>
        </router-link>
      </div>
      <div v-if="tipoUsuario == 'PROFESSOR'">
        <!-- colocar coisas que so professor pode ver  -->

        <router-link
          to="/series/gerenciar"
          v-slot="{ href, navigate, isActive }"
        >
          <v-btn :active="isActive" :href="href" text @click="navigate">
            <span class="mr-2">Gerenciar Series</span>
          </v-btn>
        </router-link>

        <router-link
          to="/aulas/gerenciar"
          v-slot="{ href, navigate, isActive }"
        >
          <v-btn :active="isActive" :href="href" text @click="navigate">
            <span class="mr-2">Gerenciar Aulas</span>
          </v-btn>
        </router-link>
      </div>

      <div v-if="tipoUsuario == 'ALUNO'">
        <!-- colocar coisas que so aluno pode ver  -->
      </div>

      <div v-if="tipoUsuario == 'ADMINISTRADOR'">
        <!-- colocar coisas que so administrador pode ver  -->
        <router-link
          to="/gerenciar-categoria"
          v-slot="{ href, navigate, isActive }"
        >
          <v-btn :active="isActive" :href="href" text @click="navigate">
            <span class="mr-2">Gerenciar Categorias</span>
          </v-btn>
        </router-link>

        <router-link
          to="/gerenciar-etiqueta"
          v-slot="{ href, navigate, isActive }"
        >
          <v-btn :active="isActive" :href="href" text @click="navigate">
            <span class="mr-2">Gerenciar Etiquetas</span>
          </v-btn>
        </router-link>
      </div>

      <router-link to="/aulas" v-slot="{ href, navigate, isActive }">
        <v-btn :active="isActive" :href="href" text @click="navigate">
          <span class="mr-2">Aulas</span>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar color="red darken-2" v-on="on" v-bind="attrs">
            <v-icon dark> mdi-account-circle </v-icon>
          </v-avatar>
        </template>
        <v-list>
          <v-list-item>
            <v-btn @click="alterarDados()" text>
              <span class="mr-2">Alterar Dados</span>
            </v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn @click="deslogar" text>
              <span class="mr-2">Logout</span>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <div>
        <router-view></router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { logout, verificarTipoUsuario } from "../../services/auth";

export default {
  name: "Menu",
  created() {
    this.tipoUsuario = verificarTipoUsuario();
  },
  data: () => ({
    tipoUsuario: "",
  }),
  methods: {
    deslogar: function () {
      logout();
      this.$router.push("/login");
      this.$toast.info("Usuário deslogado.");
    },
    alterarDados() {
      this.$router.push("/gerenciar-usuario");
    },
    rotaInicio() {
      this.$router.push("/inicio");
    },
  },
};
</script>

<style>
</style>