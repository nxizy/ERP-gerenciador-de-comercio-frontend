"use client";
import { ClientService, formDataToClientForm } from "@/api/services/clientService";
import { ClientForm } from "@/api/types/dto/client/ClientForm";
import FormCamp from "@/components/FormCamp";
import SideHeader from "@/components/SideHeader";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function AddClientPage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

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
    "TO"
  ];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(event.target as HTMLFormElement);
      const req: ClientForm = formDataToClientForm(form);
      console.log(req);
      await ClientService.create(req);
      toast.success("Cliente cadastrado com sucesso");

      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);

      const message = error.message || "Erro ao cadastrar cliente";
      toast.error(message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex bg-gray-300">
      <div className="fixed top-0 left-0">
        <SideHeader />
      </div>
      <main className="bg-white ml-100 mt-20 mr-30 mb-30 p-30 w-full rounded-lg">
        <form onSubmit={handleSubmit}>
          <h1 className="font-bold text-5xl text-center">Cadastro de Cliente</h1>

          <h3 className="text-2xl text-center mt-20">Informações Pessoais</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormCamp
              identifier="name"
              name="Nome:"
              colSpan={3}
              placeHolder="ex: Fulano de Tal"
              required
            />
            <div className="flex flex-col mt-10 col-span-1">
              <label htmlFor="tipoPessoa" className="font-bold">
                Tipo de Pessoa:
              </label>
              <select
                name="tipoPessoa"
                id="tipoPessoa"
                defaultValue=""
                className="p-3 bg-gray-300 rounded-lg font-bold text-gray-500"
                onChange={(e) =>
                  e.target.classList.replace("text-gray-500", "text-gray-900")
                }
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
              placeHolder="ex: 555.555.555-55 ou 55.555.555/0001-55"
            />
            <FormCamp
              identifier="inscricaoEstadual"
              name="Inscrição Estadual: "
              colSpan={2}
              placeHolder="ex: 555.555.555.555"
            />
          </div>

          <h3 className="text-2xl text-center mt-20">Informações de Contato</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormCamp
              identifier="nomeContato"
              name="Nome do Contato: "
              colSpan={2}
              placeHolder="ex: Ciclano"
            />
            <FormCamp
              identifier="telefone1"
              name="Telefone: "
              colSpan={1}
              placeHolder="ex: (11) 99999-9999"
            />
            <FormCamp
              identifier="telefone2"
              name="Telefone: "
              colSpan={1}
              placeHolder="ex: (11) 99999-9999"
            />
          </div>

          <h3 className="text-2xl text-center mt-20">Endereço</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormCamp
              identifier="logradouro"
              name="Logradouro: "
              colSpan={2}
              placeHolder="ex: Rua das Flores, 123"
            />
            <FormCamp
              identifier="complemento"
              name="Complemento: "
              colSpan={2}
              placeHolder="ex: Apt 22, Torre 5"
            />
            <FormCamp
              identifier="bairro"
              name="Bairro: "
              colSpan={1}
              placeHolder="ex: Centro"
            />
            <FormCamp
              identifier="cep"
              name="CEP: "
              colSpan={1}
              placeHolder="ex: 13333-333"
            />
            <FormCamp
              identifier="cidade"
              name="Cidade: "
              colSpan={1}
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
                defaultValue=""
                className="p-3 bg-gray-300 rounded-lg font-bold text-gray-500"
                onChange={(e) =>
                  e.target.classList.replace("text-gray-500", "text-gray-900")
                }
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
          <div className="flex w-full justify-center">
            <button
              className="w-70 mt-15 bg-blue-700 px-14 py-6 rounded-lg hover:bg-blue-500 cursor-pointer transition"
              type="submit"
              disabled={loading}
            >
              <h3 className="text-3xl font-bold text-white ">{loading? "Enviando..." : "Cadastrar"}</h3>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
