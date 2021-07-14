export const TOKEN_KEY = "@Token";

export const autenticado = () => {
    return localStorage.getItem(TOKEN_KEY) !== null;
} 

export const getToken = () => {
    if (localStorage.getItem(TOKEN_KEY) != null && localStorage.getItem(TOKEN_KEY) != undefined ) {
        return JSON.parse(localStorage.getItem(TOKEN_KEY)).token;
    }
    return null;    
}

export const salvarLogin = token => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
}

export const verificarTipoUsuario = () => {
    let tipoUsuario = JSON.parse(localStorage.getItem(TOKEN_KEY)).tipoUsuario;
    switch(tipoUsuario) {
        case 1:
            return 'PROFESSOR';
        case 2: 
            return 'ALUNO';
        case 3:
            return 'ADMINISTRADOR';
        default:
            return 'ALUNO';
    }
}

export const getUsuarioLogado = () => {
    if (localStorage.getItem(TOKEN_KEY) != null && localStorage.getItem(TOKEN_KEY) != undefined ) {
        return JSON.parse(localStorage.getItem(TOKEN_KEY));
    }
    return null;  
}