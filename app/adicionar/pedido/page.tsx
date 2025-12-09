"use client";
import DataFormCamp from "@/components/DataFormCamp";
import FormCamp from "@/components/FormCamp";
import SideHeader from "@/components/SideHeader";
import { useState } from "react";

interface productProps {
  id: number;
  name: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

interface formDataProps {
  name: string;
  orderId: number;
  address: string;
  cep: string;
  contactName: string;
  contactPhone1: string;
  contactPhone2: string;
  products: productProps[];
  totalOrderValue: number;

  orderSolicitation: string;
  entryDate: string;
  status: "Aberto" | "Em Andamento" | "Concluído" | "Cancelado";
  serviceDescription: string;
  finishDate: string;
  pickupDate: string;
  responsible: string;
}

export default function AddPedidoPage() {
  const [tab, setTab] = useState(1);
  const [newProductName, setNewProductName] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState(0);
  const [newUnitValue, setNewUnitValue] = useState(0);

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductName(e.target.value);
  };

  const handleProductQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductQuantity(Number(e.target.value));
  };

  const handleUnitValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUnitValue(Number(e.target.value));
  };

  const data: formDataProps = {
    name: "John Doe",
    orderId: 25,
    address: "123 Main St, Cityville",
    cep: "13330-000",
    contactName: "John's Assistant",
    contactPhone1: "(19) 99999-9999",
    contactPhone2: "(11) 98888-8888",
    products: [
      {
        id: 1,
        name: "Product A",
        quantity: 2,
        unitValue: 50,
        totalValue: 100,
      },
      {
        id: 2,
        name: "Product B",
        quantity: 1,
        unitValue: 320,
        totalValue: 320,
      },
    ],
    totalOrderValue: 420,

    orderSolicitation: "Notebook Acer, muito lento",
    entryDate: "2024-06-01",
    status: "Aberto",
    serviceDescription:
      "Notebook Acer, troca do HD por SSD, limpeza de vírus e reinstalação do sistema operacional.",
    finishDate: "2024-06-10",
    pickupDate: "2024-06-11",
    responsible: "Leandro",
  };

  var totalValue = 0;

  return (
    <div className="flex bg-gray-300">
      <div className="fixed top-0 left-0">
        <SideHeader />
      </div>
      <main className="flex ml-100 mt-10 mr-20 mb-10 p-30 w-full">
        <div className="flex flex-col w-full">
          <div className="self-end rounded-t-lg flex gap-2 px-4 pt-2">
            <button
              className={`px-4 py-2 rounded-t-lg ${
                tab === 1 ? "bg-white text-gray-700" : "bg-gray-400 text-gray-100"
              }`}
              onClick={() => setTab(1)}
            >
              Dados do Pedido
            </button>
            <button
              className={`px-4 py-2 rounded-t-lg ${
                tab === 2 ? "bg-white text-gray-700" : "bg-gray-400 text-gray-100"
              }`}
              onClick={() => setTab(2)}
            >
              Solicitação
            </button>
          </div>

          <div className="flex bg-white shadow-md rounded-lg p-12 mt-0">
            {tab === 1 && (
              <div className="w-full">
                <h1 className="font-bold text-center text-5xl">Cadastro de Pedido</h1>
                <h3 className="text-2xl text-center mt-20">Informações do Cliente</h3>
                <div className="grid grid-cols-4 gap-4">
                  <FormCamp
                    identifier="nome"
                    name="Nome"
                    colSpan={3}
                    placeHolder="ex: Fulano de Tal"
                    required
                  />
                  <DataFormCamp
                    identifier="id"
                    name="Id do Pedido: "
                    colSpan={1}
                    data={data.orderId}
                  />
                  <DataFormCamp
                    identifier="endereco"
                    name="Endereço: "
                    colSpan={3}
                    data={data.address}
                  />
                  <DataFormCamp
                    identifier="cep"
                    name="CEP: "
                    colSpan={1}
                    data={data.cep}
                  />
                  <DataFormCamp
                    identifier="nomeContato"
                    name="Nome do Contato: "
                    colSpan={2}
                    data={data.contactName}
                  />
                  <DataFormCamp
                    identifier="telefone1"
                    name="Telefone 1: "
                    colSpan={1}
                    data={data.contactPhone1}
                  />
                  <DataFormCamp
                    identifier="telefone2"
                    name="Telefone 2: "
                    colSpan={1}
                    data={data.contactPhone2}
                  />
                  <h3 className="mt-10 text-2xl text-gray-400">Itens do Pedido</h3>
                  <div className="overflow-hidden col-span-4">
                    <table className="w-full text-left mt-4">
                      <thead className="">
                        <tr className="bg-gray-300">
                          <th className="rounded-tl-lg p-4">Produto</th>
                          <th className="p-4">Quantidade</th>
                          <th className="p-4">Valor Unitário</th>
                          <th className="rounded-tr-lg p-4">Valor Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-100">
                            <td className="border-b border-l p-4">{product.name}</td>
                            <td className="border-b p-4">{product.quantity}</td>
                            <td className="border-b p-4">{`R$ ${product.unitValue.toFixed(2)}`}</td>
                            <td className="border-b border-r p-4">{`R$ ${product.totalValue.toFixed(2)}`}</td>
                          </tr>
                        ))}
                        <tr className="hover:bg-gray-100">
                          <td className="border-b border-l p-4">
                            <input
                              id="newProduct"
                              type="text"
                              placeholder="Insira o nome do produto"
                              className="w-full"
                            />
                          </td>
                          <td className="border-b p-4">
                            <input
                              id="newProductQuantity"
                              type="number"
                              placeholder="Insira a quantidade"
                              className="w-full"
                            />
                          </td>
                          <td className="border-b p-4">
                            <input
                              id="newUnitValue"
                              type="text"
                              placeholder="Insira o valor unitário"
                              className="w-full"
                            />
                          </td>
                          <td className="border-b border-r p-4">
                            {(totalValue = newProductQuantity * newUnitValue)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <DataFormCamp
                    identifier="valorTotalPedido"
                    name="Valor Total do Pedido: "
                    colSpan={4}
                    data={`R$${data.totalOrderValue.toFixed(2)}`}
                  />
                </div>
              </div>
            )}
            {tab === 2 && <div>Conteúdo da aba Solicitação</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
