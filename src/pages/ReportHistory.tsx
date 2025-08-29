import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getReports, deleteReport, updateReport } from "@/lib/report-storage";
import { Report } from "@/lib/report-types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ReportHistory = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editedReportText, setEditedReportText] = useState<string>("");

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este laudo?")) {
      deleteReport(id);
      setReports(getReports()); // Refresh the list
    }
  };

  const handleEdit = (report: Report) => {
    setEditingReportId(report.id);
    setEditedReportText(report.generatedText);
  };

  const handleSaveEdit = (id: string) => {
    const updatedReport = reports.find(r => r.id === id);
    if (updatedReport) {
      const newReport: Report = { ...updatedReport, generatedText: editedReportText };
      updateReport(newReport);
      setReports(getReports()); // Refresh the list
      setEditingReportId(null); // Exit editing mode
      alert("Laudo atualizado com sucesso!");
    }
  };

  const handleDownloadPdf = async (report: Report) => {
    const element = document.createElement("div");
    element.innerHTML = report.generatedText.replace(/\n/g, '<br/>'); // Convert newlines to <br/> for HTML rendering
    element.style.padding = "20px";
    element.style.fontFamily = "monospace";
    element.style.whiteSpace = "pre-wrap"; // Preserve whitespace and wrap text

    document.body.appendChild(element); // Temporarily add to DOM for canvas rendering

    const canvas = await html2canvas(element, { scale: 2 }); // Increase scale for better quality
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    document.body.removeChild(element); // Remove from DOM

    pdf.save(`laudo_${report.patientName.replace(/\s/g, '_')}_${report.createdAt.split('T')[0]}.pdf`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-1">Histórico de Laudos</h1>
        <ThemeToggle />
      </div>

      <Link to="/ultrasound">
        <Button className="mb-6">Voltar para o Gerador de Laudos</Button>
      </Link>

      {reports.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Nenhum laudo salvo ainda.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="relative">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Laudo de {report.patientName} ({report.examType})</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingReportId === report.id ? (
                  <Textarea
                    value={editedReportText}
                    onChange={(e) => setEditedReportText(e.target.value)}
                    rows={10}
                    className="font-mono mb-4"
                  />
                ) : (
                  <Textarea
                    value={report.generatedText}
                    readOnly
                    rows={10}
                    className="font-mono mb-4"
                  />
                )}
                <div className="flex flex-wrap gap-2 justify-end">
                  {editingReportId === report.id ? (
                    <>
                      <Button onClick={() => handleSaveEdit(report.id)}>Salvar Edição</Button>
                      <Button variant="outline" onClick={() => setEditingReportId(null)}>Cancelar</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => handleEdit(report)}>Editar</Button>
                      <Button variant="destructive" onClick={() => handleDelete(report.id)}>Excluir</Button>
                      <Button onClick={() => handleDownloadPdf(report)}>Baixar PDF</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <MadeWithDyad />
    </div>
  );
};

export default ReportHistory;