<template>
    <v-container class="lighten-5">
        <v-row no-gutters>
            <v-col cols="12">
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation>
                    
                    <v-text-field
                        v-model="nome"
                        :rules="nomeRules"
                        label="Nome da Série"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="descricao"
                        :rules="descricaoRules"
                        label="Descrição da Série"
                        required
                    ></v-text-field>

                    

                    <v-btn
                        class="mr-4"
                        type="submit"
                        :disabled="!valid"
                        @click="validate">
                        Cadastrar
                    </v-btn>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import axios from '../../services/api';

function cadastrarSerie(serie) {
    axios.post('/serie', serie).then(r => {
        if (r.data.sucess) {
             this.$toast.info("Série cadastrada!");
        }
    });
}
export default {
    data: () => ({
        valid: true,
        nome: '',
        descricao: '',
        nomeRules: [
            v => !!v || 'Nome é obrigatório'
        ],
        descricaoRules: [
            v => !!v || 'Descrição é obrigatório'
        ],
    }),
    methods: {
        validate () {
            this.$refs.form.validate();
            cadastrarSerie({
                nome: this.nome,
                descricao: this.descricao
            });
            this.$refs.form.reset();
        }
    }
}
</script>