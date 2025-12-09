import { ClientType } from "../../enums/ClientType"
import { AddressForm } from "../address/AddressForm"

export interface ClientForm {
    id: number
    name: string
    type: ClientType
    address: AddressForm
    document?: string
    stateRegistration?: string
    contactName?: string    
    phoneNumber: string
    phoneNumber2?: string
}