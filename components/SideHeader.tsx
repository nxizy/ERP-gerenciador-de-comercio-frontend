"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { FiChevronDown } from "react-icons/fi";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { PiIdentificationCard } from "react-icons/pi";
import { RiFoldersFill } from "react-icons/ri";

export default function SideHeader() {
  function DropDownIcon({ label }: { label: string }) {
    if (label === "Dashboard") return <HiMiniSquares2X2 />;
    if (label === "Clientes") return <BsPeopleFill size={30} />;
    if (label === "Pedidos") return <RiFoldersFill size={30} />;
    if (label === "Produtos") return <FaShoppingCart size={30} />;
    if (label === "Relatórios") return <FaChartLine size={30} />;
    if (label === "Responsáveis") return <PiIdentificationCard size={30} />;
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
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-white font-bold text-2xl mt-10 flex justify-left items-center gap-5 hover:bg-[#3D5AFE] cursor-pointer p-4 rounded-lg"
        >
          <DropDownIcon label={label} />
          <p>{label}</p>
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

  return (
    <header className="w-[18rem] h-dvh bg-[#2C2F3A] shadow-md flex flex-col align-middle items-center text-center p-4">
      <div className="bg-white flex justify-center items-center p-3 rounded-lg mt-10">
        <Image
          src="/icons/logo-info.svg"
          alt="Info Expert Logo"
          width={120}
          height={120}
          className="p-2"
        />
      </div>
      <div className="flex flex-col mt-15 mb-10 w-full h-full overflow-y-auto scrollbar-thin relative">
        <button
          onClick={() => (window.location.href = "/")}
          className="text-white font-bold text-2xl mt-10 flex justify-left items-center gap-5 hover:bg-[#3D5AFE] cursor-pointer p-4 rounded-lg"
        >
          <HiMiniSquares2X2 />
          <p>Dashboard</p>
        </button>
        <DropDown
          label="Clientes"
          items={[
            {
              name: "Gerenciar Clientes",
              href: "/gerenciar/cliente",
            },
            {
              name: "Adicionar Cliente",
              href: "/adicionar/cliente",
            },
          ]}
        />
        <DropDown
          label="Pedidos"
          items={[
            { name: "Gerenciar Pedidos", href: "/gerenciar/pedido" },
            {
              name: "Adicionar Pedido",
              href: "/adicionar/pedido",
            },
          ]}
        />
        <DropDown
          label="Produtos"
          items={[
            {
              name: "Gerenciar Produtos",
              href: "/gerenciar/produto",
            },
            {
              name: "Adicionar Produto",
              href: "/adicionar/produto",
            },
          ]}
        />
        <DropDown
          label="Relatórios"
          items={[
            {
              name: "Relatório Financeiro",
              href: "/relatorios/vendas",
            },
            {
              name: "Relatório de Estoque",
              href: "/relatorios/clientes",
            },
          ]}
        />
        <DropDown
          label="Responsáveis"
          items={[
            {
              name: "Gerenciar Responsáveis",
              href: "/gerenciar/responsavel",
            },
            {
              name: "Adicionar Responsável",
              href: "/adicionar/responsavel",
            },
          ]}
        />
      </div>
    </header>
  );
}
