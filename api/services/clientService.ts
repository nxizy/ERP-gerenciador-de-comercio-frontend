import { ClientForm } from "../types/dto/client/ClientForm";
import { GetClientParams } from "../types/dto/client/GetClientParams";
import { ClientType } from "../types/enums/ClientType";
import { handleError } from "../utils/handleError";
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
            handleError(err);
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
            handleError(err);
        }
    },
    async getById(id: number) {
        try {
            const res = await api.get(`/api/clients/${id}`);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async update(id: number, data: ClientForm) {
        try {
            const res = await api.put(`/api/clients/${id}`, data);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async delete(id: number) {
        try {
            const res = await api.delete(`/api/clients/${id}`);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
};

export function formDataToClientForm(data: FormData): ClientForm {
    const get = (key: string) => data.get(key)?.toString() || undefined;
    return {
        id: data.get("id") as any,
        name: data.get("name") as string,
        type: data.get("type") as ClientType,
        document: data.get("document") as string,
        stateRegistration: data.get("inscricaoEstadual") as string,
        contactName: data.get("nomeContato") as string,
        phoneNumber: data.get("telefone1") as string,
        phoneNumber2: data.get("telefone2") as string,

        address: {
            address: data.get("logradouro") as string,
            district: data.get("bairro") as string,
            city: data.get("cidade") as string,
            complement: data.get("complemento") as string,
            uf: data.get("uf") as any,
            cep: data.get("cep") as string,
        },
    };
}
