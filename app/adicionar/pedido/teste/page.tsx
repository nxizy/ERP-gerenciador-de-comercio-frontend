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
import { toast } from "sonner";
import formatPhone from "@/utils/formatter";
import { ProductService } from "@/api/services/productService";
import { ProductForm } from "@/api/types/dto/product/ProductForm";
import { FaPrint } from "react-icons/fa6";

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

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
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
    entryDate: getTodayDate(),
    status: "Aberto",
    serviceDescription: "",
    finishDate: "",
    pickupDate: "",
    responsible: "",
  });

  const [savedOrder, setSavedOrder] = useState(null);

  // ----- Clientes -----

  const [clientName, setClientName] = useState<string>("");
  const debouncedClient = useDebounce(clientName);
  const [clientSuggestions, setClientSuggestions] = useState<any[]>([]);
  const [clients, setClients] = useState<ClientForm[]>([]);
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const clientRef = useRef<HTMLObjectElement>(null);
  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const res = await ClientService.getAll();
      const mappedClients = res.content.map((client: ClientForm) => ({
        ...client,
        type: mapBackToFront(client.type),
      }));
      setClients(mappedClients);
    } catch (err: any) {
      toast.error(err.message || "Erro ao buscar clientes");
    }
  }

  useEffect(() => {
    if (!debouncedClient || debouncedClient.length < 2) return;

    const filtered = clients.filter((c) =>
      c.name.toLowerCase().includes(debouncedClient.toLowerCase()),
    );
    setClientSuggestions(filtered);
    setShowClientSuggestions(true);
  }, [debouncedClient]);

  const handleSelectClient = (client: any) => {
    const hasAddress =
      client.address && client.address.address && client.address.district;

    const formattedAddress = hasAddress
      ? `${client.address.address}, ${client.address.district}${client.address.city ? " - " + client.address.city : ""}`
      : "";

    setFormData((prev) => ({
      ...prev,
      name: client.name,
      address: formattedAddress,
      cep: client.address.cep,
      contactName: client.contactName,
      contactPhone1: client.phoneNumber ? formatPhone(client.phoneNumber) : "",
      contactPhone2: client.phoneNumber2 ? formatPhone(client.phoneNumber2) : "",
    }));

    console.log(client);
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
  const [products, setProducts] = useState<ProductForm[]>([]);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await ProductService.getAll();
      setProducts(res.content);
    } catch (err: any) {
      toast.error(err.message || "Erro ao buscar produtos");
    }
  }

  useEffect(() => {
    if (debouncedProd.length < 2) return;
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(debouncedProd.toLowerCase()),
    );
    setProductSuggestions(filtered);
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

  async function handleSaveForm() {
    // const response = await api.post("/orders", formData)
    // setSavedOrder(response.data)
    console.log(formData);
  }

  function handlePrintClosed() {
    if (!savedOrder) return alert("Salve a ordem antes de imprimir");

    // printFinishedOrder(savedOrder)
  }

  function handlePrintEntry() {

    //printEntryOrder()
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
                    identifier="telefone1"
                    name="Telefone: "
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
                  <SaveButton onClick={handleSaveForm} colSpan={1} label="Salvar">
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

                <div className="grid grid-cols-4 gap-4 relative">
                  <div className={`flex flex-col mt-10 col-span-3 row-span-2`}>
                    <label htmlFor="solicitation" className="font-bold">
                      Solicitação:
                    </label>
                    <textarea
                      id="solicitation"
                      name="solicitation"
                      placeholder="Solicitação do Cliente"
                      className="p-3 bg-gray-300 rounded-lg font-bold resize-none h-full"
                      required
                      value={formData.orderSolicitation}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          orderSolicitation: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <FormCamp
                    identifier="dataEntrada"
                    colSpan={1}
                    name="Data de Entrada: "
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        entryDate: e.target.value,
                      }))
                    }
                  />
                  <div className="flex flex-col mt-10 col-span-1">
                    <label htmlFor="status" className="font-bold">
                      Status:
                    </label>
                    <select
                      name=""
                      id="status"
                      required
                      defaultValue=""
                      className="p-3 bg-gray-300 rounded-lg font-bold text-gray-500"
                      onChange={(e) =>
                        e.target.classList.replace("text-gray-500", "text-gray-900")
                      }
                    >
                      <option value="" disabled>
                        ex: Em Andamento
                      </option>
                      <option value="Em Aberto">Em Aberto</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className={`flex flex-col mt-10 col-span-3 row-span-2`}>
                    <label htmlFor="description" className="font-bold">
                      Solicitação:
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Descrição do Serviço"
                      className="p-3 bg-gray-300 rounded-lg font-bold resize-none h-full"
                      required
                      value={formData.serviceDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceDescription: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <FormCamp
                    identifier="dataFinalizacao"
                    colSpan={1}
                    name="Data de Finalização: "
                    type="date"
                    value={formData.finishDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        finishDate: e.target.value,
                      }))
                    }
                  />
                  <FormCamp
                    identifier="dataRetirada"
                    colSpan={1}
                    name="Data de Retirada: "
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pickupDate: e.target.value,
                      }))
                    }
                  />
                  <FormCamp
                    identifier="responsavel"
                    name="Responsável: "
                    colSpan={3}
                    rowSpan={2}
                    placeHolder="Técnico Responsável"
                    value={formData.responsible}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        responsible: e.target.value,
                      }))
                    }
                  />
                  <SaveButton onClick={handlePrintEntry} colSpan={1} label="Imprimir Entrada">
                    <FaPrint size={25}/>
                  </SaveButton>
                  <SaveButton onClick={handlePrintClosed} colSpan={1} label="Imprimir Fechamento">
                    <PiSealCheck size={25} />
                  </SaveButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
