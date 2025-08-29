import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MadeWithDyad } from "@/components/made-with-dyad";

interface FindingDefinition {
  id: string;
  label: string;
  requiresSize?: boolean;
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
        { id: "noduloHepatico", label: "Nódulo hepático", requiresSize: true, alteredText: "Presença de nódulo hepático.", conclusionText: "Nódulo hepático." },
      ],
    },
    {
      name: "Vesícula Biliar",
      defaultNormalText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
      findings: [
        { id: "vesiculaNormal", label: "Normal", alteredText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.", conclusionText: "Vesícula biliar sem alterações." },
        { id: "calculosVesicula", label: "Cálculos na vesícula biliar", alteredText: "Presença de cálculos na vesícula biliar.", conclusionText: "Colelitíase." },
      ],
    },
    {
      name: "Rins",
      defaultNormalText: "Rins com dimensões, contornos e ecotextura normais, sem dilatação do sistema coletor ou cálculos.",
      findings: [
        { id: "rinsNormal", label: "Normal", alteredText: "Rins com dimensões, contornos e ecotextura normais, sem dilatação do sistema coletor ou cálculos.", conclusionText: "Rins sem alterações." },
        { id: "cistoRenal", label: "Cisto renal", requiresSize: true, alteredText: "Presença de cisto renal.", conclusionText: "Cisto renal." },
        { id: "calculoRenal", label: "Cálculo renal", requiresSize: true, alteredText: "Presença de cálculo renal.", conclusionText: "Nefrolitíase." },
      ],
    },
    {
      name: "Pâncreas",
      defaultNormalText: "Pâncreas com dimensões e ecotextura normais.",
      findings: [
        { id: "pancreasNormal", label: "Normal", alteredText: "Pâncreas com dimensões e ecotextura normais.", conclusionText: "Pâncreas sem alterações." },
      ],
    },
    {
      name: "Baço",
      defaultNormalText: "Baço com dimensões e ecotextura normais.",
      findings: [
        { id: "bacoNormal", label: "Normal", alteredText: "Baço com dimensões e ecotextura normais.", conclusionText: "Baço sem alterações." },
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
        { id: "noduloTireoidiano", label: "Nódulo tireoidiano", requiresSize: true, alteredText: "Presença de nódulo tireoidiano.", conclusionText: "Nódulo tireoidiano." },
        { id: "cistoTireoidiano", label: "Cisto tireoidiano", requiresSize: true, alteredText: "Presença de cisto tireoidiano.", conclusionText: "Cisto tireoidiano." },
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
        { id: "miomaUterino", label: "Mioma uterino", requiresSize: true, alteredText: "Presença de mioma uterino.", conclusionText: "Mioma uterino." },
      ],
    },
    {
      name: "Ovários",
      defaultNormalText: "Ovários com dimensões e ecotextura normais, sem formações císticas ou sólidas.",
      findings: [
        { id: "ovariosNormal", label: "Normal", alteredText: "Ovários com dimensões e ecotextura normais, sem formações císticas ou sólidas.", conclusionText: "Ovários sem alterações." },
        { id: "cistoOvariano", label: "Cisto ovariano", requiresSize: true, alteredText: "Presença de cisto ovariano.", conclusionText: "Cisto ovariano." },
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
        { id: "noduloMama", label: "Nódulo mamário", requiresSize: true, alteredText: "Presença de nódulo mamário.", conclusionText: "Nódulo mamário." },
        { id: "cistoMama", label: "Cisto mamário", requiresSize: true, alteredText: "Presença de cisto mamário.", conclusionText: "Cisto mamário." },
        { id: "dilatacaoDuctal", label: "Dilatação ductal", requiresSize: true, alteredText: "Presença de dilatação ductal.", conclusionText: "Dilatação ductal." },
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
        { id: "abdSupNoduloHepatico", label: "Nódulo hepático", requiresSize: true, alteredText: "Presença de nódulo hepático.", conclusionText: "Nódulo hepático." },
      ],
    },
    {
      name: "Vesícula Biliar",
      defaultNormalText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
      findings: [
        { id: "abdSupVesiculaNormal", label: "Normal", alteredText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.", conclusionText: "Vesícula biliar sem alterações." },
        { id: "abdSupCalculosVesicula", label: "Cálculos na vesícula biliar", alteredText: "Presença de cálculos na vesícula biliar.", conclusionText: "Colelitíase." },
      ],
    },
    {
      name: "Pâncreas",
      defaultNormalText: "Pâncreas com dimensões e ecotextura normais.",
      findings: [
        { id: "abdSupPancreasNormal", label: "Normal", alteredText: "Pâncreas com dimensões e ecotextura normais.", conclusionText: "Pâncreas sem alterações." },
      ],
    },
    {
      name: "Baço",
      defaultNormalText: "Baço com dimensões e ecotextura normais.",
      findings: [
        { id: "abdSupBacoNormal", label: "Normal", alteredText: "Baço com dimensões e ecotextura normais.", conclusionText: "Baço sem alterações." },
      ],
    },
  ],
  "Ultrassom de Vias Urinárias": [
    {
      name: "Rins",
      defaultNormalText: "Rins com dimensões, contornos e ecotextura normais, sem dilatação do sistema coletor ou cálculos.",
      findings: [
        { id: "viasUrinariasRinsNormal", label: "Normal", alteredText: "Rins com dimensões, contornos e ecotextura normais, sem dilatação do sistema coletor ou cálculos.", conclusionText: "Rins sem alterações." },
        { id: "viasUrinariasCistoRenal", label: "Cisto renal", requiresSize: true, alteredText: "Presença de cisto renal.", conclusionText: "Cisto renal." },
        { id: "viasUrinariasCalculoRenal", label: "Cálculo renal", requiresSize: true, alteredText: "Presença de cálculo renal.", conclusionText: "Nefrolitíase." },
        { id: "viasUrinariasHidronefrose", label: "Hidronefrose", alteredText: "Presença de hidronefrose.", conclusionText: "Hidronefrose." },
      ],
    },
    {
      name: "Bexiga",
      defaultNormalText: "Bexiga com paredes finas e conteúdo anecóico, sem alterações.",
      findings: [
        { id: "bexigaNormal", label: "Normal", alteredText: "Bexiga com paredes finas e conteúdo anecóico, sem alterações.", conclusionText: "Bexiga sem alterações." },
        { id: "calculoBexiga", label: "Cálculo na bexiga", requiresSize: true, alteredText: "Presença de cálculo na bexiga.", conclusionText: "Cálculo vesical." },
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
        { id: "cistoEpididimo", label: "Cisto de epidídimo", requiresSize: true, alteredText: "Presença de cisto de epidídimo.", conclusionText: "Cisto de epidídimo." },
        { id: "hidrocele", label: "Hidrocele", alteredText: "Presença de hidrocele.", conclusionText: "Hidrocele." },
        { id: "varicocele", label: "Varicocele", alteredText: "Presença de varicocele.", conclusionText: "Varicocele." },
      ],
    },
    {
      name: "Epidídimos",
      defaultNormalText: "Epidídimos com dimensões e ecotextura normais.",
      findings: [
        { id: "epididimosNormal", label: "Normal", alteredText: "Epidídimos com dimensões e ecotextura normais.", conclusionText: "Epidídimos sem alterações." },
        { id: "epididimite", label: "Epididimite", alteredText: "Sinais de epididimite.", conclusionText: "Epididimite." },
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

const UltrasoundReportGenerator = () => {
  const [doctorName, setDoctorName] = useState("");
  const [doctorCRM, setDoctorCRM] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [patientGender, setPatientGender] = useState<string>("");
  const [examType, setExamType] = useState<string>("");
  const [generatedReport, setGeneratedReport] = useState("");

  // State to hold the current selection and sizes for findings
  const [currentFindingsState, setCurrentFindingsState] = useState<
    Map<string, { isChecked: boolean; size: string }>
  >(new Map());

  // Reset findings state when examType changes
  useEffect(() => {
    setCurrentFindingsState(new Map());
  }, [examType]);

  // Helper to find a finding definition by its ID across all exam types
  const findFindingDefinitionById = (id: string): FindingDefinition | undefined => {
    for (const examTypeKey in examDefinitions) {
      for (const category of examDefinitions[examTypeKey]) {
        const finding = category.findings.find(f => f.id === id);
        if (finding) return finding;
      }
    }
    return undefined;
  };

  // Helper to find the category an ID belongs to for the current examType
  const findCategoryForCurrentExam = (findingId: string): ExamCategory | undefined => {
    const currentExamCategories = examDefinitions[examType] || [];
    for (const category of currentExamCategories) {
      if (category.findings.some(f => f.id === findingId)) {
        return category;
      }
    }
    return undefined;
  };

  const handleFindingChange = (
    findingId: string,
    isChecked: boolean,
    size?: string,
  ) => {
    setCurrentFindingsState((prev) => {
      const newState = new Map(prev);
      const category = findCategoryForCurrentExam(findingId);

      if (!category) {
        // If category not found for current exam type, just update the specific finding
        newState.set(findingId, {
          isChecked,
          size: size !== undefined ? size : prev.get(findingId)?.size || "",
        });
        return newState;
      }

      const normalFindingId = category.findings[0]?.id; // Assuming 'Normal' is always the first finding

      if (isChecked) {
        if (findingId === normalFindingId) {
          // If 'Normal' is checked, deselect all other findings in this category
          category.findings.forEach(f => {
            if (f.id !== normalFindingId) {
              newState.set(f.id, { isChecked: false, size: "" });
            }
          });
        } else {
          // If a non-normal finding is checked, deselect 'Normal' in this category
          if (normalFindingId && newState.get(normalFindingId)?.isChecked) {
            newState.set(normalFindingId, { isChecked: false, size: "" });
          }
        }
      }

      // Set the current finding's state
      newState.set(findingId, {
        isChecked,
        size: size !== undefined ? size : prev.get(findingId)?.size || "",
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
    const uniqueConclusionTexts = new Set<string>(); // To avoid duplicate conclusion texts

    const currentExamCategories = examDefinitions[examType] || [];

    currentExamCategories.forEach((category) => {
      let categoryHasCheckedFinding = false;
      category.findings.forEach((finding) => {
        const state = currentFindingsState.get(finding.id);
        if (state?.isChecked) {
          categoryHasCheckedFinding = true;
          let statement = finding.alteredText;
          if (finding.requiresSize && state.size) {
            statement += ` (Tamanho: ${state.size} mm)`;
          }
          findingsStatements.push(statement);
          if (finding.conclusionText) {
            uniqueConclusionTexts.add(finding.conclusionText);
          }
        }
      });

      // If no findings were checked for this category, it means it wasn't analyzed or is implicitly normal
      // We only add defaultNormalText if the explicit 'Normal' option was checked.
      // If no findings were checked at all, we don't add anything for this category.
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

    // Add guidance based on conclusions
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

  const currentExamCategories = examDefinitions[examType] || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gerador de Laudos de Ultrassom</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulário de Entrada */}
        <div className="space-y-6">
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
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. João Silva"
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
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Maria Oliveira"
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

          <Card>
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
                  {currentExamCategories.map((category) => {
                    const normalFindingId = category.findings[0]?.id; // Assuming 'Normal' is always the first finding
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

                            // Only show 'Normal' if no other findings are checked, or if it's currently checked
                            if (finding.id === normalFindingId && hasOtherFindingsChecked && !isChecked) {
                              return null;
                            }

                            return (
                              <div key={finding.id} className="flex items-center space-x-2 ml-2">
                                <Checkbox
                                  id={finding.id}
                                  checked={isChecked}
                                  onCheckedChange={(checked) =>
                                    handleFindingChange(finding.id, checked as boolean)
                                  }
                                />
                                <Label htmlFor={finding.id} className="flex-1">
                                  {finding.label}
                                </Label>
                                {finding.requiresSize && isChecked && (
                                  <Input
                                    type="text"
                                    placeholder="Tamanho (mm)"
                                    value={size}
                                    onChange={(e) =>
                                      handleFindingChange(finding.id, true, e.target.value)
                                    }
                                    className="w-32"
                                  />
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
              )}

              <Button onClick={handleGenerateReport} className="w-full">
                Gerar Laudo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Visualização e Edição do Laudo */}
        <Card>
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
              <Button onClick={() => alert("Funcionalidade de Salvar ainda não implementada.")}>Salvar Laudo</Button>
              <Button onClick={() => alert("Funcionalidade de Baixar PDF ainda não implementada.")}>Baixar PDF</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default UltrasoundReportGenerator;