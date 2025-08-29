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
        {
          id: "esteatoseHepatica",
          label: "Esteatose hepática",
          alteredText: "Presença de esteatose hepática.",
          conclusionText: "Esteatose hepática.",
        },
        {
          id: "noduloHepatico",
          label: "Nódulo hepático",
          requiresSize: true,
          alteredText: "Presença de nódulo hepático.",
          conclusionText: "Nódulo hepático.",
        },
      ],
    },
    {
      name: "Vesícula Biliar",
      defaultNormalText: "Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
      findings: [
        {
          id: "calculosVesicula",
          label: "Cálculos na vesícula biliar",
          alteredText: "Presença de cálculos na vesícula biliar.",
          conclusionText: "Colelitíase.",
        },
      ],
    },
    {
      name: "Rins",
      defaultNormalText: "Rins com dimensões, contornos e ecotextura normais, sem dilatação do sistema coletor ou cálculos.",
      findings: [
        {
          id: "cistoRenal",
          label: "Cisto renal",
          requiresSize: true,
          alteredText: "Presença de cisto renal.",
          conclusionText: "Cisto renal.",
        },
        {
          id: "calculoRenal",
          label: "Cálculo renal",
          requiresSize: true,
          alteredText: "Presença de cálculo renal.",
          conclusionText: "Nefrolitíase.",
        },
      ],
    },
    {
      name: "Pâncreas",
      defaultNormalText: "Pâncreas com dimensões e ecotextura normais.",
      findings: [],
    },
    {
      name: "Baço",
      defaultNormalText: "Baço com dimensões e ecotextura normais.",
      findings: [],
    },
    {
      name: "Líquido Livre",
      defaultNormalText: "Ausência de líquido livre na cavidade.",
      findings: [
        {
          id: "liquidoLivreCavidade",
          label: "Líquido livre na cavidade",
          alteredText: "Presença de líquido livre na cavidade.",
          conclusionText: "Líquido livre na cavidade.",
        },
      ],
    },
  ],
  "Ultrassom de Tireoide": [
    {
      name: "Tireoide",
      defaultNormalText: "Tireoide com dimensões e ecotextura normais.",
      findings: [
        {
          id: "noduloTireoidiano",
          label: "Nódulo tireoidiano",
          requiresSize: true,
          alteredText: "Presença de nódulo tireoidiano.",
          conclusionText: "Nódulo tireoidiano.",
        },
        {
          id: "cistoTireoidiano",
          label: "Cisto tireoidiano",
          requiresSize: true,
          alteredText: "Presença de cisto tireoidiano.",
          conclusionText: "Cisto tireoidiano.",
        },
        {
          id: "tireoidite",
          label: "Sinais de tireoidite",
          alteredText: "Sinais ultrassonográficos de tireoidite.",
          conclusionText: "Sinais de tireoidite.",
        },
      ],
    },
  ],
  "Ultrassom Pélvico": [
    {
      name: "Útero",
      defaultNormalText: "Útero em anteversoflexão, com dimensões e ecotextura normais.",
      findings: [
        {
          id: "miomaUterino",
          label: "Mioma uterino",
          requiresSize: true,
          alteredText: "Presença de mioma uterino.",
          conclusionText: "Mioma uterino.",
        },
      ],
    },
    {
      name: "Ovários",
      defaultNormalText: "Ovários com dimensões e ecotextura normais, sem formações císticas ou sólidas.",
      findings: [
        {
          id: "cistoOvariano",
          label: "Cisto ovariano",
          requiresSize: true,
          alteredText: "Presença de cisto ovariano.",
          conclusionText: "Cisto ovariano.",
        },
      ],
    },
    {
      name: "Endométrio",
      defaultNormalText: "Endométrio com espessura normal para a fase do ciclo.",
      findings: [
        {
          id: "endometrioAlterado",
          label: "Endométrio com espessura alterada ou irregularidades",
          alteredText: "Endométrio com espessura alterada ou irregularidades.",
          conclusionText: "Alteração endometrial.",
        },
      ],
    },
    {
      name: "Líquido Livre na Pelve",
      defaultNormalText: "Ausência de líquido livre na pelve.",
      findings: [
        {
          id: "liquidoLivrePelvico",
          label: "Líquido livre na pelve",
          alteredText: "Presença de líquido livre na pelve.",
          conclusionText: "Líquido livre na pelve.",
        },
      ],
    },
  ],
  "Ultrassom de Mamas": [
    {
      name: "Mamas",
      defaultNormalText: "Mamas com ecotextura glandular e adiposa normal.",
      findings: [
        {
          id: "noduloMama",
          label: "Nódulo mamário",
          requiresSize: true,
          alteredText: "Presença de nódulo mamário.",
          conclusionText: "Nódulo mamário.",
        },
        {
          id: "cistoMama",
          label: "Cisto mamário",
          requiresSize: true,
          alteredText: "Presença de cisto mamário.",
          conclusionText: "Cisto mamário.",
        },
        {
          id: "dilatacaoDuctal",
          label: "Dilatação ductal",
          requiresSize: true,
          alteredText: "Presença de dilatação ductal.",
          conclusionText: "Dilatação ductal.",
        },
      ],
    },
  ],
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

  const handleFindingChange = (
    findingId: string,
    isChecked: boolean,
    size?: string,
  ) => {
    setCurrentFindingsState((prev) => {
      const newState = new Map(prev);
      newState.set(findingId, {
        isChecked,
        size: size !== undefined ? size : newState.get(findingId)?.size || "",
      });
      return newState;
    });
  };

  const handleGenerateReport = () => {
    let reportText = `LAUDO DE ULTRASSOM\n\n`;

    reportText += `MÉDICO RESPONSÁVEL:\n`;
    reportText += `Nome: ${doctorName || "[Nome do Médico]"}\n`;
    reportText += `CRM: ${doctorCRM || "[CRM do Médico]"}\n\n`;

    reportText += `DADOS DO PACIENTE:\n`;
    reportText += `Nome: ${patientName || "[Nome do Paciente]"}\n`;
    reportText += `Data de Nascimento: ${patientDOB || "[DD/MM/AAAA]"}\n`;
    reportText += `Gênero: ${patientGender || "[Gênero]"}\n\n`;

    reportText += `EXAME:\n`;
    reportText += `Tipo de Exame: ${examType || "[Tipo de Exame]"}\n\n`;

    reportText += `ACHADOS:\n`;
    const findingsStatements: string[] = [];
    const conclusionStatements: string[] = [];
    const alteredCategories = new Set<string>();

    const currentExamCategories = examDefinitions[examType] || [];

    currentExamCategories.forEach((category) => {
      let categoryHasAlteredFinding = false;
      category.findings.forEach((finding) => {
        const state = currentFindingsState.get(finding.id);
        if (state?.isChecked) {
          let statement = finding.alteredText;
          if (finding.requiresSize && state.size) {
            statement += ` (Tamanho: ${state.size} mm)`;
          }
          findingsStatements.push(statement);
          if (finding.conclusionText) {
            conclusionStatements.push(finding.conclusionText);
          }
          categoryHasAlteredFinding = true;
          alteredCategories.add(category.name);
        }
      });

      if (!categoryHasAlteredFinding && category.defaultNormalText) {
        findingsStatements.push(category.defaultNormalText);
      }
    });

    if (findingsStatements.length === 0) {
      reportText += "Não foram descritos achados específicos.\n\n";
    } else {
      reportText += findingsStatements.map((s) => `- ${s}`).join("\n") + "\n\n";
    }

    reportText += `CONCLUSÃO:\n`;
    if (conclusionStatements.length === 0) {
      reportText += "Exame sem alterações significativas.\n";
    } else {
      reportText += conclusionStatements.map((s) => `- ${s}`).join("\n") + "\n";
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
                  {currentExamCategories.map((category) => (
                    <div key={category.name} className="space-y-2 border p-3 rounded-md">
                      <p className="font-medium">{category.name}:</p>
                      {category.findings.length > 0 ? (
                        category.findings.map((finding) => {
                          const state = currentFindingsState.get(finding.id);
                          const isChecked = state?.isChecked || false;
                          const size = state?.size || "";

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
                  ))}
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