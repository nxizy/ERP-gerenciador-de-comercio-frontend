"use client"
import { ResponsibleService } from "@/api/services/responsibleService";
import { ResponsibleForm } from "@/api/types/dto/responsible/ResponsibleForm";
import SideHeader from "@/components/SideHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManageResponsiblesPage() {
  const [responsibles, setResponsibles] = useState<ResponsibleForm[]>([]);
  const router = useRouter();

  useEffect(() => {
      handleCall();
    }, []);

  async function handleCall() {
    try {
      const data = await ResponsibleService.getAll();
      setResponsibles(data.content);
    } catch (err: any) {
      toast.error("Falha ao carregar responsáveis");
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
        <h1 className="text-4xl font-bold">Responsáveis</h1>

        <div>
          <div className="rounded-t-lg mt-20 bg-gray-300">
            <div className="flex align-middle w-full justify-between py-6 px-10">
              <h3 className="font-bold text-xl">Responsáveis</h3>
            </div>
          </div>

          <table className="w-full overflow-hidden rounded-b-lg">
            <thead>
              <tr className="bg-gray-400 text-center">
                <th className="py-2">Id do Responsável</th>
                <th>Nome</th>
                <th>Documento</th>
                <th>Função</th>
              </tr>
            </thead>
            <tbody>
              {responsibles.map((r) => (
                <tr
                  key={r.id}
                  className="bg-gray-300 border-b hover:bg-gray-400 transition cursor-pointer text-center"
                  onClick={() => router.push(`/gerenciar/responsavel/${r.id}`)}
                >
                  <td className="p-2">{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.document ? formatDocument(r.document) : "Sem documento"}</td>
                  <td>{r.function ? r.function : "Sem função definida"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
