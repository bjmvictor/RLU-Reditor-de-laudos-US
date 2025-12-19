# 🎯 Sistema Expandido - Base de Conhecimento Médico

## 📋 Visão Geral

O sistema FlowUS agora conta com uma base de conhecimento médico completa baseada no **Compêndio da Radiologia**, incluindo:

✅ **80+ achados ultrassonográficos diferentes**  
✅ **Frases técnicas profissionais em português**  
✅ **Estrutura hierárquica completa**  
✅ **Integração com IA local (Ollama)**

---

## 🗂️ Estrutura da Base de Conhecimento

### **Arquivos Criados**

1. **`src/data/knowledgeBase.ts`** (44KB)
   - Base de dados completa do Compêndio da Radiologia
   - Estrutura: Categoria → Região → Órgão → Achados
   - Inclui textos técnicos exatos das fontes médicas
   - 80+ findings com características detalhadas

2. **`src/data/examDefinitionsExpanded.ts`** (22KB)
   - Definições expandidas de exames para o editor
   - Pronto para integração no UltrasoundReportGenerator
   - Mantém compatibilidade com código existente

---

## 📚 Categorias Disponíveis

### **ULTRASSOM GERAL**

#### 🔹 **US Cervical - Tireoide**
- **Tireoide**: Normal, Tireoidite Autoimune (Hashimoto), Nódulo, Cisto, Hipotireoidismo
- **Glândulas Submandibulares**: Normal, Sialoadenite
- **Linfonodos Cervicais**: Normal, Linfondomegalia
- **Glândulas Parótidas**: Normal, Parotidite

#### 🔹 **US Abdome - Total**
- **Fígado**: Normal, Esteatose, Hepatopatia, Cirrose, Cisto, Hemangioma, Calcificação, Hipertensão Portal
- **Vesícula Biliar**: Normal, Colelitíase, Bile Tumefacta, Pólipo, Colecistite, Pós-Colecistectomia
- **Pâncreas**: Normal, Avaliação Prejudicada
- **Baço**: Normal, Esplenomegalia, Baço Acessório, Cisto, Calcificação
- **Rins**: Normal, Cisto Renal, Cálculo, Ectasia Pielocalicial, Nefropatia Crônica, Pielonefrite, Rim Pélvico
- **Bexiga**: Normal, Cálculo, Espessamento Parietal

#### 🔹 **US Pelve Feminina**
- **Útero**: Normal, Mioma, Adenomiose
- **Endométrio**: Normal, Pólipo, Hiperplasia
- **Ovários**: Normal, Cisto Simples, Cisto Hemorrágico, Cisto de Corpo Lúteo, Endometrioma
- **Colo Uterino**: Normal, Cistos de Naboth
- **DIU**: DIU Tópico, DIU Mal Posicionado

---

### **ULTRASSOM OBSTÉTRICO**

#### 🔹 **US Obstétrico - 1º Trimestre**
- **Gestação**: Inicial, Viável, Anembrionada, Morte Embrionária, Aborto Retido, Descolamento Ovular, Gemelar, Ectópica

#### 🔹 **US Obstétrico - 2º/3º Trimestre**
- **Biometria Fetal**: Adequada, RCIU, Macrossomia
- **Placenta**: Tópica, Prévia, Descolamento
- **Líquido Amniótico**: Normal, Oligoidrâmnio, Polidrâmnio
- **Colo Uterino**: Normal, Curto, Orifício Interno Aberto
- **Morfologia Fetal**: Normal, Hérnia Diafragmática, Espinha Bífida, Pé Torto, Gastrosquise

---

## 🔬 Características dos Achados

### **Metadados Disponíveis**

Cada achado possui:

```typescript
{
  id: string;                    // Identificador único
  label: string;                 // Nome do achado
  description: string;           // Descrição médica
  requiresSize?: boolean;        // Requer medida (mm/cm)
  hasLaterality?: boolean;       // Lateralidade (D/E/Bilateral)
  hasQuantity?: boolean;         // Quantidade (único/múltiplos)
  hasCharacteristics?: string[]; // Características adicionais
  alteredText: string;           // Texto técnico completo
  conclusionText?: string;       // Conclusão específica
  observations?: string;         // Observações clínicas
  measurements?: {               // Medidas esperadas
    name: string;
    unit: string;
    normalRange?: string;
  }[];
}
```

