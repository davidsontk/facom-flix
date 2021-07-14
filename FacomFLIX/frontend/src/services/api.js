import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
});

api.interceptors.request.use(async config => {
    const token = getToken();

    if(token) {
        config.headers.authorization = token;
    }

    return config;
});

export default api;