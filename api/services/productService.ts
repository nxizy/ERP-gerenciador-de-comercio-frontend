import { ProductForm } from "../types/dto/product/ProductForm";
import { handleError } from "../utils/handleError";
import { api } from "./api";

export const ProductService = {
    async create(data: ProductForm) {
        try {
            const res = await api.post("/api/products", data);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async getAll() {
        try {
            const res = await api.get("/api/products");
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async getById(id: number) {
        try {
            const res = await api.get(`/api/products/${id}`);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async update(id: number, data: ProductForm) {
        try {
            const res = await api.put(`/api/products/${id}`, data);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
    async delete(id: number) {
        try {
            const res = await api.delete(`/api/products/${id}`);
            return res.data;
        } catch (err: any) {
            handleError(err);
        }
    },
};

export function formDataToProductForm(data: FormData): ProductForm {
    const get = (key: string) => data.get(key)?.toString() || undefined;
    return {
        id: data.get("id") as any,
        name: data.get("name") as string,
        description: data.get("description") as string,
        price: data.get("price") as any,
        stockQuantity: data.get("stockQuantity") as any,
        productCode: data.get("productCode") as string,
        ncm: data.get("ncm") as string,
        cfop: data.get("cfop") as string,
    };
}
