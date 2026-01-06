import { OwnerForm } from "../types/dto/owner/OwnerForm";
import { OwnerLoginForm } from "../types/dto/owner/OwnerLoginForm";
import { handleError } from "../utils/handleError";
import { api } from "./api";

export const OwnerService = {
    async create(data: OwnerForm) {
        try {
            const res = await api.post("/api/owners",data)
            return res.data
        } catch (err: any) {
            handleError(err)
        }
    },
    async login(loginReq: OwnerLoginForm) {
        try {
            const res = await api.post("/api/owners/login", loginReq)
            return res.data
        } catch (err: any) {
            handleError(err)
        }
    },
    async update(id: number, data: OwnerForm) {
        try {
            const res = await api.put(`/api/owners/${id}`, data)
            return res.data
        } catch (err: any) {
            handleError(err)
        }
    },
    async getById(id: string) {
        try {
            const res = await api.get(`/api/owners/${id}`)
            return res.data
        } catch (err: any) {
            handleError(err)
        }
    }
}