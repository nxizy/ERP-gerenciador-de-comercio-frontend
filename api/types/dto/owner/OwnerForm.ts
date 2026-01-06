import { AddressForm } from "../address/AddressForm"

export interface OwnerForm {
    id?: number
    name?: string
    address: AddressForm
    document?: string
    phoneNumber?: string
    phoneNumber2?: string
}