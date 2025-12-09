import { ClientForm } from "../types/dto/client/ClientForm";
import { GetClientParams } from "../types/dto/client/GetClientParams";
import { ClientType } from "../types/enums/ClientType";
import { api } from "./api";

export const ClientService = {
    async create(data: ClientForm) {
        try {
            const res = await api.post("/api/clients", data);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async getAll() {
        try {
            const res = await api.get("/api/clients");
            return res.data;
        } catch (err: any) {
            handleError(err)
        }
    },
    async getAllByParams(params: GetClientParams) {
        const query = new URLSearchParams(
            Object.entries(params).filter(([_, v]) => v != null) as [
                string,
                string,
            ][],
        ).toString();
        try {
            const res = await api.get(`/api/clients?${query}`);
            return res.data;
        } catch (err: any) {
            handleError(err)
        }

    },
    async getById(id: number) {
        try {
            const res = await api.get(`/api/clients/${id}`);
            return res.data;
        } catch (err: any) {
            handleError(err)
        }
    },
    
};

function handleError(error: any) {
    if (error.response) {
        console.error(
            "Erro da API:",
            error.response.status,
            error.response.data,
        );

        switch (error.response.status) {
            case 400:
                throw new Error("Dados inválidos.");
            case 401:
                throw new Error("Não autorizado.");
            case 404:
                throw new Error("Registro não encontrado.");
            case 409:
                throw new Error(
                    "Conflito: já existe um cadastro com esses dados.",
                );
            case 500:
                throw new Error(
                    "Erro interno no servidor. Tente novamente mais tarde.",
                );
            default:
                throw new Error("Erro desconhecido na API.");
        }
    }

    if (error.request) {
        throw new Error("Servidor não respondeu. Verifique sua conexão.");
    }

    throw new Error("Erro inesperado no cliente.");
}

export function formDataToClientForm(data: FormData): ClientForm {
    const get = (key: string) => data.get(key)?.toString() || undefined

    return {
        name: data.get("name") as string,
        type: data.get("type") as ClientType,
        document: data.get("document") as string,
        stateRegistration: data.get("stateRegistration") as string,
        contactName: data.get("contactName") as string,
        phoneNumber: data.get("phoneNumber") as string,
        phoneNumber2: data.get("phoneNumber2") as string,

        address: {
            address: data.get("address") as string,
            district: data.get("district") as string,
            city: data.get("city") as string,
            complement: data.get("complement") as string,
            uf: data.get("uf") as any,
            cep: data.get("cep") as string,
        },
    };
}
