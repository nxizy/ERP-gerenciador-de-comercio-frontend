"use client";
import { ProductService } from "@/api/services/productService";
import { ProductForm } from "@/api/types/dto/product/ProductForm";
import SideHeader from "@/components/SideHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { toast } from "sonner";
import { FaFilter } from "react-icons/fa6";

export default function ManageProductsPage() {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [productSuggestions, setProductSuggestions] = useState<ProductForm[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState<ProductForm[]>([]);

  const router = useRouter();

  function useDebounce(value: string, delay = 500) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
  }

  const debouncedProductName = useDebounce(productName);
  const debouncedProductId = useDebounce(productId);

  useEffect(() => {
    handleCall();
  }, []);

  useEffect(() => {
    if (debouncedProductName.trim().length < 2 || debouncedProductId.trim().length < 2) {
      setProductSuggestions([]);
      return;
    }
    const idNumber = Number(debouncedProductId);
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(debouncedProductName.toLowerCase()) ||
        (!isNaN(idNumber) && p.id === idNumber)
    );
    setProductSuggestions(filtered);
    setShowSuggestions(true);
  }, [debouncedProductName, debouncedProductId, products]);

  async function handleCall() {
    try {
      const data = await ProductService.getAll();
      setProducts(data.content);
    } catch (err: any) {
      toast.error(err.message || "Erro ao carregar clientes");
    }
  }

  function handleSelectProduct(product: ProductForm) {
    setProductName(product.name);
    setShowSuggestions(false);
    router.push(`/gerenciar/produto/${product.id}`);
  }

  function formatPrice(price?: number) {
    if (price == null) return "Sem valor definido";

    return price.toLocaleString("pt-BR", {
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
        <h1 className="text-4xl font-bold">Produtos</h1>

        <div className="relative mt-7 rounded-lg py-4 px-9 bg-gray-400 flex items-center gap-3">
          <input
            placeholder="Buscar por nome e id"
            type="text"
            className="w-full text-xl outline-none bg-transparent"
            value={productName || productId}
            onChange={(e) => {
              setProductName(e.target.value);
              setProductId(e.target.value);
            }}
            onFocus={() => {
              productName.length >= 2 && setShowSuggestions(true);
              productId.length ? setShowSuggestions(true) : null;
            }}
          />
          <FaSearch size={23} />

          {showSuggestions && productSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow rounded-md z-20">
              {productSuggestions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="rounded-t-lg mt-20 bg-gray-300">
            <div className="flex align-middle w-full justify-between py-6 px-10">
              <h3 className="font-bold text-xl">Produtos</h3>
            </div>
          </div>

          <table className="w-full overflow-hidden rounded-b-lg">
            <thead>
              <tr className="bg-gray-400 text-center">
                <th className="py-2">Id do Produto</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Quantidade em Estoque</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="bg-gray-300 border-b hover:bg-gray-400 transition cursor-pointer text-center"
                  onClick={() => router.push(`/gerenciar/produto/${p.id}`)}
                >
                  <td className="p-2">{p.id}</td>
                  <td>{p.name}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    {p.stockQuantity
                      ? `${p.stockQuantity} Un`
                      : "Sem estoque definido"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