### **Exemplos de Textos Técnicos**

#### **Tireoidite de Hashimoto**
```
"Parênquima apresenta textura heterogênea, observando-se áreas de 
menor ecogenicidade de permeio de limites mal definidos (podendo 
traduzir áreas de infiltrado linfocítico). Ao mapeamento dúplex-Doppler 
colorido, observa-se vascularização difusamente aumentada."
```

#### **Esteatose Hepática**
```
"Fígado de dimensões normais, contornos regulares, apresentando aumento 
difuso da ecogenicidade do parênquima, com atenuação do feixe acústico 
posterior, sem a caracterização de lesões focais bem definidas."
```

#### **Cirrose Hepática**
```
"Fígado de dimensões reduzidas, com sinais de hipertrofia compensatória 
dos lobos caudado e esquerdo. Apresenta contornos serrilhados e 
ecotextura difusamente heterogênea."
```

#### **Colelitíase**
```
"Vesícula biliar normodistendida, de paredes finas, apresentando 
cálculo(s) móvel(is) em seu interior."
```

#### **Gestação Anembrionada**
```
"Formação cística na cavidade uterina com reação decidual marginal, 
sugestiva de saco gestacional. Não se observa embrião ou vesícula 
vitelínica."
```

---

## 🤖 Integração com IA (Ollama)

### **Como a IA Utiliza a Base de Conhecimento**

1. **Análise de Contexto**: A IA identifica o tipo de exame solicitado
2. **Busca de Conhecimento**: Consulta a base para achados específicos
3. **Geração de Prompt**: Incorpora terminologia técnica exata do Compêndio
4. **Geração de Laudo**: Produz texto profissional seguindo padrões médicos

### **Modelos Ollama Recomendados**

```bash
# Modelo padrão (recomendado)
ollama pull mistral

# Alternativas
ollama pull neural-chat
ollama pull openchat
ollama pull zephyr
```

### **Exemplo de Prompt Gerado**

```
Você é um médico radiologista experiente. Gere um laudo ultrassonográfico 
profissional em português brasileiro.

TIPO DE EXAME: Ultrassom de Tireoide
ACHADOS: Nódulo tireoidiano no lobo direito

CONHECIMENTO MÉDICO:
- Para nódulos tireoidianos, utilizar a descrição: "Nódulo tireoidiano, 
  circunscrito, sem halo hipoecóico ou calcificações..."
- Conclusão padrão: "Nódulo tireoidiano. Sugere-se avaliação 
  endocrinológica e, se necessário, PAAF."

ESTRUTURA DO LAUDO:
1. Técnica
2. Achados (use terminologia exata)
3. Conclusão
```

---

## 📊 Estatísticas da Base

| Categoria | Regiões | Órgãos | Achados |
|-----------|---------|--------|---------|
| US Geral - Cervical | 1 | 4 | 12 |
| US Geral - Abdome | 1 | 6 | 38 |
| US Geral - Pelve Feminina | 1 | 5 | 15 |
| US Obstétrico - 1º Trimestre | 1 | 1 | 8 |
| US Obstétrico - 2º/3º Trimestre | 1 | 5 | 17 |
| **TOTAL** | **5** | **21** | **90** |

---

## 🎨 Características Especiais

### **Lateralidade (hasLaterality)**
Achados que podem ser:
- Direito (D)
- Esquerdo (E)
- Bilateral

**Exemplos**: Nódulo tireoidiano, Cisto renal, Cisto ovariano, Hidronefrose

### **Quantidade (hasQuantity)**
Achados que podem ser:
- Único
- Múltiplos

**Exemplos**: Cálculos, Nódulos, Cistos, Miomas

### **Tamanho (requiresSize)**
Achados que necessitam medidas:
- Nódulos (mm/cm)
- Cistos (mm/cm)
- Cálculos (mm)
- Órgãos aumentados (cm)

### **Características Adicionais (hasCharacteristics)**
Arrays de opções para seleção:

**Nódulo Tireoidiano**:
- Hipoecogênico, Isoecogênico, Hiperecogênico
- Heterogêneo, Circunscrito
- Com halo, Sem halo
- Com microcalcificações, Sem microcalcificações

**Mioma Uterino**:
- Intramural
- Subseroso
- Submucoso
- Pediculado

---

## 🔄 Como Atualizar o Sistema

### **Para Adicionar Novos Achados**

