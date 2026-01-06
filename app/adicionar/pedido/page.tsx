
"use client";

import SideHeader from "@/components/SideHeader";
import FormCamp from "@/components/FormCamp";
import DataFormCamp from "@/components/DataFormCamp";
import { useEffect, useState, useRef } from "react";
import { PiSealCheck } from "react-icons/pi";
import UserConfirmation from "@/components/UserConfirmation";
import SaveButton from "@/components/SaveButton";
import { ClientService } from "@/api/services/clientService";
import { ClientForm } from "@/api/types/dto/client/ClientForm";
import { mapBackToFront } from "@/api/types/dto/client/ClientFormUtils";

interface ProductProps {
  id: number;
  name: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

interface FormDataProps {
  name: string;
  address: string;
  cep: string;
  contactName: string;
  contactPhone1: string;
  contactPhone2: string;
  products: ProductProps[];
  totalOrderValue: any;

  orderSolicitation: string;
  entryDate: string;
  status: "Aberto" | "Em Andamento" | "Concluído" | "Cancelado";
  serviceDescription: string;
  finishDate: string;
  pickupDate: string;
  responsible: string;
}

function useDebounce(value: string, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function AddPedidoPage() {
  const [tab, setTab] = useState(1);

  // Formulário padrão
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    address: "",
    cep: "",
    contactName: "",
    contactPhone1: "",
    contactPhone2: "",
    products: [],
    totalOrderValue: 0,
    orderSolicitation: "",
    entryDate: "",
    status: "Aberto",
    serviceDescription: "",
    finishDate: "",
    pickupDate: "",
    responsible: "",
  });

  const [savedOrder, setSavedOrder] = useState(null);

  const [clientName, setClientName] = useState("");
  const debouncedClient = useDebounce(clientName);
  const [clientSuggestions, setClientSuggestions] = useState<any[]>([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const clientRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    if (debouncedClient.length < 2) return;

    setClientSuggestions([
      {
        id: 1,
        name: "Neymar",
        cep: "00000-000",
        address: "Rua teste",
        contactName: "Pedrinho",
        contactPhone1: "(19) 99999-9999",
        contactPhone2: "(19) 98888-8888",
      },
      { id: 2, name: "Nelson", cep: "11111-111", address: "Av xp" },
    ]);
    setShowClientSuggestions(true);
  }, [debouncedClient]);


  const handleSelectClient = (client: any) => {
    setFormData((prev) => ({
      ...prev,
      name: client.name,
      address: client.address,
      cep: client.cep,
      contactName: client.contactName,
      contactPhone1: client.contactPhone1,
      contactPhone2: client.contactPhone2,
    }));
    setClientName(client.name);
    setShowClientSuggestions(false);
  };

