import { api } from "./api";


export interface OrderForm {
    clientId: string;
    employeeId:string;
    ownerId:string;
    address: string;
    phone: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}

// Tipagem do que o backend retorna
export interface OrderResponse extends OrderForm {
    id: number;
    total: number;
    createdAt: string;
}

export const OrdersService = {
    create: async (data: OrderForm): Promise<OrderResponse> => {
        const response = await api.post("/orders", data);
        return response.data;
    },

    getById: async (id: number): Promise<OrderResponse> => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
};
