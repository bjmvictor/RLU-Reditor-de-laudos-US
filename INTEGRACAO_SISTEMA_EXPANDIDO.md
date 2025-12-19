# 🚀 Guia de Integração - Sistema Expandido

## 📋 O que foi implementado?

✅ **Base de Conhecimento Completa** (`knowledgeBase.ts`)
- 90+ achados ultrassonográficos do Compêndio da Radiologia
- Estrutura hierárquica: Categoria → Região → Órgão → Achados
- Textos técnicos profissionais em português

✅ **Definições de Exames Expandidas** (`examDefinitionsExpanded.ts`)
- 10+ tipos de exames diferentes
- Compatível com o editor existente
- Metadados completos (tamanho, lateralidade, quantidade, características)

✅ **IA Treinada** (`aiReportGenerator.ts` atualizado)
- Integração com knowledge base
- Busca automática de contexto relevante
- Prompts enriquecidos com frases técnicas exatas

---

## 🔧 Como Integrar no Editor

### **Passo 1: Atualizar o Import no UltrasoundReportGenerator**

```typescript
// Adicione no topo do arquivo:
import EXPANDED_EXAM_DEFINITIONS from '@/data/examDefinitionsExpanded';

// Substitua o examDefinitions existente por:
const examDefinitions = EXPANDED_EXAM_DEFINITIONS;
```

### **Passo 2: Atualizar o Dropdown de Seleção de Exames**

Encontre o `<Select>` para tipo de exame e atualize as opções:

```tsx
<Select value={examType} onValueChange={setExamType}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione o tipo de exame" />
  </SelectTrigger>
  <SelectContent>
    {/* ULTRASSOM GERAL - CERVICAL */}
    <SelectItem value="US Cervical - Tireoide">US Cervical - Tireoide</SelectItem>
    
    {/* ULTRASSOM GERAL - ABDOME */}
    <SelectItem value="US Abdome - Total">US Abdome - Total</SelectItem>
    
    {/* ULTRASSOM GERAL - PELVE FEMININA */}
    <SelectItem value="US Pelve Feminina">US Pelve Feminina</SelectItem>
    
    {/* ULTRASSOM OBSTÉTRICO */}
    <SelectItem value="US Obstétrico - 1º Trimestre">US Obstétrico - 1º Trimestre</SelectItem>
    <SelectItem value="US Obstétrico - 2º/3º Trimestre">US Obstétrico - 2º/3º Trimestre</SelectItem>
  </SelectContent>
</Select>
```

### **Passo 3: Adicionar Campos de Lateralidade e Quantidade**

Para achados com `hasLaterality` ou `hasQuantity`, adicione campos condicionais:

```tsx
{finding.hasLaterality && selectedFindings.includes(finding.id) && (
  <div className="ml-6 mt-2">
    <Label>Lateralidade</Label>
    <Select 
      value={findingMetadata[finding.id]?.laterality || ""}
      onValueChange={(value) => updateFindingMetadata(finding.id, 'laterality', value)}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="direito">Direito</SelectItem>
        <SelectItem value="esquerdo">Esquerdo</SelectItem>
        <SelectItem value="bilateral">Bilateral</SelectItem>
      </SelectContent>
    </Select>
  </div>
)}

{finding.hasQuantity && selectedFindings.includes(finding.id) && (
  <div className="ml-6 mt-2">
    <Label>Quantidade</Label>
    <Select 
      value={findingMetadata[finding.id]?.quantity || ""}
      onValueChange={(value) => updateFindingMetadata(finding.id, 'quantity', value)}
    >
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unico">Único</SelectItem>
        <SelectItem value="multiplos">Múltiplos</SelectItem>
      </SelectContent>
    </Select>
  </div>
)}
```

### **Passo 4: Adicionar Campo de Características**

Para achados com `hasCharacteristics`:

```tsx
{finding.hasCharacteristics && selectedFindings.includes(finding.id) && (
  <div className="ml-6 mt-2">
    <Label>Características</Label>
    <div className="grid grid-cols-2 gap-2 mt-2">
      {finding.hasCharacteristics.map((char) => (
        <div key={char} className="flex items-center space-x-2">
          <Checkbox
            id={`${finding.id}-${char}`}
            checked={
              findingMetadata[finding.id]?.characteristics?.includes(char) || false
            }
            onCheckedChange={(checked) => {
              const current = findingMetadata[finding.id]?.characteristics || [];
              const updated = checked
                ? [...current, char]
                : current.filter((c) => c !== char);
              updateFindingMetadata(finding.id, 'characteristics', updated);
            }}
          />
          <Label htmlFor={`${finding.id}-${char}`} className="text-sm">
            {char}
          </Label>
        </div>
      ))}
    </div>
  </div>
)}
```

