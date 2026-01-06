"use client";
import { OwnerService } from "@/api/services/ownerService";
import { AddressForm } from "@/api/types/dto/address/AddressForm";
import { OwnerForm } from "@/api/types/dto/owner/OwnerForm";
import FormCamp from "@/components/FormCamp";
import Header from "@/components/HeaderInfo";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function configs() {
  const { ownerId, loading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const [owner, setOwner] = useState<OwnerForm>();

  const states = [
    "AC",
    "AL",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MS",
    "MT",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  function formatDocument(value: any) {
    value = value.replace(/\D/g, "");

    if (value.length <= 11) {
      return value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2");
    }
  }

  function formatPhone(phone: string): string {
    if (phone.length <= 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  function updateField(field: keyof OwnerForm, value: any) {
    setOwner((prev) => ({
      ...prev!,
      [field]: value,
    }));
  }

  function updateAddressField(field: keyof AddressForm, value: any) {
    setOwner((prev) => ({
      ...prev!,
      address: {
        ...prev!.address,
        [field]: value,
      },
    }));
  }

  useEffect(() => {
    if (!authLoading && ownerId) {
      handleCall();
    }
  }, [ownerId]);

  async function handleCall() {
    try {
      if (!ownerId) return;
      const res = await OwnerService.getById(ownerId);
      setOwner(res);
    } catch (err: any) {
      toast.error(err);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
      e.preventDefault();
      setLoading(true);
  
      try {
        if (!owner) throw new Error("Proprietário não carregado");

        const request: OwnerForm = {
          ...owner,
          document: owner.document?.replace(/\D/g, "") || undefined,
          phoneNumber: owner.phoneNumber?.replace(/\D/g, "") || "",
          phoneNumber2: owner.phoneNumber2?.replace(/\D/g, "") || "",
        };

        await OwnerService.update(Number(ownerId), request);

        toast.success("Proprietário atualizado com sucesso!");
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Erro ao atualizar proprietário");
      } finally {
        setLoading(false);
      }
    }

  async function handleLogout() {
    setLoading(true);
    try {
      logout();
    } catch (err: any) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-gray-400 bg-cover">
      <div className="p-2">
        <Header />
      </div>
      <main className="bg-white mx-30 my-20 rounded-lg px-20 py-15">
        <h1 className="text-4xl font-bold text-center">Configurações</h1>
        <div className="grid grid-cols-2 gap-4 mt-10">
          <FormCamp
            identifier="name"
            name="Nome:"
            colSpan={2}
            value={owner?.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
          />

          <FormCamp
            identifier="document"
            name="Documento:"
            colSpan={2}
            value={owner?.document ? formatDocument(owner?.document) : ""}
            onChange={(e) => updateField("document", e.target.value)}
          />

          <FormCamp
            identifier="phoneNumber"
            name="Número de Telefone: "
            colSpan={1}
            value={owner?.phoneNumber ? formatPhone(owner?.phoneNumber) : ""}
            onChange={(e) => updateField("phoneNumber", e.target.value)}
          />

          <FormCamp
            identifier="phoneNumber2"
            name="Número de Telefone"
            colSpan={1}
            value={owner?.phoneNumber2 ? formatPhone(owner?.phoneNumber2) : ""}
            onChange={(e) => updateField("phoneNumber2", e.target.value)}
          />

          <FormCamp
            identifier="address"
            name="Logradouro: "
            colSpan={2}
            value={owner?.address?.address || ""}
            onChange={(e) => updateAddressField("address", e.target.value)}
          />

          <FormCamp
            identifier="district"
            name="Bairro: "
            colSpan={1}
            value={owner?.address?.district || ""}
            onChange={(e) => updateAddressField("district", e.target.value)}
          />

          <FormCamp
            identifier="city"
            name="Cidade: "
            colSpan={1}
            value={owner?.address?.city || ""}
            onChange={(e) => updateAddressField("city", e.target.value)}
          />

          <div className="flex flex-col mt-10 col-span-1">
            <label htmlFor="uf" className="font-bold">
              UF:
            </label>
            <select
              name="uf"
              id="uf"
              required
              value={owner?.address.uf || ""}
              className="p-3 bg-gray-300 rounded-lg font-bold text-gray-500"
              onChange={(e) => {
                e.target.classList.replace("text-gray-500", "text-gray-900");
                updateAddressField("uf", e.target.value);
              }}
            >
              <option value="" disabled>
                ex: SP
              </option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <FormCamp
            identifier="cep"
            name="CEP: "
            colSpan={1}
            value={owner?.address?.cep || ""}
            onChange={(e) => updateAddressField("cep", e.target.value)}
          />

          <FormCamp
            identifier="complement"
            name="Complemento: "
            colSpan={2}
            value={owner?.address?.complement || ""}
            onChange={(e) => updateAddressField("complement", e.target.value)}
          />
        </div>

        <div className="flex w-full justify-center gap-10">
            <button
              className="w-70 mt-15 bg-blue-700 px-14 py-6 rounded-lg hover:bg-blue-500 cursor-pointer transition"
              type="submit"
              disabled={loading}
              onClick={handleUpdate}
            >
              <h3 className="text-3xl font-bold text-white ">
                {loading ? "Salvando..." : "Salvar"}
              </h3>
            </button>
            <button
              className="w-70 mt-15 bg-red-700 px-14 py-6 rounded-lg hover:bg-red-500 cursor-pointer transition"
              type="button"
              disabled={loading}
              onClick={handleLogout}
            >
              <h3 className="text-3xl font-bold text-white ">
                {loading ? "Saindo..." : "Sair"}
              </h3>
            </button>
          </div>
      </main>
    </div>
  );
}
