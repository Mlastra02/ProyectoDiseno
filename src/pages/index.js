import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Main from "@/components/Main";
import ListaCompra from "@/components/ListaCompra";
import ListasRecientes from "@/components/ListasRecientes";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100 flex flex-col">
      <Header />
      <Main>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ListaCompra />
          <ListasRecientes userId={localStorage.getItem("userId")} />
        </div>
        <Button
          onClick={handleClick}
          className={"bg-red-600 hover:bg-red-700"}
        />
      </Main>
    </div>
  );
}
