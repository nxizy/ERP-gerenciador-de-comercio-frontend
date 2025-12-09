import { ClientType } from "../../enums/ClientType"
import { AddressForm } from "../address/AddressForm"

export interface ClientResponse {
    id: number
    name: string
    type: ClientType
    address: AddressForm
    document?: string
    stateRegistration?: string
    contactName?: string    
    phoneNumber1: string
    phoneNumber2?: string

}