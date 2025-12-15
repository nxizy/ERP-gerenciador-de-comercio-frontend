"use client";
import { ClientService } from "@/api/services/clientService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import SideHeader from "@/components/SideHeader";
import { FaSearch, FaFilter } from "react-icons/fa";
import { ClientForm } from "@/api/types/dto/client/ClientForm";
import { useRouter } from "next/navigation";
import { mapBackToFront } from "@/api/types/dto/client/ClientFormUtils";

export default function ManageClientsPage() {
  const [clients, setClients] = useState<ClientForm[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientDoc, setClientDoc] = useState("");
  const [clientSuggestions, setClientSuggestions] = useState<ClientForm[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();

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

  function useDebounce(value: string, delay = 500) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
  }

  const debouncedClientName = useDebounce(clientName);
  const debouncedClientDocument = useDebounce(clientDoc);

  useEffect(() => {
    handleCall();
  }, []);

  async function handleCall() {
    try {
      const data = await ClientService.getAll();
      const mappedClients = data.content.map((client: ClientForm) => ({
        ...client,
        type: mapBackToFront(client.type),
      }));
      setClients(mappedClients);
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar clientes");
    }
  }

  useEffect(() => {
    if (
      debouncedClientName.trim().length < 2 ||
      debouncedClientDocument.trim().length < 2
    ) {
      setClientSuggestions([]);
      return;
    }
    const filtered = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(debouncedClientName.toLowerCase()) ||
        c.document?.toLowerCase().startsWith(debouncedClientDocument.toLowerCase()),
    );
    setClientSuggestions(filtered);
    setShowSuggestions(true);
  }, [debouncedClientName, debouncedClientDocument, clients]);

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
            placeholder="Buscar por nome e documento"
            type="text"
            className="w-full text-xl outline-none bg-transparent"
            value={clientName || clientDoc}
            onChange={(e) => {
              setClientName(e.target.value);
              setClientDoc(e.target.value);
            }}
            onFocus={() => {
              clientName.length >= 2 && setShowSuggestions(true)
              clientDoc.length >= 2 && setShowSuggestions(true)
            }}
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
                  <td>{c.document ? formatDocument(c.document) : "Sem documento"}</td>
                  <td>{c.type ? `Pessoa ${c.type}` : "Sem tipo definido"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
