type UF =
  | "AC"
  | "AL"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MS"
  | "MT"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO";

export interface AddressForm {
  address: string;
  district: string;
  city?: string;
  complement?: string;
  uf?: UF;
  cep?: string;
}
