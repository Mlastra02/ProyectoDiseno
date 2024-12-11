import Buscador from "@/components/Buscador";
import Header from "@/components/Header";
import Main from "@/components/Main";

export default function BusquedaInsumos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-green-100 flex flex-col">
      <Header />
      <Main>
        <Buscador />
      </Main>
    </div>
  );
}
