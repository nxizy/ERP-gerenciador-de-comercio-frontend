"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OwnerService } from "@/api/services/ownerService";
import Image from "next/image";
import FormCamp from "@/components/FormCamp";

export default function LoginPage() {
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    try {
      const owner = await OwnerService.login({
        document: document.replace(/\D/g, ""),
        password,
      });

      localStorage.setItem("ownerId", String(owner.id));

      router.push("/");
    } catch (err: any) {
      toast.error("Documento ou senha inválidos");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-300">
      <div className="flex-row w-150 bg-white p-6 rounded">
        <h1 className="mt-4 text-5xl font-bold mb-4 text-center">Login</h1>
        <div className="mb-10">
          <FormCamp
            identifier="document"
            name="Documento: "
            placeHolder="Insira seu documento"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
          />
        </div>
        <div className="mb-10">
          <FormCamp
            identifier="password"
            name="Senha: "
            placeHolder="Insira sua senha"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white font-bold text-1xl py-3 px-1.5 rounded hover:bg-gray-700 cursor-pointer"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
