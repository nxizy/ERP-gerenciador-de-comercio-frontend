import { ResponsibleForm } from "../types/dto/responsible/ResponsibleForm";
import { handleError } from "../utils/handleError";
import { api } from "./api";

export const ResponsibleService = {
    async create(data: ResponsibleForm) {
        try {
            const res = await api.post("/api/employees", data);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async getAll() {
        try {
            const res = await api.get("/api/employees");
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async getById(id: number) {
        try {
            const res = await api.get(`/api/employees/${id}`);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async update(id: number, data: ResponsibleForm) {
        try {
            const res = await api.put(`/api/employees/${id}`, data);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async delete(id: number) {
        try {
            const res = await api.delete(`/api/employees/${id}`);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
};

export function formDataToResponsibleForm(data: FormData): ResponsibleForm {
    const get = (key: string) => data.get(key)?.toString() || undefined;
    return {
        id: data.get("id") as any,
        name: data.get("name") as string,
        document: data.get("document") as string,
        function: data.get("function") as string,
    };
}
