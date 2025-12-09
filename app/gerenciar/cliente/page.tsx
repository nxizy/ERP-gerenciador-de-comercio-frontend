"use client";
import { ClientService } from "@/api/services/clientService";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import SideHeader from "@/components/SideHeader";
import { FaSearch, FaFilter } from "react-icons/fa";
import { ClientForm } from "@/api/types/dto/client/ClientForm";
import { useRouter } from "next/navigation";

export default function ManageClientsPage() {
  const [clients, setClients] = useState<ClientForm[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState<ClientForm[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();

  function useDebounce(value: string, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
  }

  const debouncedClient = useDebounce(clientName);

  useEffect(() => {
    handleCall();
  }, []);

  async function handleCall() {
    try {
      const data = await ClientService.getAll();
      setClients(data.content);
      toast.success("Clientes carregados com sucesso!");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (debouncedClient.trim().length < 2) {
      setClientSuggestions([]);
      return;
    }

    const filtered = clients.filter((c) =>
      c.name.toLowerCase().includes(debouncedClient.toLowerCase())
    );

    setClientSuggestions(filtered);
    setShowSuggestions(true);
  }, [debouncedClient, clients]);

  function handleSelectClient(client: ClientForm) {
    setClientName(client.name);
    setShowSuggestions(false);
    router.push(`/gerenciar/cliente/${client.id}`);
  }

  return (
    <div className="flex bg-gray-300">
      <div className="fixed top-0 left-0">
        <SideHeader />
      </div>

      <main className="bg-white ml-100 mt-20 mr-30 mb-30 p-30 w-full rounded-lg">
        <h1 className="text-4xl font-bold">Clientes</h1>

        <div className="relative mt-7 rounded-lg py-4 px-9 bg-gray-400 flex items-center gap-3">
          <input
            placeholder="Buscar por nome"
            type="text"
            className="w-full text-xl outline-none bg-transparent"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            onFocus={() => clientName.length >= 2 && setShowSuggestions(true)}
          />
          <FaSearch size={23} />

          {showSuggestions && clientSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow rounded-md z-20">
              {clientSuggestions.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectClient(c)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {c.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="rounded-t-lg mt-20 bg-gray-300">
            <div className="flex align-middle w-full justify-between py-6 px-10">
              <h3 className="font-bold text-xl">Clientes</h3>
              <button className="pr-4 hover:cursor-pointer">
                <FaFilter size={22} />
              </button>
            </div>
          </div>

          <table className="w-full overflow-hidden rounded-b-lg">
            <thead>
              <tr className="bg-gray-400 text-center">
                <th className="py-2">Id do Cliente</th>
                <th>Nome</th>
                <th>Documento</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="bg-gray-300 border-b hover:bg-gray-400 transition cursor-pointer text-center"
                  onClick={() => router.push(`/gerenciar/cliente/${c.id}`)}
                >
                  <td className="p-2">{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.document || "Sem documento"}</td>
                  <td>{c.type || "Sem tipo definido"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
