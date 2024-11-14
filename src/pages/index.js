import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import BusquedaInsumos from "@/components/BusquedaInsumos";
import Button from "@/components/Button";

export default function Home() {
  return (
    <>
      <Header />
      <BusquedaInsumos />
      <Button />
    </>
  );
}
