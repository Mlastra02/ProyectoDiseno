import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import BusquedaInsumos from "@/components/BusquedaInsumos";
import Button from "@/components/Button";
import Main from "@/components/Main";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100 flex flex-col">
      <Header />
      <Main>
        <BusquedaInsumos />
        <Button />
      </Main>
    </div>
  );
}
