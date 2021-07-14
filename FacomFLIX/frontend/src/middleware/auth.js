import { autenticado } from "@/services/auth"

export default function auth(to, from, next) {

    if (!autenticado()) {
        return next('/login');
    }
    return next();
}