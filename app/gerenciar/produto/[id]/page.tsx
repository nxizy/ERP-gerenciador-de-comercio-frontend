"use client";
import { ProductService } from "@/api/services/productService";
import { ProductForm } from "@/api/types/dto/product/ProductForm";
import FormCamp from "@/components/FormCamp";
import SideHeader from "@/components/SideHeader";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManageProductPage() {
  const params = useParams();
  const id = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductForm>();

  useEffect(() => {
    handleCall();
  }, []);

  function updateField(field: keyof ProductForm, value: any) {
    setProduct((prev) => ({
      ...prev!,
      [field]: value,
    }));
  }

  async function handleCall() {
    try {
      const data = await ProductService.getById(id);
      setProduct({
        ...data,
        price: data.price ?? 0,
      });
    } catch {
      toast.error("Produto não encontrado");
    }
  }

  function maskCurrency(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");
    const number = Number(onlyNumbers) / 100;

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function unmaskCurrency(value: string): number {
    return Number(
      value.replace(/\s/g, "").replace("R$", "").replace(/\./g, "").replace(",", "."),
    );
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!product) throw new Error("Produto não carregado");

      const request: ProductForm = {
        ...product,
        price: typeof product.price === "string"
          ? unmaskCurrency(product.price)
          : product.price,
      };

      await ProductService.update(id, request);
      toast.success("Produto atualizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    setLoading(true);
    try {
      await ProductService.delete(id);
      toast.success("Produto excluído com sucesso!");
      window.location.href = "/gerenciar/produto";
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao excluir produto");
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
            Atualização de Produto
          </h1>

          <div className="grid grid-cols-6 gap-4">
            <FormCamp
              identifier="name"
              name="Nome do Produto:"
              colSpan={6}
              value={product?.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />

            <FormCamp
              identifier="price"
              name="Preço:"
              colSpan={3}
              value={
                product?.price
                  ? maskCurrency(String(product.price))
                  : ""
              }
              onChange={(e) =>
                updateField("price", maskCurrency(e.target.value))
              }
              required
            />

            <FormCamp
              identifier="stockQuantity"
              name="Quantidade em Estoque:"
              colSpan={3}
              value={product?.stockQuantity?.toString() || ""}
              onChange={(e) =>
                updateField("stockQuantity", Number(e.target.value))
              }
            />

            <div className="flex flex-col mt-10 col-span-3 row-span-3">
              <label className="font-bold">Descrição:</label>
              <input
                className="p-3 bg-gray-300 rounded-lg font-bold h-full"
                value={product?.description || ""}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
              />
            </div>

            <FormCamp
              identifier="productCode"
              name="Código do Produto:"
              colSpan={3}
              value={product?.productCode || ""}
              onChange={(e) =>
                updateField("productCode", e.target.value)
              }
            />

            <FormCamp
              identifier="ncm"
              name="NCM:"
              colSpan={3}
              value={product?.ncm || ""}
              onChange={(e) => updateField("ncm", e.target.value)}
            />

            <FormCamp
              identifier="cfop"
              name="CFOP:"
              colSpan={3}
              value={product?.cfop || ""}
              onChange={(e) => updateField("cfop", e.target.value)}
            />
          </div>

          <div className="flex w-full justify-center gap-10">
            <button
              type="submit"
              disabled={loading}
              className="w-70 mt-15 bg-blue-700 px-14 py-6 rounded-lg hover:bg-blue-500"
            >
              <h3 className="text-3xl font-bold text-white">
                {loading ? "Salvando..." : "Salvar"}
              </h3>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleDelete}
              className="w-70 mt-15 bg-red-700 px-14 py-6 rounded-lg hover:bg-red-500"
            >
              <h3 className="text-3xl font-bold text-white">
                {loading ? "Excluindo..." : "Excluir"}
              </h3>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
