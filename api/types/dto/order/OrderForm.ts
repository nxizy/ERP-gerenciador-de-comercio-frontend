import { ClientForm } from "../client/ClientForm";
import { ResponsibleForm } from "../responsible/ResponsibleForm";

export interface OrderForm {
    client: ClientForm,
    responsible: ResponsibleForm
}