### **Passo 5: Estado para Metadados**

Adicione estado para armazenar metadados dos achados:

```typescript
const [findingMetadata, setFindingMetadata] = useState<{
  [key: string]: {
    size?: string;
    laterality?: string;
    quantity?: string;
    characteristics?: string[];
  };
}>({});

const updateFindingMetadata = (
  findingId: string,
  field: string,
  value: any
) => {
  setFindingMetadata((prev) => ({
    ...prev,
    [findingId]: {
      ...prev[findingId],
      [field]: value,
    },
  }));
};
```

---

## 🤖 Como a IA Usa o Knowledge Base

### **Fluxo Automático**

1. **Usuário seleciona exame**: "US Cervical - Tireoide"
2. **Usuário seleciona achados**: "Nódulo Tireoidiano"
3. **Clica em "Gerar com IA"**
4. **Sistema busca no Knowledge Base**:
   ```typescript
   getKnowledgeBaseContext("US Cervical - Tireoide", ["Nódulo Tireoidiano"])
   ```
5. **Retorna frases técnicas exatas**:
   ```
   "Nódulo tireoidiano, circunscrito, sem halo hipoecóico ou calcificações..."
   ```
6. **IA recebe contexto enriquecido** e gera laudo usando as frases técnicas
7. **Laudo profissional** com terminologia do Compêndio da Radiologia

### **Exemplo de Prompt Gerado**

```
Você é um radiologista experiente...

CONHECIMENTO MÉDICO (Compêndio da Radiologia):
Use EXATAMENTE estas frases técnicas:

- Tireoide - Nódulo Tireoidiano: "Nódulo tireoidiano, circunscrito, 
  sem halo hipoecóico ou calcificações, localizado no terço médio 
  do lobo tireoidiano direito."
  
  Conclusão: "Nódulo tireoidiano. Sugere-se avaliação endocrinológica 
  e, se necessário, punção aspirativa por agulha fina (PAAF)."

DADOS DO PACIENTE:
- Tipo de exame: US Cervical - Tireoide
- Achados: Nódulo Tireoidiano

GERE LAUDO USANDO AS FRASES TÉCNICAS FORNECIDAS...
```

---

## 📊 Exemplo de Laudo Gerado

### **Input**
- Exame: US Cervical - Tireoide
- Achados: Nódulo Tireoidiano (lobo direito, 1,2 cm, hipoecogênico, com halo)

### **Output da IA**

```
TÉCNICA:
Exame realizado com transdutor linear de alta frequência na 
modalidade bidimensional e modo Doppler colorido.

RELATÓRIO:
Tireoide apresenta dimensões normais e contornos regulares.
Observa-se nódulo tireoidiano no lobo direito, localizado em 
seu terço médio, de aspecto hipoecogênico, circunscrito, medindo 
aproximadamente 1,2 cm em seu maior diâmetro, apresentando halo 
hipoecóico periférico, sem evidência de microcalcificações ao 
presente estudo.
O lobo esquerdo apresenta ecotextura homogênea e simétrica, 
sem nódulos ou cistos.
Ao mapeamento dúplex-Doppler colorido, a vascularização 
tireoidiana encontra-se dentro dos padrões habituais.

CONCLUSÃO:
Nódulo tireoidiano no lobo direito, conforme descrito.
Sugere-se avaliação endocrinológica e, se necessário, 
punção aspirativa por agulha fina (PAAF) para classificação 
citológica (TI-RADS).
```

---

## 🎯 Benefícios do Sistema

### **Para o Médico**
✅ Laudos profissionais em segundos
✅ Terminologia técnica padronizada
✅ Baseado no Compêndio da Radiologia (fonte confiável)
✅ Zero dependência de internet
✅ Privacidade total dos dados

### **Para o Paciente**
✅ Laudos mais claros e profissionais
✅ Linguagem médica adequada
✅ Conclusões e orientações específicas

### **Para a Clínica**
✅ Aumento da produtividade
✅ Padronização de laudos
✅ Redução de erros de digitação
✅ Melhor qualidade técnica

---

## 🔍 Testando a Integração

### **Teste 1: Laudo Normal**
1. Selecione: "US Abdome - Total"
2. Marque todos os achados como "Normal"
3. Clique em "Gerar com IA"
4. ✅ Deve gerar laudo completo descrevendo todos os órgãos sem alterações