1. **Edite `knowledgeBase.ts`**:
```typescript
{
  id: "novo-achado",
  label: "Nome do Achado",
  description: "Descrição",
  requiresSize: true,  // se necessário
  hasLaterality: true, // se necessário
  alteredText: "Texto técnico completo do achado...",
  conclusionText: "Conclusão específica.",
  observations: "Observações clínicas adicionais"
}
```

2. **Edite `examDefinitionsExpanded.ts`**:
```typescript
{
  id: "novo-achado",
  label: "Nome do Achado",
  requiresSize: true,
  alteredText: "Texto técnico...",
  conclusionText: "Conclusão..."
}
```

### **Para Adicionar Novo Tipo de Exame**

1. **Adicione categoria em `knowledgeBase.ts`**
2. **Crie definição em `examDefinitionsExpanded.ts`**
3. **Atualize o dropdown no componente**

---

## 📖 Fontes

Toda base de conhecimento foi extraída de:

🔗 **Compêndio da Radiologia**
- [US Geral](https://sites.google.com/site/compendiodaradiologia/us-geral)
- [US Obstétrico](https://sites.google.com/site/compendiodaradiologia/us-obstetrico)
- [Frases - Cervical](https://sites.google.com/site/compendiodaradiologia/us-geral/frase-cervical)
- [Frases - Abdome](https://sites.google.com/site/compendiodaradiologia/us-geral/frases-abdome)
- [Frases - Pelve Feminina](https://sites.google.com/site/compendiodaradiologia/us-geral/frases-pelve-feminina)
- [Frases - Obstétrico](https://sites.google.com/site/compendiodaradiologia/us-obstetrico/frases-obstetrico)

---

## ✅ Próximos Passos

### **Fase 1: Integração com UI** ⏳
- [ ] Atualizar UltrasoundReportGenerator.tsx para usar examDefinitionsExpanded
- [ ] Criar dropdown hierárquico (Categoria > Tipo de Exame)
- [ ] Implementar seleção de características adicionais
- [ ] Adicionar campos para lateralidade e quantidade

### **Fase 2: Treinamento da IA** 🎯
- [ ] Atualizar buildPrompt() em aiReportGenerator.ts
- [ ] Incluir contexto do knowledgeBase nas requisições Ollama
- [ ] Implementar sistema de matching de achados
- [ ] Testar geração de laudos com novos dados

### **Fase 3: Expansão** 🚀
- [ ] Adicionar US Cranio
- [ ] Adicionar US Tórax
- [ ] Adicionar US MSK (Musculoesquelético)
- [ ] Adicionar US Partes Moles
- [ ] Adicionar US Pelve Masculina

### **Fase 4: Otimização** ⚡
- [ ] Sistema de busca por achado
- [ ] Auto-complete de medidas
- [ ] Templates pré-configurados
- [ ] Exportação com imagens

---

## 🎓 Glossário Médico

| Termo | Significado |
|-------|-------------|
| **Anecóico** | Sem ecos internos (preto no US) |
| **Hipoecogênico** | Poucos ecos (cinza escuro) |
| **Isoecogênico** | Ecogenicidade igual ao tecido normal |
| **Hiperecogênico** | Muitos ecos (branco/claro) |
| **Heterogêneo** | Ecotextura irregular/variada |
| **Ecotextura** | Padrão de textura ao ultrassom |
| **Parênquima** | Tecido funcional do órgão |
| **Cortical** | Região externa do órgão |
| **Pielocalicial** | Sistema coletor do rim |
| **Anteversoflexão** | Útero inclinado para frente |
| **Retroversoflexão** | Útero inclinado para trás |
| **ILA** | Índice de Líquido Amniótico |
| **CCN** | Comprimento Cabeça-Nádega |
| **DBP** | Diâmetro Biparietal |
| **RCIU** | Restrição de Crescimento Intrauterino |
| **PAAF** | Punção Aspirativa por Agulha Fina |

---

## 📞 Suporte

Para dúvidas sobre:
- **Conteúdo Médico**: Consultar Compêndio da Radiologia
- **Integração Técnica**: Ver documentação em `/docs`
- **IA (Ollama)**: Ver OLLAMA_SETUP.md e README_IA.md

---

**Documentação gerada em**: $(date)  
**Versão**: 2.0 - Expansão Completa  
**Status**: Base de conhecimento implementada ✅
