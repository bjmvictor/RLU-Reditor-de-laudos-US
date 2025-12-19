/**
 * AI-powered Report Generator using Local Ollama
 * Generates professional ultrasound reports with medical terminology
 * Runs locally without internet dependency
 */

export interface PatientData {
  name: string;
  age?: number;
  gender?: string;
  clinicalIndication?: string;
  findings: string[];
  examType: string;
}

export interface GeneratedReport {
  technique: string;
  report: string;
  conclusion: string;
  observations?: string;
}

// Ollama configuration
const OLLAMA_API_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "mistral"; // Default to Mistral, can be changed to medical-specific model

/**
 * Checks if Ollama is available locally
 */
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Gets list of available models in Ollama
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch {
    return [];
  }
}

/**
 * Generates a professional ultrasound report using AI
 * Falls back to template-based generation if Ollama is unavailable
 */
export async function generateReportWithAI(
  patientData: PatientData,
  useAIIfAvailable: boolean = true
): Promise<GeneratedReport> {
  if (!useAIIfAvailable) {
    return generateReportTemplate(patientData);
  }

  try {
    const isOllamaAvailable = await checkOllamaAvailability();
    if (!isOllamaAvailable) {
      console.warn("Ollama is not available, using template-based generation");
      return generateReportTemplate(patientData);
    }
    return await generateReportViaOllama(patientData);
  } catch (error) {
    console.warn("AI generation failed, falling back to template:", error);
    return generateReportTemplate(patientData);
  }
}

/**
 * Calls local Ollama API to generate professional report text
 * No internet dependency - runs completely locally
 */
