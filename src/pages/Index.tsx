import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Seu Aplicativo Dyad</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Comece a construir seu incrível projeto aqui!
        </p>
        <div className="flex flex-col space-y-4">
          <Link to="/ultrasound">
            <Button className="px-8 py-4 text-lg w-full">
              Iniciar Gerador de Laudos de Ultrassom
            </Button>
          </Link>
          <Link to="/history">
            <Button variant="secondary" className="px-8 py-4 text-lg w-full">
              Ver Histórico de Laudos
            </Button>
          </Link>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;