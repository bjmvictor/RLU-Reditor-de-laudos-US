import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ThemeToggle } from "@/components/ThemeToggle"; // Import ThemeToggle
import { saveReport } from "@/utils/storage";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface FindingDefinition {
  id: string;
  label: string;
  requiresSize?: boolean;
  hasLaterality?: boolean; // New: indicates if laterality (left/right/both) is needed
  hasQuantity?: boolean; // New: indicates if quantity is needed
  alteredText: string; // Text to use if this finding is checked
  conclusionText?: string; // Specific text for conclusion if this finding is present
}

interface ExamCategory {
  name: string;
  defaultNormalText: string; // Text to use if no findings are checked for this category
  findings: FindingDefinition[];
}

const examDefinitions: { [key: string]: ExamCategory[] } = {
  "Ultrassom Abdominal Total": [
    {
      name: "Fígado",
      defaultNormalText: "Fígado com dimensões e ecotextura normais.",
      findings: [
        { id: "figadoNormal", label: "Normal", alteredText: "Fígado com dimensões e ecotextura normais.", conclusionText: "Fígado sem alterações." },
        { id: "esteatoseHepatica", label: "Esteatose hepática", alteredText: "Presença de esteatose hepática.", conclusionText: "Esteatose hepática." },
        { id: "noduloHepatico", label: "Nódulo hepático", requiresSize: true, hasQuantity: true, alteredText: "Presença de nódulo hepático.", conclusionText: "Nódulo hepático." },
      ],
    },
    {
      name: "Vesícula Biliar",
      defaultNormalText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
      findings: [
        { id: "vesiculaNormal", label: "Normal", alteredText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.", conclusionText: "Vesícula biliar sem alterações." },
        { id: "calculosVesicula", label: "Cálculos na vesícula biliar", requiresSize: true, hasQuantity: true, alteredText: "Presença de cálculos na vesícula biliar.", conclusionText: "Colelitíase." },
      ],
    },
    {
      name: "Rins",
      defaultNormalText: "Rins com dimensões, contornos e ecotextura normais, sem dilatação do sistema coletor ou cálculos.",
      findings: [
        { id: "rinsNormal", label: "Normal", alteredText: "Rins com dimensões, contornos e ecotextura normais, sem dilatação do sistema coletor ou cálculos.", conclusionText: "Rins sem alterações." },
        { id: "cistoRenal", label: "Cisto renal", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de cisto renal.", conclusionText: "Cisto renal." },
        { id: "calculoRenal", label: "Cálculo renal", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de cálculo renal.", conclusionText: "Nefrolitíase." },
      ],
    },
    {
      name: "Pâncreas",
      defaultNormalText: "Pâncreas com dimensões e ecotextura normais.",
      findings: [
        { id: "pancreasNormal", label: "Normal", alteredText: "Pâncreas com dimensões e ecotextura normais.", conclusionText: "Pâncreas sem alterações." },
        { id: "cistoPancreatico", label: "Cisto pancreático", requiresSize: true, hasQuantity: true, alteredText: "Presença de cisto pancreático.", conclusionText: "Cisto pancreático." },
        { id: "noduloPancreatico", label: "Nódulo pancreático", requiresSize: true, hasQuantity: true, alteredText: "Presença de nódulo pancreático.", conclusionText: "Nódulo pancreático." },
      ],
    },
    {
      name: "Baço",
      defaultNormalText: "Baço com dimensões e ecotextura normais.",
      findings: [
        { id: "bacoNormal", label: "Normal", alteredText: "Baço com dimensões e ecotextura normais.", conclusionText: "Baço sem alterações." },
        { id: "esplenomegalia", label: "Esplenomegalia", alteredText: "Presença de esplenomegalia.", conclusionText: "Esplenomegalia." },
        { id: "noduloBaco", label: "Nódulo esplênico", requiresSize: true, hasQuantity: true, alteredText: "Presença de nódulo esplênico.", conclusionText: "Nódulo esplênico." },
      ],
    },
    {
      name: "Líquido Livre",
      defaultNormalText: "Ausência de líquido livre na cavidade.",
      findings: [
        { id: "liquidoLivreNormal", label: "Ausência de líquido livre", alteredText: "Ausência de líquido livre na cavidade.", conclusionText: "Ausência de líquido livre." },
        { id: "liquidoLivreCavidade", label: "Líquido livre na cavidade", alteredText: "Presença de líquido livre na cavidade.", conclusionText: "Líquido livre na cavidade." },
      ],
    },
  ],
  "Ultrassom de Tireoide": [
    {
      name: "Tireoide",
      defaultNormalText: "Tireoide com dimensões e ecotextura normais.",
      findings: [
        { id: "tireoideNormal", label: "Normal", alteredText: "Tireoide com dimensões e ecotextura normais.", conclusionText: "Tireoide sem alterações." },
        { id: "noduloTireoidiano", label: "Nódulo tireoidiano", requiresSize: true, hasQuantity: true, hasLaterality: true, alteredText: "Presença de nódulo tireoidiano.", conclusionText: "Nódulo tireoidiano." },
        { id: "cistoTireoidiano", label: "Cisto tireoidiano", requiresSize: true, hasQuantity: true, hasLaterality: true, alteredText: "Presença de cisto tireoidiano.", conclusionText: "Cisto tireoidiano." },
        { id: "tireoidite", label: "Sinais de tireoidite", alteredText: "Sinais ultrassonográficos de tireoidite.", conclusionText: "Sinais de tireoidite." },
      ],
    },
  ],
  "Ultrassom Pélvico": [
    {
      name: "Útero",
      defaultNormalText: "Útero em anteversoflexão, com dimensões e ecotextura normais.",
      findings: [
        { id: "uteroNormal", label: "Normal", alteredText: "Útero em anteversoflexão, com dimensões e ecotextura normais.", conclusionText: "Útero sem alterações." },
        { id: "miomaUterino", label: "Mioma uterino", requiresSize: true, hasQuantity: true, alteredText: "Presença de mioma uterino.", conclusionText: "Mioma uterino." },
      ],
    },
    {
      name: "Ovários",
      defaultNormalText: "Ovários com dimensões e ecotextura normais, sem formações císticas ou sólidas.",
      findings: [
        { id: "ovariosNormal", label: "Normal", alteredText: "Ovários com dimensões e ecotextura normais, sem formações císticas ou sólidas.", conclusionText: "Ovários sem alterações." },
        { id: "cistoOvariano", label: "Cisto ovariano", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de cisto ovariano.", conclusionText: "Cisto ovariano." },
      ],
    },
    {
      name: "Endométrio",
      defaultNormalText: "Endométrio com espessura normal para a fase do ciclo.",
      findings: [
        { id: "endometrioNormal", label: "Normal", alteredText: "Endométrio com espessura normal para a fase do ciclo.", conclusionText: "Endométrio sem alterações." },
        { id: "endometrioAlterado", label: "Endométrio com espessura alterada ou irregularidades", alteredText: "Endométrio com espessura alterada ou irregularidades.", conclusionText: "Alteração endometrial." },
      ],
    },
    {
      name: "Líquido Livre na Pelve",
      defaultNormalText: "Ausência de líquido livre na pelve.",
      findings: [
        { id: "liquidoLivrePelveNormal", label: "Ausência de líquido livre", alteredText: "Ausência de líquido livre na pelve.", conclusionText: "Ausência de líquido livre na pelve." },
        { id: "liquidoLivrePelvico", label: "Líquido livre na pelve", alteredText: "Presença de líquido livre na pelve.", conclusionText: "Líquido livre na pelve." },
      ],
    },
  ],
  "Ultrassom de Mamas": [
    {
      name: "Mamas",
      defaultNormalText: "Mamas com ecotextura glandular e adiposa normal.",
      findings: [
        { id: "mamasNormal", label: "Normal", alteredText: "Mamas com ecotextura glandular e adiposa normal.", conclusionText: "Mamas sem alterações." },
        { id: "noduloMama", label: "Nódulo mamário", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de nódulo mamário.", conclusionText: "Nódulo mamário." },
        { id: "cistoMama", label: "Cisto mamário", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de cisto mamário.", conclusionText: "Cisto mamário." },
        { id: "dilatacaoDuctal", label: "Dilatação ductal", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de dilatação ductal.", conclusionText: "Dilatação ductal." },
      ],
    },
  ],
  "Ultrassom de Abdome Superior": [
    {
      name: "Fígado",
      defaultNormalText: "Fígado com dimensões e ecotextura normais.",
      findings: [
        { id: "abdSupFigadoNormal", label: "Normal", alteredText: "Fígado com dimensões e ecotextura normais.", conclusionText: "Fígado sem alterações." },
        { id: "abdSupEsteatoseHepatica", label: "Esteatose hepática", alteredText: "Presença de esteatose hepática.", conclusionText: "Esteatose hepática." },
        { id: "abdSupNoduloHepatico", label: "Nódulo hepático", requiresSize: true, hasQuantity: true, alteredText: "Presença de nódulo hepático.", conclusionText: "Nódulo hepático." },
      ],
    },
    {
      name: "Vesícula Biliar",
      defaultNormalText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
      findings: [
        { id: "abdSupVesiculaNormal", label: "Normal", alteredText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.", conclusionText: "Vesícula biliar sem alterações." },
        { id: "abdSupCalculosVesicula", label: "Cálculos na vesícula biliar", requiresSize: true, hasQuantity: true, alteredText: "Presença de cálculos na vesícula biliar.", conclusionText: "Colelitíase." },
      ],
    },
    {
      name: "Pâncreas",
      defaultNormalText: "Pâncreas com dimensões e ecotextura normais.",
      findings: [
        { id: "abdSupPancreasNormal", label: "Normal", alteredText: "Pâncreas com dimensões e ecotextura normais.", conclusionText: "Pâncreas sem alterações." },
        { id: "abdSupCistoPancreatico", label: "Cisto pancreático", requiresSize: true, hasQuantity: true, alteredText: "Presença de cisto pancreático.", conclusionText: "Cisto pancreático." },
        { id: "abdSupNoduloPancreatico", label: "Nódulo pancreático", requiresSize: true, hasQuantity: true, alteredText: "Presença de nódulo pancreático.", conclusionText: "Nódulo pancreático." },
      ],
    },
    {
      name: "Baço",
      defaultNormalText: "Baço com dimensões e ecotextura normais.",
      findings: [
        { id: "abdSupBacoNormal", label: "Normal", alteredText: "Baço com dimensões e ecotextura normais.", conclusionText: "Baço sem alterações." },
        { id: "abdSupEsplenomegalia", label: "Esplenomegalia", alteredText: "Presença de esplenomegalia.", conclusionText: "Esplenomegalia." },
        { id: "abdSupNoduloBaco", label: "Nódulo esplênico", requiresSize: true, hasQuantity: true, alteredText: "Presença de nódulo esplênico.", conclusionText: "Nódulo esplênico." },
      ],
    },
  ],
  "Ultrassom de Vias Urinárias": [
    {
      name: "Rins",
      defaultNormalText: "Rins com dimensões, contornos e ecotextura normais, sem dilatação do sistema coletor ou cálculos.",
      findings: [
        { id: "viasUrinariasRinsNormal", label: "Normal", alteredText: "Rins com dimensões e ecotextura normais, sem dilatação do sistema coletor ou cálculos.", conclusionText: "Rins sem alterações." },
        { id: "viasUrinariasCistoRenal", label: "Cisto renal", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de cisto renal.", conclusionText: "Cisto renal." },
        { id: "viasUrinariasCalculoRenal", label: "Cálculo renal", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de cálculo renal.", conclusionText: "Nefrolitíase." },
        { id: "viasUrinariasHidronefrose", label: "Hidronefrose", hasLaterality: true, alteredText: "Presença de hidronefrose.", conclusionText: "Hidronefrose." },
      ],
    },
    {
      name: "Bexiga",
      defaultNormalText: "Bexiga com paredes finas e conteúdo anecóico, sem alterações.",
      findings: [
        { id: "bexigaNormal", label: "Normal", alteredText: "Bexiga com paredes finas e conteúdo anecóico, sem alterações.", conclusionText: "Bexiga sem alterações." },
        { id: "calculoBexiga", label: "Cálculo na bexiga", requiresSize: true, hasQuantity: true, alteredText: "Presença de cálculo na bexiga.", conclusionText: "Cálculo vesical." },
        { id: "espessamentoBexiga", label: "Espessamento parietal da bexiga", alteredText: "Espessamento parietal da bexiga.", conclusionText: "Espessamento vesical." },
      ],
    },
  ],
  "Ultrassom de Bolsa Escrotal": [
    {
      name: "Testículos",
      defaultNormalText: "Testículos com dimensões e ecotextura homogêneas, sem lesões focais.",
      findings: [
        { id: "testiculosNormal", label: "Normal", alteredText: "Testículos com dimensões e ecotextura homogêneas, sem lesões focais.", conclusionText: "Testículos sem alterações." },
        { id: "cistoEpididimo", label: "Cisto de epidídimo", requiresSize: true, hasLaterality: true, hasQuantity: true, alteredText: "Presença de cisto de epidídimo.", conclusionText: "Cisto de epidídimo." },
        { id: "hidrocele", label: "Hidrocele", hasLaterality: true, alteredText: "Presença de hidrocele.", conclusionText: "Hidrocele." },
        { id: "varicocele", label: "Varicocele", hasLaterality: true, alteredText: "Presença de varicocele.", conclusionText: "Varicocele." },
      ],
    },
    {
      name: "Epidídimos",
      defaultNormalText: "Epidídimos com dimensões e ecotextura normais.",
      findings: [
        { id: "epididimosNormal", label: "Normal", alteredText: "Epidídimos com dimensões e ecotextura normais.", conclusionText: "Epidídimos sem alterações." },
        { id: "epididimite", label: "Epididimite", hasLaterality: true, alteredText: "Sinais de epididimite.", conclusionText: "Epididimite." },
      ],
    },
  ],
};

const conclusionGuidance: { [key: string]: string } = {
  "Esteatose hepática.": "Recomenda-se acompanhamento clínico e controle de fatores de risco.",
  "Nódulo hepático.": "Sugere-se investigação complementar com exames de imagem de segunda linha (TC ou RM) e/ou avaliação por especialista.",
  "Colelitíase.": "Recomenda-se avaliação cirúrgica para colecistectomia, se sintomático.",
  "Cisto renal.": "Geralmente benigno, sem necessidade de acompanhamento, salvo se complexo ou sintomático.",
  "Nefrolitíase.": "Sugere-se avaliação urológica para conduta adequada.",
  "Líquido livre na cavidade.": "Recomenda-se investigação da causa do líquido livre.",
  "Nódulo tireoidiano.": "Sugere-se avaliação endocrinológica e, se necessário, punção aspirativa por agulha fina (PAAF).",
  "Cisto tireoidiano.": "Geralmente benigno, acompanhamento conforme critério clínico.",
  "Sinais de tireoidite.": "Recomenda-se correlação com exames laboratoriais e avaliação endocrinológica.",
  "Mioma uterino.": "Acompanhamento ginecológico. Conduta dependerá do tamanho, sintomas e desejo gestacional.",
  "Cisto ovariano.": "Acompanhamento ginecológico. A maioria é funcional e regride espontaneamente.",
  "Alteração endometrial.": "Recomenda-se avaliação ginecológica para investigação complementar.",
  "Líquido livre na pelve.": "Recomenda-se investigação da causa do líquido livre.",
  "Nódulo mamário.": "Recomenda-se avaliação com mastologista e, se necessário, biópsia.",
  "Cisto mamário.": "Geralmente benigno, acompanhamento conforme critério clínico.",
  "Dilatação ductal.": "Recomenda-se avaliação com mastologista para investigação da causa.",
  "Hidronefrose.": "Recomenda-se avaliação urológica para investigação da causa e conduta.",
  "Cálculo vesical.": "Sugere-se avaliação urológica para conduta adequada.",
  "Espessamento vesical.": "Recomenda-se investigação complementar para determinar a causa do espessamento.",
  "Cisto de epidídimo.": "Geralmente benigno, acompanhamento conforme critério clínico.",
  "Hidrocele.": "Acompanhamento clínico. Em casos sintomáticos, avaliação cirúrgica pode ser considerada.",
  "Varicocele.": "Acompanhamento clínico. Em casos de dor ou infertilidade, avaliação urológica é indicada.",
  "Epididimite.": "Recomenda-se avaliação urológica para tratamento adequado.",
  "Exame sem alterações significativas.": "Não há necessidade de condutas adicionais baseadas neste exame."
};

// Define a interface para o estado de cada achado
interface FindingState {
  isChecked: boolean;
  size: string; // Para achados de instância única
  laterality: string; // Para achados de instância única
  quantity: string; // Para achados com quantidade (como string do input)
  instances: Array<{ size: string; laterality: string }>; // Array de instâncias para achados com quantidade
}

const UltrasoundReportGenerator = () => {
  const [doctorName, setDoctorName] = useState("");
  const [doctorCRM, setDoctorCRM] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [patientGender, setPatientGender] = useState<string>("");
  const [examType, setExamType] = useState<string>("");
  const [generatedReport, setGeneratedReport] = useState("");
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // State para armazenar a seleção e detalhes dos achados
  const [currentFindingsState, setCurrentFindingsState] = useState<
    Map<string, FindingState>
  >(new Map());

  // Resetar o estado dos achados quando o tipo de exame muda
  useEffect(() => {
    setCurrentFindingsState(new Map());
  }, [examType]);

  // Helper para encontrar a definição de um achado pelo ID
  const findFindingDefinitionById = (id: string): FindingDefinition | undefined => {
    for (const examTypeKey in examDefinitions) {
      for (const category of examDefinitions[examTypeKey]) {
        const finding = category.findings.find(f => f.id === id);
        if (finding) return finding;
      }
    }
    return undefined;
  };

  // Helper para encontrar a categoria à qual um ID de achado pertence no exame atual
  const findCategoryForCurrentExam = (findingId: string): ExamCategory | undefined => {
    const currentExamCategories = examDefinitions[examType] || [];
    for (const category of currentExamCategories) {
      if (category.findings.some(f => f.id === findingId)) {
        return category;
      }
    }
    return undefined;
  };

  // Handler para mudança do checkbox principal de um achado
  const handleCheckboxChange = (findingId: string, checked: boolean) => {
    setCurrentFindingsState((prev) => {
      const newState = new Map(prev);
      const category = findCategoryForCurrentExam(findingId);
      const currentFindingDef = findFindingDefinitionById(findingId);

      if (!category || !currentFindingDef) {
        newState.set(findingId, {
          ...prev.get(findingId)!,
          isChecked: checked,
        });
        return newState;
      }

      const normalFindingId = category.findings[0]?.id; // Assumindo que 'Normal' é sempre o primeiro achado

      if (checked) {
        if (findingId === normalFindingId) {
          // Se 'Normal' for marcado, desmarcar todos os outros achados nesta categoria
          category.findings.forEach(f => {
            if (f.id !== normalFindingId) {
              newState.set(f.id, { isChecked: false, size: "", laterality: "", quantity: "", instances: [] });
            }
          });
        } else {
          // Se um achado não-normal for marcado, desmarcar 'Normal' nesta categoria
          if (normalFindingId && newState.get(normalFindingId)?.isChecked) {
            newState.set(normalFindingId, { isChecked: false, size: "", laterality: "", quantity: "", instances: [] });
          }
        }
      }

      // Inicializar ou atualizar o estado do achado
      const existingState = newState.get(findingId) || { isChecked: false, size: "", laterality: "", quantity: "", instances: [] };
      newState.set(findingId, {
        ...existingState,
        isChecked: checked,
        // Resetar detalhes se desmarcado
        ...(checked ? {} : { size: "", laterality: "", quantity: "", instances: [] }),
      });

      // Se for um novo check para um achado baseado em quantidade, inicializar com uma instância
      if (checked && currentFindingDef.hasQuantity && (!existingState.instances || existingState.instances.length === 0)) {
        newState.get(findingId)!.instances = [{ size: "", laterality: "" }];
        newState.get(findingId)!.quantity = "1"; // Quantidade padrão para 1
      }

      return newState;
    });
  };

  // Handler para mudança na quantidade de um achado
  const handleQuantityChange = (findingId: string, newQuantityStr: string) => {
    setCurrentFindingsState((prev) => {
      const newState = new Map(prev);
      const state = newState.get(findingId);
      if (!state) return prev;

      const newQuantity = parseInt(newQuantityStr, 10);
      const currentInstances = state.instances || [];
      let updatedInstances = [...currentInstances];

      if (isNaN(newQuantity) || newQuantity <= 0) {
        // Se a quantidade for inválida ou 0, limpar instâncias e definir a string da quantidade para "0" ou ""
        updatedInstances = [];
        newState.set(findingId, {
          ...state,
          quantity: newQuantityStr === "" ? "" : "0",
          instances: updatedInstances,
        });
        return newState;
      } else if (newQuantity > currentInstances.length) {
        // Adicionar novas instâncias
        for (let i = currentInstances.length; i < newQuantity; i++) {
          updatedInstances.push({ size: "", laterality: "" });
        }
      } else if (newQuantity < currentInstances.length) {
        // Remover instâncias
        updatedInstances = updatedInstances.slice(0, newQuantity);
      }

      newState.set(findingId, {
        ...state,
        quantity: newQuantityStr,
        instances: updatedInstances,
      });
      return newState;
    });
  };

  // Handler para mudança nos detalhes (tamanho/lateralidade) de uma instância específica
  const handleInstanceDetailChange = (
    findingId: string,
    instanceIndex: number,
    field: 'size' | 'laterality',
    value: string,
  ) => {
    setCurrentFindingsState((prev) => {
      const newState = new Map(prev);
      const state = newState.get(findingId);
      if (!state || !state.instances) return prev;

      const updatedInstances = state.instances.map((instance, idx) =>
        idx === instanceIndex ? { ...instance, [field]: value } : instance
      );

      newState.set(findingId, {
        ...state,
        instances: updatedInstances,
      });
      return newState;
    });
  };

  // Handler para mudança nos detalhes (tamanho/lateralidade) de um achado de instância única
  const handleSingleDetailChange = (
    findingId: string,
    field: 'size' | 'laterality',
    value: string,
  ) => {
    setCurrentFindingsState((prev) => {
      const newState = new Map(prev);
      const state = newState.get(findingId);
      if (!state) return prev;

      newState.set(findingId, {
        ...state,
        [field]: value,
      });
      return newState;
    });
  };

  const handleGenerateReport = () => {
    let reportText = `LAUDO DE ULTRASSOM\n\n`;

    reportText += `MÉDICO RESPONSÁVEL:\n`;
    reportText += `NOME: ${(doctorName || "[NOME DO MÉDICO]").toUpperCase()}\n`;
    reportText += `CRM: ${doctorCRM || "[CRM DO MÉDICO]"}\n\n`;

    reportText += `DADOS DO PACIENTE:\n`;
    reportText += `NOME: ${(patientName || "[NOME DO PACIENTE]").toUpperCase()}\n`;
    reportText += `DATA DE NASCIMENTO: ${patientDOB || "[DD/MM/AAAA]"}\n`;
    reportText += `GÊNERO: ${patientGender || "[GÊNERO]"}\n\n`;

    reportText += `EXAME:\n`;
    reportText += `TIPO DE EXAME: ${examType || "[TIPO DE EXAME]"}\n\n`;

    reportText += `ACHADOS:\n`;
    const findingsStatements: string[] = [];
    const conclusionStatements: string[] = [];
    const uniqueConclusionTexts = new Set<string>(); // Para evitar textos de conclusão duplicados

    const currentExamCategories = examDefinitions[examType] || [];

    currentExamCategories.forEach((category) => {
      let categoryHasAlteredFinding = false;
      let categoryHasNormalFindingChecked = false;

      category.findings.forEach((finding) => {
        const state = currentFindingsState.get(finding.id);
        if (state?.isChecked) {
          if (finding.id === category.findings[0]?.id) { // Verifica se é a opção 'Normal'
            categoryHasNormalFindingChecked = true;
          } else {
            categoryHasAlteredFinding = true;
            if (finding.hasQuantity && state.instances && state.instances.length > 0) {
              state.instances.forEach((instance) => {
                let statement = finding.alteredText;
                let instanceDetails = [];
                if (instance.laterality) {
                  instanceDetails.push(instance.laterality);
                }
                if (finding.requiresSize && instance.size) {
                  instanceDetails.push(`Tamanho: ${instance.size} mm`);
                }
                if (instanceDetails.length > 0) {
                  statement += ` (${instanceDetails.join(", ")})`;
                }
                findingsStatements.push(statement);
              });
            } else { // Achado de instância única
              let statement = finding.alteredText;
              if (state.laterality) {
                statement += ` (${state.laterality})`;
              }
              if (finding.requiresSize && state.size) {
                statement += ` (Tamanho: ${state.size} mm)`;
              }
              findingsStatements.push(statement);
            }
            if (finding.conclusionText) {
              uniqueConclusionTexts.add(finding.conclusionText);
            }
          }
        }
      });

      // Se nenhum achado alterado foi marcado, e 'Normal' foi marcado, adicionar o texto normal padrão
      if (!categoryHasAlteredFinding && categoryHasNormalFindingChecked) {
        findingsStatements.push(category.defaultNormalText);
        uniqueConclusionTexts.add(category.findings[0]?.conclusionText || "Exame sem alterações significativas.");
      }
    });

    if (findingsStatements.length === 0) {
      reportText += "Não foram descritos achados específicos.\n\n";
      uniqueConclusionTexts.add("Exame sem alterações significativas.");
    } else {
      reportText += findingsStatements.map((s) => `- ${s}`).join("\n") + "\n\n";
    }

    reportText += `CONCLUSÃO:\n`;
    if (uniqueConclusionTexts.size === 0) {
      reportText += "Exame sem alterações significativas.\n";
      uniqueConclusionTexts.add("Exame sem alterações significativas.");
    } else {
      uniqueConclusionTexts.forEach((s) => conclusionStatements.push(s));
      reportText += conclusionStatements.map((s) => `- ${s}`).join("\n") + "\n";
    }

    // Adicionar orientações com base nas conclusões
    if (conclusionStatements.length > 0) {
      reportText += `\nORIENTAÇÕES:\n`;
      const uniqueGuidance = new Set<string>();
      conclusionStatements.forEach(concText => {
        if (conclusionGuidance[concText]) {
          uniqueGuidance.add(conclusionGuidance[concText]);
        }
      });
      if (uniqueGuidance.size > 0) {
        reportText += Array.from(uniqueGuidance).map(g => `- ${g}`).join("\n") + "\n";
      } else {
        reportText += `- ${conclusionGuidance["Exame sem alterações significativas."]}\n`;
      }
    }


    setGeneratedReport(reportText);
  };

  const handleSaveReport = () => {
    if (!generatedReport.trim()) {
      toast.error("Gere o laudo antes de salvar.");
      return;
    }
    try {
      setSaving(true);
      const metaTitle = `${patientName || "Paciente"} - ${examType || "Ultrassom"}`;
      const item = saveReport(generatedReport, metaTitle);
      toast.success("Laudo salvo com sucesso!", { description: item.title });
    } catch (e) {
      toast.error("Falha ao salvar o laudo.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedReport.trim()) {
      toast.error("Gere o laudo antes de baixar em PDF.");
      return;
    }
    setDownloading(true);
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
      doc.setFont("courier", "normal");
      doc.setFontSize(11);

      const lines = doc.splitTextToSize(generatedReport, maxWidth);
      let y = margin;
      const lineHeight = 14;
      const pageHeight = doc.internal.pageSize.getHeight();

      lines.forEach((line: string) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      const filename = `Laudo-${(patientName || "Paciente").replace(/\s+/g, "_")}-${new Date().toISOString().slice(0,10)}.pdf`;
      doc.save(filename);
      toast.success("PDF gerado com sucesso!");
    } catch (e) {
      toast.error("Falha ao gerar PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const currentExamCategories = examDefinitions[examType] || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-grow">FlowUS - Reditor de Laudos</h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Dados do Médico */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Médico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="doctorName">Nome do Médico</Label>
              <Input
                id="doctorName"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value.toUpperCase())}
                placeholder="Dr. JOÃO SILVA"
              />
            </div>
            <div>
              <Label htmlFor="doctorCRM">CRM</Label>
              <Input
                id="doctorCRM"
                value={doctorCRM}
                onChange={(e) => setDoctorCRM(e.target.value)}
                placeholder="12345-SP"
              />
            </div>
          </CardContent>
        </Card>

        {/* Dados do Paciente */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Paciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="patientName">Nome do Paciente</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value.toUpperCase())}
                placeholder="MARIA OLIVEIRA"
              />
            </div>
            <div>
              <Label htmlFor="patientDOB">Data de Nascimento</Label>
              <Input
                id="patientDOB"
                type="date"
                value={patientDOB}
                onChange={(e) => setPatientDOB(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="patientGender">Gênero</Label>
              <Select value={patientGender} onValueChange={setPatientGender}>
                <SelectTrigger id="patientGender">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes do Exame */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Detalhes do Exame</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="examType">Tipo de Exame</Label>
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger id="examType">
                <SelectValue placeholder="Selecione o tipo de exame" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(examDefinitions).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {examType && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mt-4">Achados do Exame</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Layout flexível para categorias */}
                {currentExamCategories.map((category) => {
                  const normalFindingId = category.findings[0]?.id; // Assumindo que 'Normal' é sempre o primeiro achado
                  const isNormalChecked = currentFindingsState.get(normalFindingId)?.isChecked;
                  const hasOtherFindingsChecked = category.findings.some(f => f.id !== normalFindingId && currentFindingsState.get(f.id)?.isChecked);

                  return (
                    <div key={category.name} className="space-y-2 border p-3 rounded-md">
                      <p className="font-medium">{category.name}:</p>
                      {category.findings.length > 0 ? (
                        category.findings.map((finding) => {
                          const state = currentFindingsState.get(finding.id);
                          const isChecked = state?.isChecked || false;
                          const size = state?.size || "";
                          const laterality = state?.laterality || "";
                          const quantity = state?.quantity || "";
                          const instances = state?.instances || [];

                          // Apenas mostrar 'Normal' se nenhum outro achado estiver marcado, ou se ele estiver marcado
                          if (finding.id === normalFindingId && hasOtherFindingsChecked && !isChecked) {
                            return null;
                          }

                          return (
                            <div key={finding.id} className="flex flex-col gap-2 ml-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={finding.id}
                                  checked={isChecked}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(finding.id, checked as boolean)
                                  }
                                />
                                <Label htmlFor={finding.id} className="flex-1">
                                  {finding.label}
                                </Label>
                                {isChecked && finding.hasQuantity && (
                                  <Input
                                    type="number"
                                    placeholder="Qtd."
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(finding.id, e.target.value)}
                                    className="w-20"
                                    min="1"
                                  />
                                )}
                              </div>
                              {isChecked && (
                                <>
                                  {finding.hasQuantity ? (
                                    <div className="flex flex-col gap-2 pl-6"> {/* Indent instances */}
                                      {instances.map((instance, idx) => (
                                        <div key={idx} className="flex flex-wrap items-center gap-2">
                                          <span className="text-sm text-gray-600">Item {idx + 1}:</span>
                                          {finding.hasLaterality && (
                                            <Select
                                              value={instance.laterality}
                                              onValueChange={(value) =>
                                                handleInstanceDetailChange(finding.id, idx, 'laterality', value)
                                              }
                                            >
                                              <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Lado" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Direito">Direito</SelectItem>
                                                <SelectItem value="Esquerdo">Esquerdo</SelectItem>
                                                <SelectItem value="Ambos">Ambos</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                          {finding.requiresSize && (
                                            <Input
                                              type="text"
                                              placeholder="Tamanho (mm)"
                                              value={instance.size}
                                              onChange={(e) =>
                                                handleInstanceDetailChange(finding.id, idx, 'size', e.target.value)
                                              }
                                              className="w-32"
                                            />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    // Lógica existente para achados de instância única
                                    <div className="flex flex-wrap items-center gap-2 pl-6"> {/* Indent single instance details */}
                                      {finding.hasLaterality && (
                                        <Select
                                          value={laterality}
                                          onValueChange={(value) =>
                                            handleSingleDetailChange(finding.id, 'laterality', value)
                                          }
                                        >
                                          <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Lado" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Direito">Direito</SelectItem>
                                            <SelectItem value="Esquerdo">Esquerdo</SelectItem>
                                            <SelectItem value="Ambos">Ambos</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      )}
                                      {finding.requiresSize && (
                                        <Input
                                          type="text"
                                          placeholder="Tamanho (mm)"
                                          value={size}
                                          onChange={(e) =>
                                            handleSingleDetailChange(finding.id, 'size', e.target.value)
                                          }
                                          className="w-32"
                                        />
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500 ml-2">Nenhum achado específico para esta categoria.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button onClick={handleGenerateReport} className="w-full">
            Gerar Laudo
          </Button>
        </CardContent>
      </Card>

      {/* Visualização e Edição do Laudo */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Laudo Gerado</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={generatedReport}
            onChange={(e) => setGeneratedReport(e.target.value)}
            placeholder="O laudo gerado aparecerá aqui e poderá ser editado."
            rows={20}
            className="font-mono"
          />
          <div className="mt-4 space-x-2">
            <Button onClick={handleSaveReport} disabled={saving}>{saving ? "Salvando..." : "Salvar Laudo"}</Button>
            <Button onClick={handleDownloadPDF} disabled={downloading}>{downloading ? "Gerando..." : "Baixar PDF"}</Button>
          </div>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default UltrasoundReportGenerator;