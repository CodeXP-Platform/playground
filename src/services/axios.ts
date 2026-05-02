import { env } from "@/lib/env";
import useAuth from "@/store/use-auth";
import axios from "axios";

export const http = axios.create({
    baseURL: env.apiGatewayUrl,
    headers: {
        "Content-Type": "application/json",
        // Eliminamos el Authorization estático de aquí
    },
});

// Interceptor de peticiones (Request Interceptor)
http.interceptors.request.use(
    (config) => {
        // Obtenemos el token más actualizado del store justo antes de la petición
        const token = useAuth.getState().user?.jwt;

        console.log("Token", token);

        // Si existe el token, lo inyectamos en las cabeceras
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Manejo de errores antes de que la petición salga
        return Promise.reject(error);
    },
);
