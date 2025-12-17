"use client";
import {
  formDataToResponsibleForm,
  ResponsibleService,
} from "@/api/services/responsibleService";
import { ResponsibleForm } from "@/api/types/dto/responsible/ResponsibleForm";
import FormCamp from "@/components/FormCamp";
import SideHeader from "@/components/SideHeader";
import { useState } from "react";
import { toast } from "sonner";

export default function AddResponsiblePage() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(event.target as HTMLFormElement);
      const req: ResponsibleForm = formDataToResponsibleForm(form);
      await ResponsibleService.create(req);
      toast.success("Responsável cadastrado com sucesso");
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao cadastrar responsável");
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div className="flex bg-gray-300">
      <div className="fixed top-0 left-0">
        <SideHeader />
      </div>
      <main className="bg-white ml-100 mt-20 mr-30 mb-30 p-30 w-full rounded-lg">
        <form onSubmit={handleSubmit}>
          <h1 className="font-bold text-5xl text-center">Cadastro de Responsável</h1>

          <h3 className="text-2xl text-center mt-20">Informações Pessoais</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormCamp
              identifier="name"
              name="Nome:"
              colSpan={4}
              placeHolder="ex: Fulano de Tal"
              required
            />
            <FormCamp
              identifier="document"
              name="Documento: "
              colSpan={2}
              onChange={(e) => formatDocument(e.target.value)}
              placeHolder="ex: 555.555.555-55 ou 55.555.555/0001-55"
            />
            <FormCamp
              identifier="function"
              name="Função: "
              colSpan={2}
              placeHolder="ex: Técnico de Informática"
            />
          </div>
          <div className="flex w-full justify-center">
            <button
              className="w-70 mt-15 bg-blue-700 px-14 py-6 rounded-lg hover:bg-blue-500 cursor-pointer transition"
              type="submit"
              disabled={loading}
            >
              <h3 className="text-3xl font-bold text-white ">
                {loading ? "Enviando..." : "Cadastrar"}
              </h3>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
