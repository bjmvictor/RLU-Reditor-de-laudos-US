# Configuração da IA Local (Ollama)

## O que é Ollama?

Ollama permite executar modelos de IA grandes localmente no seu computador, sem depender de APIs externas ou internet. Perfeito para análise de laudos médicos com privacidade total.

## Instalação

### 1. Baixar e Instalar Ollama

Acesse: https://ollama.ai

- **Windows**: Baixe o instalador `.exe`
- **Mac**: Baixe a versão para seu chip (Intel ou Apple Silicon)
- **Linux**: Use o script de instalação

### 2. Depois de Instalar

Abra um terminal/PowerShell e execute:

```bash
ollama pull mistral
```

Isso baixará o modelo **Mistral 7B** (~4.1GB), que é otimizado para português e gera textos bem estruturados.

**Modelos alternativos recomendados:**

- `ollama pull neural-chat` - Otimizado para diálogos e instruções
- `ollama pull openchat` - Rápido e eficiente
- `ollama pull zephyr` - Bom para português técnico
- `ollama pull dolphin-mixtral` - Maior capacidade (precisa de mais RAM)

### 3. Iniciar o Servidor Ollama

```bash
ollama serve
```

O servidor iniciará na porta `11434`. Deixe rodando em background enquanto usar o FlowUS.

**No Windows PowerShell**, você pode:
- Abrir outra janela de PowerShell e deixar `ollama serve` rodando
- Ou iniciar como serviço (Ollama instala como serviço automático)

## Usar no FlowUS

1. Certifique-se de que `ollama serve` está rodando
2. Abra o editor de laudos
3. Selecione seus achados/findings
4. Clique em "Gerar Laudo com IA Local"
5. A IA gerará um laudo profissional baseado nos dados do paciente

## Configuração Avançada

### Usar Modelo Específico

Edite `.env.local` na raiz do projeto:

```env
VITE_OLLAMA_MODEL=mistral
```

Substitua `mistral` por outro modelo se desejar.

### Otimizar Desempenho

Se o gerador ficar lento:

1. **Reduzir tamanho do modelo**: Use `ollama pull neural-chat` (menor, mais rápido)
2. **Aumentar RAM alocada**: Ollama usa RAM automaticamente até o limite
3. **Usar GPU**: Se tiver NVIDIA/AMD com drivers corretos, Ollama usará GPU automaticamente

### Personalizar Comportamento da IA

No arquivo `src/utils/aiReportGenerator.ts`, você pode ajustar parâmetros:

```typescript
async function generateReportViaOllama(patientData: PatientData): Promise<GeneratedReport> {
  const response = await fetch(OLLAMA_API_URL, {
    method: "POST",
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      temperature: 0.6,        // 0-1: Lower = mais determinístico, Higher = mais criativo
      num_predict: 1000,       // Máximo de tokens a gerar
      top_k: 40,              // Variedade do vocabulário
      top_p: 0.9,             // Probabilidade cumulativa
      repeat_penalty: 1.1,    // Penalizar repetição
    }),
  });
  // ...
}
```

## Solução de Problemas

### "Ollama não está disponível"

**Verificar se está rodando:**
```bash
curl http://localhost:11434/api/tags
```

Deve retornar uma lista de modelos.

### Geração lenta

- Está usando um modelo muito grande
- Sua RAM não é suficiente (4GB mínimo)
- Try `ollama pull neural-chat` - mais rápido

### Modelo não encontrado

```bash
ollama pull <nome-do-modelo>
ollama list  # Ver modelos instalados
```

## Modelos Recomendados para Laudos Médicos

| Modelo | Tamanho | Velocidade | Qualidade | Português |
|--------|---------|-----------|-----------|-----------|
| neural-chat | 4.7GB | ⚡⚡⚡ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| mistral | 4.1GB | ⚡⚡⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| openchat | 3.8GB | ⚡⚡⚡ | ⭐⭐⭐ | ⭐⭐⭐ |
| zephyr | 4.2GB | ⚡⚡⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Recomendação**: Use `mistral` para melhor balanço entre qualidade e velocidade.

## Privacidade e Dados

✓ **Totalmente privado**: Todos os dados ficar no seu computador  
✓ **Sem envio de dados**: Nenhuma informação de paciente é enviada para servidores externos  
✓ **LGPD Compliant**: Perfeito para dados sensíveis de saúde  
✓ **Offline**: Funciona sem internet após modelo estar baixado

## Treinar Modelo Customizado (Avançado)

Se quiser treinar um modelo específico para seus laudos:

```bash
ollama create meu-modelo-medico -f Modelfile
```

Crie um `Modelfile`:
```
FROM mistral
PARAMETER temperature 0.5
PARAMETER top_k 40
PARAMETER top_p 0.9
SYSTEM Você é um radiologista especializado em ultrassonografia...
```

---

**Suporte**: Se encontrar problemas, verifique:
- Terminal mostra `ollama serve` rodando
- Ollama responde em `http://localhost:11434/api/tags`
- Modelo foi baixado com `ollama pull <modelo>`
