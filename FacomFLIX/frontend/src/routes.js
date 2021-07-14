import Vue from 'vue';
import Router from 'vue-router';
import auth from './middleware/auth';

import Login from '@/components/Login';
import Menu from '@/components/menu/Menu';
import Inicio from '@/components/geral/Inicio.vue';

import Aulas from '@/components/menu/Aulas.vue';
import Aula from '@/components/menu/Aula.vue';
import GerenciarAula from '@/components/menu/GerenciarAula.vue'

import GerenciarSerie from '@/components/menu/GerenciarSerie.vue';
import GerenciarCategoria from '@/components/administrador/GerenciarCategoria.vue';
import GerenciarEtiqueta from '@/components/administrador/GerenciarEtiqueta.vue';
import GerenciarUsuario from '@/components/geral/GerenciarUsuario.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            component: Login
        },
        {
            path: '/',
            component: Menu,
            beforeEnter: auth,
            children: [
                {
                    path: 'aulas/gerenciar',
                    component: GerenciarAula
                },
                {
                    path: 'aulas/:id',
                    component: Aula,
                },
                {
                    path: 'aulas',
                    component: Aulas,
                },
                {
                    path: 'series/gerenciar',
                    component: GerenciarSerie
                },
                {
                    path: 'gerenciar-categoria',
                    component: GerenciarCategoria
                },
                {
                    path: 'gerenciar-etiqueta',
                    component: GerenciarEtiqueta
                },
                {
                    path: 'gerenciar-usuario',
                    component: GerenciarUsuario
                }, 
                {
                    path: 'inicio',
                    component: Inicio
                }
            ]
        }
    ]
});