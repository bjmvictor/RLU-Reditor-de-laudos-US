import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  generateReportWithAI,
  checkOllamaAvailability,
  getAvailableModels,
  type PatientData,
} from "@/utils/aiReportGenerator";
import { Loader2, Wand2, AlertCircle, CheckCircle2 } from "lucide-react";

interface AIReportGeneratorProps {
  examType: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  clinicalIndication?: string;
  findings: string[];
  onReportGenerated: (report: {
    technique: string;
    report: string;
    conclusion: string;
  }) => void;
}

export const AIReportGenerator: React.FC<AIReportGeneratorProps> = ({
  examType,
  patientName,
  patientAge,
  patientGender,
  clinicalIndication,
  findings,
  onReportGenerated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null);
  const [useAI, setUseAI] = useState(true);

  // Check Ollama availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await checkOllamaAvailability();
      setOllamaAvailable(available);
      setUseAI(available);
    };
    checkAvailability();
  }, []);

  const handleGenerateReport = async () => {
    if (!findings || findings.length === 0) {
      toast.error("Selecione pelo menos um achado para gerar o laudo");
      return;
    }

    setIsLoading(true);
    try {
      const patientData: PatientData = {
        name: patientName,
        age: patientAge,
        gender: patientGender,
        clinicalIndication,
        findings,
        examType,
      };

      const report = await generateReportWithAI(patientData, useAI);
      onReportGenerated(report);
      toast.success("Laudo gerado com sucesso!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Erro ao gerar laudo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-blue-600" />
          Gerar Laudo com IA Local
          {ollamaAvailable === true && (
            <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />
          )}
          {ollamaAvailable === false && (
            <AlertCircle className="ml-auto h-5 w-5 text-red-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ollamaAvailable === false && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p className="font-semibold mb-2">⚠️ Ollama não está disponível</p>
            <p className="mb-3">
              Para usar IA local, instale Ollama e inicie um modelo:
            </p>
            <ol className="ml-4 space-y-1 list-decimal text-xs">
              <li>
                Baixe Ollama em{" "}
                <a
                  href="https://ollama.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  ollama.ai
                </a>
              </li>
              <li>Instale e inicie o serviço</li>
              <li>
                Execute no terminal:{" "}
                <code className="bg-white px-2 py-1 rounded font-mono text-xs">
                  ollama pull mistral
                </code>
              </li>
              <li>
                Inicie o servidor:{" "}
                <code className="bg-white px-2 py-1 rounded font-mono text-xs">
                  ollama serve
                </code>
              </li>
              <li>Atualize esta página</li>
            </ol>
          </div>
        )}

        {ollamaAvailable === true && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <p className="font-semibold">✓ Ollama está pronto!</p>
            <p className="text-xs">
              IA local funcionando. Os laudos serão gerados sem depender de internet.
            </p>
          </div>
        )}

        {ollamaAvailable === null && (
          <p className="text-sm text-gray-600">Verificando disponibilidade de Ollama...</p>
        )}

        <div className="text-sm text-gray-600">
          <p>
            <strong>Achados selecionados:</strong> {findings.length > 0 ? findings.length : "Nenhum"}
          </p>
          {findings.length > 0 && (
            <ul className="ml-4 mt-2 list-disc space-y-1">
              {findings.slice(0, 3).map((f, i) => (
                <li key={i} className="text-xs">
                  {f}
                </li>
              ))}
              {findings.length > 3 && <li className="text-xs">+{findings.length - 3} mais</li>}
            </ul>
          )}
        </div>

        <Button
          onClick={handleGenerateReport}
          disabled={isLoading || findings.length === 0 || ollamaAvailable === false}
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando laudo...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Gerar Laudo Profissional
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