  const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClientName(value);

    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        name: "",
        address: "",
        cep: "",
        contactName: "",
        contactPhone1: "",
        contactPhone2: "",
      }));
      setClientSuggestions([]);
    }
  };

  async function handleSaveForm() {
    // const response = await api.post("/orders", formData)
    // setSavedOrder(response.data)
  }

  function handlePrint() {
    if (!savedOrder) return alert("Salve a ordem antes de imprimir");

    // printOrder(savedOrder)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clientRef.current && !clientRef.current.contains(e.target as Node)) {
        setShowClientSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------- PRODUTO ----------
  const [prodName, setProdName] = useState("");
  const [prodQty, setProdQty] = useState<number | "">("");
  const [prodValue, setProdValue] = useState<number | "">("");
  const debouncedProd = useDebounce(prodName);
  const [productSuggestions, setProductSuggestions] = useState<any[]>([]);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  useEffect(() => {
    if (debouncedProd.length < 2) return;

    // 🔥 Simulação backend
    setProductSuggestions([
      { id: 10, name: "Notebook Dell" },
      { id: 11, name: "Fonte 19v" },
    ]);
    setShowProductSuggestions(true);
  }, [debouncedProd]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (productRef.current && !productRef.current.contains(e.target as Node)) {
        setShowProductSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addProduct = () => {
    if (!prodName || !prodQty || !prodValue) return;

    const newProduct: ProductProps = {
      id: Date.now(),
      name: prodName,
      quantity: Number(prodQty),
      unitValue: Number(prodValue),
      totalValue: Number(prodQty) * Number(prodValue),
    };

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
      totalOrderValue: prev.totalOrderValue + newProduct.totalValue,
    }));

    setProdName("");
    setProdQty("");
    setProdValue("");
  };

  function handleDeleteProduct() {
    if (selectedProduct == null) return;

    const deletedItem = formData.products.find((p) => p.id === selectedProduct);

    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== selectedProduct),
      totalOrderValue: deletedItem
        ? prev.totalOrderValue - deletedItem.totalValue
        : prev.totalOrderValue,
    }));

    setOpenConfirmation(false);
    setSelectedProduct(null);
  }

  return (
    <div className="flex bg-gray-300">
      <div className="fixed top-0 left-0">
        <SideHeader />
      </div>

      <main className="flex ml-100 mt-10 mr-20 mb-10 p-30 w-full">
        <div className="flex flex-col w-full">
          <div className="self-end rounded-t-lg flex gap-2 px-4 pt-2">
            <button
              className={`px-4 py-2 rounded-t-lg ${tab === 1 ? "bg-white" : "bg-gray-400 text-white"}`}
              onClick={() => setTab(1)}
            >
              Dados do Pedido
            </button>

            <button
              className={`px-4 py-2 rounded-t-lg ${tab === 2 ? "bg-white" : "bg-gray-400 text-white"}`}
              onClick={() => setTab(2)}
            >
              Solicitação
            </button>
          </div>

          <div className="flex bg-white p-12 shadow rounded-lg">
            {tab === 1 && (
              <div className="w-full">
                <h1 className="mt-5 font-bold text-center text-5xl">
                  Cadastro de Pedido
                </h1>
                <h3 className="text-2xl text-center mt-20">Informações do Cliente</h3>

                <div className="grid grid-cols-4 gap-4 relative">
                  <div className="col-span-4" ref={clientRef}>
                    <FormCamp
                      identifier="clienteNome"
                      colSpan={3}
                      name="Nome: "
                      value={clientName}
                      onChange={handleClientNameChange}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        clientSuggestions[0] &&
                        handleSelectClient(clientSuggestions[0])
                      }
                      placeHolder="Digite para buscar..."
                    >
                      {showClientSuggestions &&
                        clientName &&
                        clientSuggestions.length > 0 && (
                          <div className="absolute bg-white shadow mt-20 w-full z-50">
                            {clientSuggestions.map((c) => (
                              <p
                                key={c.id}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectClient(c)}
                              >
                                {c.name}
                              </p>
                            ))}
                          </div>
                        )}
                    </FormCamp>
                  </div>
                  <DataFormCamp
                    identifier="address"
                    name="Endereço: "
                    placeholder={"----------"}
                    colSpan={3}
                    data={formData.address}
                  />
                  <DataFormCamp
                    identifier="cep"
                    name="CEP: "
                    placeholder={"----------"}
                    colSpan={1}
                    data={formData.cep}
                  />
                  <DataFormCamp
                    identifier="nomeContato"
                    name="Nome do Contato: "
                    colSpan={2}
                    placeholder={"----------"}
                    data={formData.contactName}
                  />
                  <DataFormCamp
                    identifier="telefone2"
                    name="Telefone 1: "
                    colSpan={1}
                    placeholder={"----------"}
                    data={formData.contactPhone1}
                  />
                  <DataFormCamp
                    identifier="telefone2"
                    name="Telefone: "
                    colSpan={1}
                    placeholder={"----------"}
                    data={formData.contactPhone2}
                  />

                  <div className="col-span-4 mt-10">
                    <h2 className="text-2xl mb-4 text-gray-400">Itens</h2>

                    <table className="w-full">
                      <thead className="">
                        <tr className="bg-gray-300">
                          <th className="rounded-tl-lg p-4">Produto</th>
                          <th className="p-4">Qtd</th>
                          <th className="p-4">Valor</th>
                          <th className="rounded-tr-lg p-4">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.products.map((p) => (
                          <tr
                            key={p.id}
                            onClick={() => {
                              setSelectedProduct(p.id);
                              setOpenConfirmation(true);
                            }}
                            className="border-b bg-gray-200 hover:cursor-pointer"
                          >
                            <td className="p-2">{p.name}</td>
                            <td className="p-2">{p.quantity}</td>
                            <td className="p-2">R$ {p.unitValue.toFixed(2)}</td>
                            <td className="p-2">R$ {p.totalValue.toFixed(2)}</td>
                          </tr>
                        ))}

                        {/* ---------- NOVO ITEM ---------- */}
                        <tr className="bg-gray-200">
                          <td className="p-2 relative">
                            <div ref={productRef} className="relative">
                              <input
                                className="w-full bg-gray-200 p-1"
                                value={prodName}
                                placeholder="Produto..."
                                onChange={(e) => setProdName(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  productSuggestions[0] &&
                                  setProdName(productSuggestions[0].name)
                                }
                              />

                              {showProductSuggestions &&
                                prodName &&
                                productSuggestions.length > 0 && (
                                  <div className="absolute bg-white shadow mt-1 w-full z-50">
                                    {productSuggestions.map((p) => (
                                      <p
                                        key={p.id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => setProdName(p.name)}
                                      >
                                        {p.name}
                                      </p>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </td>

                          <td>
                            <input
                              className="p-1 w-full"
                              type="number"
                              value={prodQty}
                              placeholder="Qtd"
                              onChange={(e) => setProdQty(e.target.valueAsNumber || "")}
                            />
                          </td>

                          <td>
                            <input
                              className="p-1 w-full"
                              type="number"
                              value={prodValue}
                              placeholder="Valor"
                              onChange={(e) => setProdValue(e.target.valueAsNumber || "")}
                              onKeyDown={(e) => e.key === "Enter" && addProduct()}
                            />
                          </td>

                          <td className="p-1 font-bold">
                            R${" "}
                            {prodQty && prodValue
                              ? (prodQty * prodValue).toFixed(2)
                              : "0,00"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <UserConfirmation
                    isOpen={openConfirmation}
                    message="Tem certeza de que deseja excluir este item?"
                    onConfirm={handleDeleteProduct}
                    onCancel={() => setOpenConfirmation(false)}
                  />

                  <DataFormCamp
                    identifier="total"
                    name="Total do Pedido:"
                    placeholder={"R$ 0.00"}
                    colSpan={4}
                    data={`R$ ${formData.totalOrderValue.toFixed(2)}`}
                  />
                  <SaveButton
                    onClick={() => console.log(formData)}
                    colSpan={1}
                    label="Salvar"
                  >
                    <PiSealCheck size={30} />
                  </SaveButton>
                </div>
              </div>
            )}

            {tab === 2 && (
              <div className="w-full">
                <h1 className="mt-5 font-bold text-center text-5xl">
                  Cadastro de Pedido
                </h1>
                <h3 className="text-2xl text-center mt-20">Solicitação</h3>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

