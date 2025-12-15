"use client";
import { formDataToProductForm, ProductService } from "@/api/services/productService";
import { ProductForm } from "@/api/types/dto/product/ProductForm";
import FormCamp from "@/components/FormCamp";
import SideHeader from "@/components/SideHeader";
import { useState } from "react";
import { toast } from "sonner";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(event.target as HTMLFormElement);
      const priceMasked = form.get("price") as string;
      const req: ProductForm = {
        ...formDataToProductForm(form),
        price: unmaskCurrency(priceMasked),
      };
      await ProductService.create(req);
      toast.success("Cliente cadastrado com sucesso");
      (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao cadastrar cliente");
    } finally {
      setLoading(false);
    }
  }

  function unmaskCurrency(value: string): number {
    return Number(
      value.replace(/\s/g, "").replace("R$", "").replace(/\./g, "").replace(",", "."),
    );
  }

  function maskCurrency(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");
    const number = Number(onlyNumbers) / 100;

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="flex bg-gray-300">
      <div className="fixed top-0 left-0">
        <SideHeader />
      </div>
      <main className="bg-white ml-100 mt-20 mr-30 mb-30 p-30 w-full rounded-lg">
        <form onSubmit={handleSubmit}>
          <h1 className="font-bold text-5xl text-center">Cadastro de Produto</h1>
          <div className="grid grid-cols-6 gap-4">
            <FormCamp
              identifier="name"
              name="Nome do Produto:"
              colSpan={6}
              placeHolder="ex: Memória DDR4 Kingston 16GB"
              required
            />
            <FormCamp
              identifier="price"
              name="Preço: "
              colSpan={3}
              placeHolder="ex: R$ 700,00"
              onChange={(e) => setPrice(maskCurrency(e.target.value))}
              required
            />
            <FormCamp
              identifier="stockQuantity"
              name="Quantidade em Estoque: "
              colSpan={3}
              placeHolder="ex: 1"
            />
            <div className={`flex flex-col mt-10 col-span-3 row-span-3`}>
              <label htmlFor={"description"} className="font-bold">
                Descrição:
              </label>
              <input
                type="text"
                placeholder="ex: Memória RAM Kingston Fury Beast, 16GB, 3200MHz, DDR4, CL16, Preto - KF432C16BB1/16"
                className="p-3 bg-gray-300 rounded-lg font-bold h-full"
                id={"description"}
                name={"description"}
              />
            </div>
            <FormCamp
              identifier="productCode"
              name="Código do Produto: "
              colSpan={3}
              placeHolder="ex: AA1122BCD33"
            />
            <FormCamp
              identifier="ncm"
              name="NCM: "
              colSpan={3}
              placeHolder="ex: 00000000"
            />
            <FormCamp
              identifier="cfop"
              name="CFOP: "
              colSpan={3}
              placeHolder="ex: 0000"
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
