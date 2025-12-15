"use client";
import { ClientService } from "@/api/services/clientService";
import { AddressForm } from "@/api/types/dto/address/AddressForm";
import { ClientForm } from "@/api/types/dto/client/ClientForm";
import FormCamp from "@/components/FormCamp";
import SideHeader from "@/components/SideHeader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManageClientPage() {
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<ClientForm>();
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

  useEffect(() => {
    handleCall();
  }, []);

  function updateField(field: keyof ClientForm, value: any) {
    setClient((prev) => ({
      ...prev!,
      [field]: value,
    }));
  }

  function updateAddressField(field: keyof AddressForm, value: any) {
    setClient((prev) => ({
      ...prev!,
      address: {
        ...prev!.address,
        [field]: value,
      },
    }));
  }

  function formatDocument(value: any) {
    value = value.replace(/\D/g, "");

    if (value.length <= 11) {
      return value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else if (value.length == 12) {
      return value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2");
    } else {
      return value
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  }

  function formatPhone(phone: string): string {
    if (phone.length <= 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  async function handleCall() {
    try {
      const data = await ClientService.getById(Number(id));
      setClient(data);
    } catch (err: any) {
      toast.error("Cliente não encontrado");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!client) throw new Error("Cliente não carregado");

      const request: ClientForm = {
        ...client,
        document: client.document?.replace(/\D/g, "") || undefined,
        stateRegistration: client.stateRegistration?.replace(/\D/g, "") || undefined,
        phoneNumber: client.phoneNumber?.replace(/\D/g, "") || "",
        phoneNumber2: client.phoneNumber2?.replace(/\D/g, "") || "",
      };

      await ClientService.update(Number(id), request);

      toast.success("Cliente atualizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao atualizar cliente");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    setLoading(true);

    try {
      await ClientService.delete(Number(id));
      toast.success("Cliente excluído com sucesso!");
      window.location.href = "/gerenciar/cliente";
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao excluir cliente");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex bg-gray-300">
      <div className="fixed top-0 left-0">
        <SideHeader />
      </div>
      <main className="bg-white ml-100 mt-20 mr-30 mb-30 p-30 w-full rounded-lg">
        <form onSubmit={handleUpdate}>
          <h1 className="font-bold text-5xl text-center">Atualização de dados do Cliente</h1>

          <h3 className="text-2xl text-center mt-20">Informações Pessoais</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormCamp
              identifier="name"
              name="Nome:"
              colSpan={3}
              value={client?.name || ""}
              placeHolder="ex: Fulano de Tal"
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
            <div className="flex flex-col mt-10 col-span-1">
              <label htmlFor="tipoPessoa" className="font-bold">
                Tipo de Pessoa:
              </label>
              <select
                name="tipoPessoa"
                id="tipoPessoa"
                value={client?.type || ""}
                className="p-3 bg-gray-300 rounded-lg font-bold text-gray-500"
                onChange={(e) => {
                  e.target.classList.replace("text-gray-500", "text-gray-900");
                  updateField("type", e.target.value);
                }}
                required
              >
                <option value="" disabled>
                  ex: PJ ou PF
                </option>
                <option value="fisica">Pessoa Física</option>
                <option value="juridica">Pessoa Jurídica</option>
              </select>
            </div>
            <FormCamp
              identifier="documento"
              name="Documento: "
              colSpan={2}
              value={client?.document ? formatDocument(client.document) : ""}
              onChange={(e) => updateField("document", formatDocument(e.target.value))}
              placeHolder="ex: 555.555.555-55 ou 55.555.555/0001-55"
            />
            <FormCamp
              identifier="inscricaoEstadual"
              name="Inscrição Estadual: "
              colSpan={2}
              value={
                client?.stateRegistration ? formatDocument(client.stateRegistration) : ""
              }
              onChange={(e) => updateField("stateRegistration", e.target.value)}
              placeHolder="ex: 555.555.555.555"
            />
          </div>

          <h3 className="text-2xl text-center mt-20">Informações de Contato</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormCamp
              identifier="nomeContato"
              name="Nome do Contato: "
              colSpan={2}
              value={client?.contactName || ""}
              onChange={(e) => updateField("contactName", e.target.value)}
              placeHolder="ex: Ciclano"
            />
            <FormCamp
              identifier="telefone1"
              name="Telefone: "
              colSpan={1}
              value={client?.phoneNumber ? formatPhone(client.phoneNumber) : ""}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              placeHolder="ex: (11) 99999-9999"
            />
            <FormCamp
              identifier="telefone2"
              name="Telefone: "
              colSpan={1}
              value={client?.phoneNumber2 ? formatPhone(client.phoneNumber2) : ""}
              onChange={(e) => updateField("phoneNumber2", e.target.value)}
              placeHolder="ex: (11) 99999-9999"
            />
          </div>

          <h3 className="text-2xl text-center mt-20">Endereço</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormCamp
              identifier="logradouro"
              name="Logradouro: "
              colSpan={2}
              value={client?.address.address || ""}
              onChange={(e) => updateAddressField("address", e.target.value)}
              placeHolder="ex: Rua das Flores, 123"
            />
            <FormCamp
              identifier="complemento"
              name="Complemento: "
              colSpan={2}
              value={client?.address.complement || ""}
              onChange={(e) => updateAddressField("complement", e.target.value)}
              placeHolder="ex: Apt 22, Torre 5"
            />
            <FormCamp
              identifier="bairro"
              name="Bairro: "
              colSpan={1}
              value={client?.address.district || ""}
              onChange={(e) => updateAddressField("district", e.target.value)}
              placeHolder="ex: Centro"
            />
            <FormCamp
              identifier="cep"
              name="CEP: "
              colSpan={1}
              value={client?.address.cep || ""}
              onChange={(e) => updateAddressField("cep", e.target.value)}
              placeHolder="ex: 13333-333"
            />
            <FormCamp
              identifier="cidade"
              name="Cidade: "
              colSpan={1}
              value={client?.address.city || ""}
              onChange={(e) => updateAddressField("city", e.target.value)}
              placeHolder="ex: São Paulo"
            />
            <div className="flex flex-col mt-10 col-span-1">
              <label htmlFor="uf" className="font-bold">
                UF:
              </label>
              <select
                name="uf"
                id="uf"
                required
                value={client?.address.uf || ""}
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
          </div>
          <div className="flex w-full justify-center gap-10">
            <button
              className="w-70 mt-15 bg-blue-700 px-14 py-6 rounded-lg hover:bg-blue-500 cursor-pointer transition"
              type="submit"
              disabled={loading}
              onClick={handleUpdate}
            >
              <h3 className="text-3xl font-bold text-white ">
                {loading ? "Enviando..." : "Salvar"}
              </h3>
            </button>
            <button
              className="w-70 mt-15 bg-red-700 px-14 py-6 rounded-lg hover:bg-red-500 cursor-pointer transition"
              type="button"
              disabled={loading}
              onClick={handleDelete}
            >
              <h3 className="text-3xl font-bold text-white ">
                {loading ? "Excluindo..." : "Excluir"}
              </h3>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
