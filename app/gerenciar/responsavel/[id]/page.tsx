"use client"
import { ResponsibleService } from "@/api/services/responsibleService";
import { ResponsibleForm } from "@/api/types/dto/responsible/ResponsibleForm";
import FormCamp from "@/components/FormCamp";
import SideHeader from "@/components/SideHeader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManageResponsiblePage() {
  const [responsible, setResponsible] = useState<ResponsibleForm>();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    handleCall()
  },[])

  async function handleCall() {
    try {
      const data = await ResponsibleService.getById(Number(id));
      setResponsible(data);
    } catch (err: any) {
      toast.error(err)
    }
  }

  function updateField(field: keyof ResponsibleForm, value: any) {
    setResponsible((prev) => ({
      ...prev!,
      [field]: value,
    }));
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

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!responsible) throw new Error("Responsável não carregado");

      const request: ResponsibleForm = {
        ...responsible,
        document: responsible.document?.replace(/\D/g, ""),
      };
      await ResponsibleService.update(Number(id), request);
      toast.success("Responsável atualizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao atualizar responsável");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este responsável?")) return;
    setLoading(true);

    try {
      await ResponsibleService.delete(Number(id));
      toast.success("Responsável excluído com sucesso!");
      window.location.href = "/gerenciar/responsavel";
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao excluir responsável");
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
          <h1 className="font-bold text-5xl text-center">
            Atualização de dados do Responsável
          </h1>

          <h3 className="text-2xl text-center mt-20">Informações Pessoais</h3>
          <div className="grid grid-cols-4 gap-4">
            <FormCamp
              identifier="name"
              name="Nome:"
              colSpan={4}
              value={responsible?.name || ""}
              placeHolder="ex: Fulano de Tal"
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
            <FormCamp
              identifier="document"
              name="Documento: "
              colSpan={2}
              value={responsible?.document ? formatDocument(responsible.document) : ""}
              onChange={(e) => updateField("document", formatDocument(e.target.value))}
              placeHolder="ex: 555.555.555-55 ou 55.555.555/0001-55"
            />
            <FormCamp
              identifier="function"
              name="Função: "
              value={responsible?.function || ""}
              colSpan={2}
              onChange={(e) => updateField("function", e.target.value)}
              placeHolder="ex: Técnico de Informática"
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
