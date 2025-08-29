import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";

const UltrasoundReportGenerator = () => {
  const [doctorName, setDoctorName] = useState("");
  const [doctorCRM, setDoctorCRM] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [patientGender, setPatientGender] = useState<string>("");
  const [examType, setExamType] = useState<string>("");
  const [examFindings, setExamFindings] = useState("");
  const [generatedReport, setGeneratedReport] = useState("");

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
    reportText += `Tipo de Exame: ${examType || "[Tipo de Exame]"}\n`;
    reportText += `Achados: ${examFindings || "Não foram descritos achados específicos."}\n\n`;

    reportText += `CONCLUSÃO: [Conclusão do laudo aqui.]`;

    setGeneratedReport(reportText);
  };

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
                    <SelectItem value="Ultrassom Abdominal Total">Ultrassom Abdominal Total</SelectItem>
                    <SelectItem value="Ultrassom de Tireoide">Ultrassom de Tireoide</SelectItem>
                    <SelectItem value="Ultrassom Pélvico">Ultrassom Pélvico</SelectItem>
                    <SelectItem value="Ultrassom de Mamas">Ultrassom de Mamas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="examFindings">Achados do Exame (descrição livre)</Label>
                <Textarea
                  id="examFindings"
                  value={examFindings}
                  onChange={(e) => setExamFindings(e.target.value)}
                  placeholder="Descreva os achados do exame aqui, como órgãos normais, alterações, nódulos, etc."
                  rows={6}
                />
              </div>
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