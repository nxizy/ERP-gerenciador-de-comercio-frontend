"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import {
  FaChartLine,
  FaFilePen,
  FaGear,
  FaPlus,
} from "react-icons/fa6";
import Image from "next/image";

function DropDownIcon({ label }: { label: string }) {
  if (label === "Adicionar") return <FaPlus size={30} />;
  if (label === "Gerenciar") return <FaFilePen size={30} />;
  if (label === "Relatórios") return <FaChartLine size={30} />;
  return <FiChevronDown size={30} />;
}

function DropDown({
  label,
  items,
}: {
  label: string;
  items: { name: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        <DropDownIcon label={label} />
        <p className="text-lg m:text-3xl font-bold">{label}</p>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-54 bg-white shadow-lg rounded-xl p-2 flex flex-col z-50">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <p className="text-lg">{item.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className="my-3 mx-8 bg-white border-b shadow-sm rounded-xl">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <button
          className="text-xl font-bold text-gray-800"
          onClick={() => (window.location.href = "/")}
        >
          <Image
            src="/icons/logo-info.svg"
            alt="Info Expert Logo"
            width={85}
            height={85}
          />
        </button>

        <nav className="flex items-center gap-6">
          <DropDown
            label="Adicionar"
            items={[
              { name: "Cliente", href: "/adicionar/cliente" },
              { name: "Pedido", href: "/adicionar/pedido" },
              { name: "Produto", href: "/adicionar/produto" },
              { name: "Responsável", href: "/adicionar/responsavel" },
            ]}
          />
          <DropDown
            label="Gerenciar"
            items={[
              { name: "Clientes", href: "/gerenciar/cliente" },
              { name: "Pedidos", href: "/gerenciar/pedidos" },
              { name: "Produtos", href: "/gerenciar/produto" },
              {
                name: "Responsáveis",
                href: "/gerenciar/responsaveis",
              },
            ]}
          />
          <DropDown
            label="Relatórios"
            items={[
              { name: "Financeiro", href: "/relatorios/financeiro" },
              { name: "Estoque", href: "/relatorios/estoque" },
            ]}
          />
          <button className="hover:bg-gray-100 transition rounded-3xl p-2 font-bold">
            <FaGear size={30} />
          </button>
        </nav>
      </div>
    </header>
  );
}
