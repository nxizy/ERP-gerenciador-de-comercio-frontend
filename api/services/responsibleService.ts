import { ProductForm } from "../types/dto/product/ProductForm";
import { ResponsibleForm } from "../types/dto/responsible/ResponsibleForm";
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
            const res = await api.get("/api/products")
            return res.data
        } catch (err: any) {
            handleError(err)
        }
    },
};

export function formDataToResponsibleForm(data: FormData): ResponsibleForm {
    const get = (key: string) => data.get(key)?.toString() || undefined;
    return {
        id: data.get("id") as any,
        name: data.get("name") as string,
        document: data.get("document") as string,
        function: data.get("function") as string
    };
}
