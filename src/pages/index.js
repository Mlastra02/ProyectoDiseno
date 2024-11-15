import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import BusquedaInsumos from "@/components/BusquedaInsumos";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-6">
        <BusquedaInsumos />
        <Button />
      </main>
    </div>
  );
}