### **Teste 2: Laudo com Achados**
1. Selecione: "US Pelve Feminina"
2. Marque: "Mioma Uterino" (múltiplos, 3 cm, intramural)
3. Marque: "Cisto Ovariano" (direito, 2,5 cm, simples)
4. Clique em "Gerar com IA"
5. ✅ Deve gerar laudo usando frases técnicas exatas do Knowledge Base

### **Teste 3: Laudo Obstétrico**
1. Selecione: "US Obstétrico - 1º Trimestre"
2. Marque: "Gestação Viável" (CCN 45mm)
3. Clique em "Gerar com IA"
4. ✅ Deve calcular idade gestacional e gerar laudo obstétrico completo

---

## 🐛 Troubleshooting

### **Problema: IA não está gerando laudos**
**Solução**: Verificar se Ollama está rodando
```bash
# Windows PowerShell
ollama serve

# Verificar status
Invoke-WebRequest -Uri http://localhost:11434/api/tags
```

### **Problema: Laudos sem terminologia técnica**
**Solução**: Verificar se o import do Knowledge Base está correto
```typescript
import KNOWLEDGE_BASE from '@/data/knowledgeBase';
```

### **Problema: Achados não aparecem no dropdown**
**Solução**: Verificar se examDefinitionsExpanded foi importado
```typescript
import EXPANDED_EXAM_DEFINITIONS from '@/data/examDefinitionsExpanded';
```

### **Problema: Erro ao buildar**
**Solução**: Verificar imports e paths
```bash
npm run build
# Se erro de tipo, verificar interfaces
```

---

## 📦 Arquivos Modificados

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `src/data/knowledgeBase.ts` | ✅ CRIADO | Base de conhecimento completa (44KB) |
| `src/data/examDefinitionsExpanded.ts` | ✅ CRIADO | Definições expandidas (22KB) |
| `src/utils/aiReportGenerator.ts` | ✅ ATUALIZADO | IA com knowledge base integration |
| `KNOWLEDGE_BASE_EXPANDIDA.md` | ✅ CRIADO | Documentação completa |
| `INTEGRACAO_SISTEMA_EXPANDIDO.md` | ✅ CRIADO | Este guia de integração |

---

## 🚀 Próximos Passos

### **Fase 1: UI Integration** (Você está aqui)
- [ ] Atualizar UltrasoundReportGenerator.tsx
- [ ] Adicionar novos dropdowns de exames
- [ ] Implementar campos de metadados (lateralidade, quantidade, características)
- [ ] Testar geração de laudos

### **Fase 2: Otimização**
- [ ] Adicionar busca por achado
- [ ] Implementar auto-complete de medidas
- [ ] Criar templates pré-configurados
- [ ] Adicionar botão "Copiar laudo"

### **Fase 3: Expansão**
- [ ] Adicionar US Crânio
- [ ] Adicionar US Tórax
- [ ] Adicionar US MSK
- [ ] Adicionar US Partes Moles
- [ ] Adicionar US Pelve Masculina

### **Fase 4: Recursos Avançados**
- [ ] Sistema de favoritos de achados
- [ ] Histórico de laudos gerados
- [ ] Exportação com imagens
- [ ] Assinatura digital
- [ ] Integração com PACS

---

## 💡 Dicas de Uso

### **Para Médicos**
1. **Comece simples**: Use os exames mais comuns (Abdome, Pelve, Tireoide)
2. **Revise sempre**: A IA auxilia, mas você é o responsável pelo laudo
3. **Personalize**: Adicione observações específicas quando necessário
4. **Use características**: Marque as características dos achados para laudos mais precisos

### **Para Desenvolvedores**
1. **Mantenha o Knowledge Base atualizado**: Adicione novos achados conforme necessário
2. **Teste com dados reais**: Use casos reais para validar as frases técnicas
3. **Monitor de performance**: Verifique tempos de resposta da IA
4. **Backup**: Mantenha backup dos laudos gerados

---

## 📞 Suporte

**Documentação Completa**: Ver `KNOWLEDGE_BASE_EXPANDIDA.md`  
**Setup da IA**: Ver `OLLAMA_SETUP.md`  
**README da IA**: Ver `README_IA.md`  
**Guia Prático**: Ver `GUIA_PRATICO_IA.md`

---

**Versão**: 2.0 - Sistema Expandido  
**Última Atualização**: $(date)  
**Status**: Pronto para integração ✅
