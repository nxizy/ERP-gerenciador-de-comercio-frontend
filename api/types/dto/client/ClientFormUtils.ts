import { ClientType } from "../../enums/ClientType";

export const frontToBackTypeMap: Record<string, ClientType> = {
  fisica: ClientType.PHYSICAL,
  juridica: ClientType.LEGAL,
};

export const backToFrontTypeMap: Record<ClientType, string> = {
  [ClientType.PHYSICAL]: "fisica",
  [ClientType.LEGAL]: "juridica",
};

export function mapFrontToBack(type: string): ClientType | undefined {
  return frontToBackTypeMap[type];
}

export function mapBackToFront(type: ClientType): string {
  return backToFrontTypeMap[type];
}
