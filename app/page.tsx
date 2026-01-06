"use client";
import Header from "@/components/HeaderInfo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const ownerId = localStorage.getItem("ownerId");

    if (!ownerId) {
      router.push("/login");
    }
  }, []);

  const user = {
    name: "Luiz Carvalho",
  };
  const date = new Date();

  const currentTime = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  function defineGreating() {
    const currentHour = date.getHours();
    if (currentHour < 12) {
      return "Bom dia";
    } else if (currentHour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  }

  return (
    <div
      className="min-h-screen min-w-screen bg-cover bg-center bg-no-repeat p-2"
      style={{ backgroundImage: "url('/background-home.svg')" }}
    >
      <Header />
      <main className="mt-65 flex flex-col bg-transparent justify-center-safe items-center align-middle text-white min-w-screen gap-12">
        <h1 className="font-bold text-6xl">
          {defineGreating()}, {user.name}!
        </h1>
        <h2 className="font-bold text-4xl">Agora são {currentTime}</h2>
        <button
          className="flex gap-3 items-center mt-20 bg-green-600 text-white px-10 py-4 rounded-md hover:bg-green-500 transition"
          onClick={() => {
            window.location.href = "whatsapp://";
          }}
        >
          <h3 className="font-bold">Responder Mensagens</h3>
          <FaWhatsapp size={30} />
        </button>
      </main>
    </div>
  );
}
