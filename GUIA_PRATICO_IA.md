# Guia Prático: Usando IA Local no FlowUS

## O que você precisa fazer para começar?

### Passo 1: Instale Ollama (5 minutos)

1. Acesse [ollama.ai](https://ollama.ai)
2. Baixe e instale para seu sistema operacional
3. Reinicie o computador se solicitado

### Passo 2: Baixe um Modelo (10-15 minutos)

Abra **PowerShell** (Windows) ou **Terminal** (Mac/Linux) e execute:

```powershell
ollama pull mistral
```

Isso vai baixar o modelo Mistral 7B (~4.1GB). Pode levar alguns minutos dependendo da sua internet.

### Passo 3: Inicie o Servidor Ollama

**Sempre que quiser usar a IA, execute:**

```powershell
ollama serve
```

Deixe este terminal aberto enquanto usar o FlowUS. Você verá algo como:

```
2025-01-19 10:30:45.123456 [api] loaded model in 2.4s
```

### Passo 4: Inicie o FlowUS

Em **outra janela de PowerShell**, navegue até a pasta do FlowUS:

```powershell
cd "C:\Users\benjamin.vieira\Documents\FlowUS\FlowUS - Reditor de Laudos"
npm run dev
```

Abra `http://localhost:5173` no navegador.

---

## Usando a IA para Gerar Laudos

### 1️⃣ Faça Login

- **Usuário**: `admin`
- **Senha**: `admin`

### 2️⃣ Vá para "Laudos Novos"

Clique em "Laudos Novos" no menu superior.

### 3️⃣ Preencha os Dados do Paciente

```
Nome do Paciente: João Silva
Idade: 45
Gênero: Masculino
Indicação Clínica: Dor abdominal recorrente
```

### 4️⃣ Selecione o Tipo de Exame

Escolha um dos tipos disponíveis:
- Ultrassom Abdominal Total
- Ultrassom de Tireoide
- Ultrassom Pélvico
- Ultrassom de Mamas
- Ultrassom de Abdome Superior
- Ultrassom de Vias Urinárias
- Ultrassom de Bolsa Escrotal

### 5️⃣ Marque os Achados

Selecione os findings que você observou no exame:

- Marque **"Fígado Normal"** se normal
- Ou marque **"Esteatose hepática"**, **"Nódulo hepático"**, etc. se houver alterações

Para achados com medidas, preencha o tamanho em mm.

### 6️⃣ Gere o Laudo com IA

Você verá um card azul chamado **"Gerar Laudo com IA Local"**:

- ✅ **Status verde** = Ollama está pronto
- ❌ **Status vermelho** = Ollama não está rodando (execute `ollama serve` em outro terminal)

Clique em **"Gerar Laudo Profissional"**.

### 7️⃣ Revise e Edite

O laudo gerado pela IA aparecerá no campo de texto abaixo. Você pode:

- **Editar** o texto livremente
- **Salvar** na seção "Meus Laudos"
- **Baixar PDF** com assinatura digital

---

## Exemplos de Laudos Gerados

### Exemplo 1: Achado Normal

**Dados:**
- Paciente: Maria Santos, 38 anos, F
- Exame: Ultrassom Abdominal Total
- Achados: Fígado Normal, Vesícula Biliar Normal, Rins Normais, Pâncreas Normal, Baço Normal

**Resultado (gerado pela IA):**

```
TÉCNICA:
Exame realizado com transdutor convexo multifrequencial na modalidade 
bidimensional, com análise da região abdominal superior e inferior.

RELATÓRIO:
Paciente com 38 anos, feminino.

Fígado com dimensões normais, ecotextura homogênea, sem nodulações ou 
alterações significativas.

Vesícula biliar com paredes finas e regulares, anecóica, sem cálculos, 
dilatação de vias biliares ou sinais de inflamação.

Rins com dimensões e contornos normais, ecotextura preservada, sem 
dilatação do sistema coletor, cálculos ou lesões focais.

Pâncreas com dimensões normais, contornos definidos e ecotextura 
homogênea.

Baço com dimensões normais e ecotextura característica, sem alterações 
estruturais.

CONCLUSÃO:
Ultrassom Abdominal Total sem alterações significativas. Achados 
compatíveis com a normalidade.
```

### Exemplo 2: Com Achados

**Dados:**
- Paciente: Carlos Oliveira, 62 anos, M
- Exame: Ultrassom Abdominal Total
- Achados: Esteatose hepática, Cálculos na Vesícula Biliar (3 unidades, 8mm)

**Resultado (gerado pela IA):**

```
TÉCNICA:
Exame realizado com transdutor convexo multifrequencial na modalidade 
bidimensional, com análise da região abdominal superior e inferior.

RELATÓRIO:
Paciente com 62 anos, masculino.

Fígado apresenta presença de esteatose hepática com aumento do grau de 
ecogenicidade do parênquima em relação ao córtex renal.

Vesícula biliar identificada contendo 3 cálculos medindo aproximadamente 
8 mm de diâmetro, com paredes não espessadas e ausência de sinais de 
inflamação.

CONCLUSÃO:
Ultrassom Abdominal Total com achados conforme descrito acima. Recomenda-se 
correlação clínica e seguimento conforme necessário.

Achados: Esteatose hepática e Colelitíase.
```

---

## ⚡ Dicas e Truques

### Trocar de Modelo de IA

Se achar o Mistral muito lento, use um modelo mais rápido:

```powershell
# Neural Chat é mais rápido
ollama pull neural-chat
```

Depois edite o arquivo `.env.local` na raiz do FlowUS:

```env
VITE_OLLAMA_MODEL=neural-chat
```

Reinicie o dev server (`npm run dev`).

### Usar IA Offline

Se não tiver Ollama instalado, o FlowUS usa templates automáticos. Funciona perfeitamente, mas menos dinâmico:

```
TÉCNICA:
Exame realizado com transdutor apropriado na modalidade bidimensional.

RELATÓRIO:
Fígado com dimensões e ecotextura normais.
Vesícula biliar de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.

CONCLUSÃO:
Achados compatíveis com normalidade.
```

### Melhorar Qualidade dos Laudos

Edite `src/utils/aiReportGenerator.ts` e procure por:

```typescript
temperature: 0.6,        // 👈 Aumentar para mais criatividade (até 1.0)
```

- **Baixo (0.3-0.5)**: Laudos mais consistentes e previsíveis
- **Médio (0.6-0.7)**: Balanço entre criatividade e consistência
- **Alto (0.8-1.0)**: Mais variado e criativo, mas menos previsível

---

## 🔧 Troubleshooting

### "Ollama não está disponível" - Status Vermelho

**Solução:**
1. Verifique se `ollama serve` está rodando em outro terminal
2. Se não estiver, execute:
   ```powershell
   ollama serve
   ```
3. Atualize a página do FlowUS (F5 ou Ctrl+R)

### Geração está muito lenta

**Solução:**
1. Feche outros programas que usem muita RAM
2. Use um modelo menor:
   ```powershell
   ollama pull neural-chat
   ollama pull openchat
   ```
3. Edite `.env.local` e mude para o modelo menor

### Modelo não foi encontrado

**Solução:**
```powershell
ollama pull mistral      # Baixar novamente
ollama list              # Ver modelos disponíveis
```

### Erro "Failed to connect to localhost:11434"

**Solução:**
- Verifique se `ollama serve` está rodando
- Se usar firewall, certifique-se que porta 11434 não está bloqueada
- Reinicie o serviço Ollama

---

## 📚 Próximos Passos

Agora que a IA está funcionando:

1. **Explore diferentes tipos de exame** - veja como a IA se adapta
2. **Customize seus laudos** - edite o texto gerado conforme necessário
3. **Salve seus laudos** - acesse em "Meus Laudos"
4. **Exporte PDFs** - gere documentos profissionais
5. **Configure sua clínica** - vá em "Configurações" para adicionar dados da unidade

---

## 💡 Entendo a Privacidade

✅ **NENHUM dado de paciente é enviado para a internet**
- Ollama roda localmente no seu computador
- Tudo fica em `http://localhost:11434` (apenas local)
- Os laudos são salvos no localStorage do navegador

**Isso significa:**
- Sem dependência de APIs externas
- Sem risco de vazamento de dados
- Sem limites de requisições
- Sem custos recorrentes
- Funciona até offline (após modelo baixado)

---

**Pronto para gerar seus primeiros laudos com IA local? 🚀**

Se encontrar problemas, consulte:
- [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) - Configuração avançada
- [README_IA.md](./README_IA.md) - Documentação técnica
- Documentação do Ollama: [ollama.ai](https://ollama.ai)
