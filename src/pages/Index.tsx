import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl">
          <h1 className="text-4xl font-bold mb-4 text-blue-700 dark:text-blue-400">
            FlowUS - Reditor de Laudos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Redija laudos de ultrassonografia com rapidez e padronização.
          </p>
          {user && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Bem-vindo(a), <strong>{user.name}</strong>
                {user.crm && <> - CRM: {user.crm}</>}
              </p>
            </div>
          )}
          <Link to="/ultrasound">
            <Button className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700">
              Iniciar Gerador de Laudos de Ultrassom
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;