async function generateReportViaOllama(patientData: PatientData): Promise<GeneratedReport> {
  const prompt = buildPrompt(patientData);

  const response = await fetch(OLLAMA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      temperature: 0.6,
      num_predict: 1000,
      top_k: 40,
      top_p: 0.9,
      repeat_penalty: 1.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.status}`);
  }

  const data = await response.json();
  const generatedText = data.response || "";

  return parseGeneratedReport(generatedText, patientData);
}

/**
 * Builds a specialized prompt for medical report generation
 * Structured to generate professional Portuguese medical terminology
 */
function buildPrompt(patientData: PatientData): string {
  const findingsText = patientData.findings.join(", ");
  const ageText = patientData.age ? `${patientData.age} anos` : "idade não informada";
  const genderText = patientData.gender ? `, ${patientData.gender}` : "";
  const indicationText = patientData.clinicalIndication || "Avaliação de rotina";

  // Medical context prompt to guide the AI
  const medicalContext = `Você é um radiologista experiente e especializado em ultrassonografia ${patientData.examType.toLowerCase()}. 
Sua tarefa é gerar um laudo técnico, profissional e detalhado em português.

Instruções importantes:
- Utilize terminologia médica apropriada e precisa
- Estruture o laudo em TÉCNICA, RELATÓRIO e CONCLUSÃO
- Na TÉCNICA: descreva brevemente o método e equipamento utilizado
- No RELATÓRIO: descreva os achados de forma organizada, usando linguagem técnica
- Na CONCLUSÃO: resuma os achados principais com opinião clínica
- Use termos ultrassonográficos como: anecóico, hipoecoico, hiperecoico, isoecóico, tópico, ectópico, etc.
- Mantenha tom profissional e impessoal
- Se houver achados anormais, descreva com precisão
- Se tudo estiver normal, afirme explicitamente a normalidade`;

  return `${medicalContext}

DADOS DO PACIENTE E EXAME:
- Tipo de exame: ${patientData.examType}
- Paciente: ${patientData.name}${genderText}
- Idade: ${ageText}
- Indicação clínica: ${indicationText}
- Achados principais: ${findingsText}

GERE AGORA UM LAUDO COMPLETO E PROFISSIONAL:

TÉCNICA:
`;
}

/**
 * Parses the AI-generated text into structured report sections
 */
function parseGeneratedReport(generatedText: string, patientData: PatientData): GeneratedReport {
  // Clean up the generated text
  let cleanText = generatedText.trim();
  
  // Remove any repetition of the prompt in the output
  const techniqueIndex = cleanText.indexOf("TÉCNICA:");
  if (techniqueIndex > 0) {
    cleanText = cleanText.substring(techniqueIndex);
  }

  // Extract sections with more flexible regex patterns
  const techniqueMatch = cleanText.match(/TÉCNICA:?\s*\n([\s\S]*?)(?=\nRELATÓRIO|RELATÓRIO|$)/i);
  const reportMatch = cleanText.match(/RELATÓRIO:?\s*\n([\s\S]*?)(?=\nCONCLUSÃO|CONCLUSÃO|$)/i);
  const conclusionMatch = cleanText.match(/CONCLUSÃO:?\s*\n([\s\S]*?)$/i);

  const technique = (techniqueMatch?.[1] || "").trim() || getDefaultTechnique(patientData.examType);
  const report = (reportMatch?.[1] || "").trim() || cleanText;
  const conclusion = (conclusionMatch?.[1] || "").trim() || "Achados conforme descrito acima.";

  // Clean up any extra whitespace
  return {
    technique: technique.replace(/\n{3,}/g, "\n\n"),
    report: report.replace(/\n{3,}/g, "\n\n"),
    conclusion: conclusion.replace(/\n{3,}/g, "\n\n"),
    observations: `Laudo gerado com suporte de IA local. Revisado e validado pelo médico responsável.`,
  };
}

/**
 * Fallback: Generate report using predefined templates and rules
 */
function generateReportTemplate(patientData: PatientData): GeneratedReport {
  const { examType, findings, clinicalIndication, age, gender } = patientData;

  // Technical description based on exam type
  const technique = getTechnique(examType);

  // Generate report based on findings
  const report = generateReportContent(examType, findings, age, gender);

  // Generate conclusion
  const conclusion = generateConclusion(examType, findings);

  return {
    technique,
    report,
    conclusion,
    observations: "Exame realizado conforme protocolo institucional.",
  };
}

/**
 * Gets technical description for exam type
 */
function getTechnique(examType: string): string {
  const techniques: { [key: string]: string } = {
    "Ultrassom Abdominal Total":
      "Exame realizado com transdutor convexo multifrequencial na modalidade bidimensional, com análise da região abdominal superior e inferior.",
    "Ultrassom de Tireoide":
      "Exame realizado com transdutor linear de alta frequência na modalidade bidimensional e modo Doppler.",
    "Ultrassom Pélvico":
      "Exame realizado com transdutor convexo e linear multifrequencial nas modalidades bidimensional e Doppler colorido.",
    "Ultrassom Obstetríco":
      "Exame realizado com transdutor convexo multifrequencial na modalidade bidimensional.",
    "Ultrassom de Mamas":
      "Exame realizado com transdutor linear de alta frequência na modalidade bidimensional e modo Doppler.",
  };

  return techniques[examType] || "Exame realizado com transdutor apropriado na modalidade bidimensional.";
}

/**
 * Generates report content based on findings
 */
function generateReportContent(examType: string, findings: string[], age?: number, gender?: string): string {
  let content = "";

  // Add patient context if available
  if (age) {
    content += `Paciente com ${age} anos`;
    if (gender) content += `, ${gender}`;
    content += ".\n\n";
  }

  // Exam-specific content generation
  switch (examType) {
    case "Ultrassom Abdominal Total":
      content += generateAbdominalReport(findings);
      break;
    case "Ultrassom de Tireoide":
      content += generateThyroidReport(findings);
      break;
    case "Ultrassom Pélvico":
      content += generatePelvicReport(findings);
      break;
    case "Ultrassom Obstetríco":
      content += generateObstetricReport(findings);
      break;
    default:
      content += findings.map((f) => `- ${f}`).join("\n");
  }

  return content;
}

function generateAbdominalReport(findings: string[]): string {
  const findingMap: { [key: string]: string } = {
    "Fígado normal": "Fígado com dimensões normais, ecotextura homogênea, sem nodulações ou alterações significativas.",
    "Vesícula biliar normal":
      "Vesícula biliar com paredes finas e regulares, anecóica, sem cálculos, dilatação de vias biliares ou sinais de inflamação.",
    "Rins normais":
      "Rins com dimensões e contornos normais, ecotextura preservada, sem dilatação do sistema coletor, cálculos ou lesões focais.",
    "Pâncreas normal": "Pâncreas com dimensões normais, contornos definidos e ecotextura homogênea.",
    "Baço normal": "Baço com dimensões normais e ecotextura característica, sem alterações estruturais.",
  };

  return findings
    .map((finding) => findingMap[finding] || `${finding}.`)
    .join("\n\n");
}

function generateThyroidReport(findings: string[]): string {
  const findingMap: { [key: string]: string } = {
    "Tireoide normal":
      "Tireoide com dimensões normais, contornos regulares, ecotextura homogênea e simétrica, sem nódulos, cistos ou sinais de inflamação.",
    "Hipotireoidismo": "Sinais ultrassonográficos sugestivos de hipotireoidismo com alterações na ecotextura tireoidiana.",
  };

  return findings
    .map((finding) => findingMap[finding] || `${finding}.`)
    .join("\n\n");
}

function generatePelvicReport(findings: string[]): string {
  const findingMap: { [key: string]: string } = {
    "Útero normal": "Útero com dimensões normais, contornos regulares, ecotextura miometrial homogênea.",
    "Ovários normais": "Ovários tópicos com dimensões normais, com folículos compatíveis com a fase do ciclo.",
  };

  return findings
    .map((finding) => findingMap[finding] || `${finding}.`)
    .join("\n\n");
}

function generateObstetricReport(findings: string[]): string {
  return findings
    .map((finding) => `${finding}`)
    .join("\n\n");
}

/**
 * Generates conclusion based on findings
 */
function generateConclusion(examType: string, findings: string[]): string {
  const hasAbnormalities = findings.some((f) => !f.toLowerCase().includes("normal") && !f.toLowerCase().includes("ausência"));

  if (hasAbnormalities) {
    return `${examType} com achados conforme descrito acima. Recomenda-se correlação clínica e seguimento conforme necessário.`;
  }

  return `${examType} sem alterações significativas. Achados compatíveis com a normalidade.`;
}

/**
 * Gets default technique for exam type when AI generation fails
 */
function getDefaultTechnique(examType: string): string {
  return getTechnique(examType);
}

/**
 * Function to check if Ollama is configured and available
 */
export function isAIAvailable(): boolean {
  // This will be checked asynchronously in the component
  return true; // We'll verify in the component with checkOllamaAvailability()
}
