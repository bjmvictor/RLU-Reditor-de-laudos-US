# FlowUS - Reditor de Laudos de Ultrassonografia
## Com Geração Dinâmica de Laudos via IA Local

Aplicação moderna para geração de laudos de ultrassonografia com suporte a **IA local** (Ollama) para gerar textos profissionais e dinâmicos, sem depender de APIs externas.

---

## ✨ Features

- ✅ **Autenticação & RBAC**: Sistema completo de login, gestão de usuários e papéis
- ✅ **IA Local (Ollama)**: Gera laudos dinâmicos localmente, sem internet
- ✅ **Múltiplos Tipos de Exame**: Abdominal, Tireoide, Pélvico, Mamas, etc.
- ✅ **Achados Customizáveis**: Seleção de findings com tamanho, lateralidade e quantidade
- ✅ **Edição de Laudos**: Revise e ajuste laudos gerados pela IA
- ✅ **Geração PDF Profissional**: PDFs com header, footer, assinatura digital
- ✅ **Meus Laudos**: Histó rico e gerenciamento de laudos salvos
- ✅ **Configurações da Unidade**: Dados da clínica, cores, logo
- ✅ **Tema Claro/Escuro**: Interface responsiva e moderna
- ✅ **Offline First**: Tudo funciona localmente com localStorage

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- **Ollama** (para usar IA local) - [Instalar](https://ollama.ai)

### 1. Instalação

```bash
git clone https://github.com/bjmvictor/RLU-Reditor-de-laudos-US.git
cd "FlowUS - Reditor de Laudos"
npm install
```

### 2. Setup de IA Local (Ollama)

```bash
# 1. Instale Ollama em https://ollama.ai
# 2. Abra PowerShell/Terminal e execute:
ollama pull mistral

# 3. Inicie o servidor Ollama (deixe rodando):
ollama serve

# 4. Em outra janela, inicie o dev server:
npm run dev
```

**Nota**: O servidor Ollama precisa estar rodando (`ollama serve`) enquanto você usa o FlowUS!

### 3. Desenvolvimento

```bash
npm run dev          # Inicia em http://localhost:5173
npm run build        # Build para produção
npm run preview      # Preview do build
```

---

## 🔐 Login Padrão

**Usuário**: `admin`  
**Senha**: `admin`

Use este acesso para gerenciar usuários, papéis e configurações.

---

## 📖 Como Usar a IA Local

### Gerar Laudo com IA

1. **Selecione o tipo de exame** (Abdominal Total, Tireoide, etc.)
2. **Insira dados do paciente** (nome, idade, gênero, indicação clínica)
3. **Selecione os achados** (Normal, nódulos, cálculos, etc.)
4. **Clique "Gerar Laudo com IA Local"**
   - A IA local processará e gerará um laudo profissional
   - Sem dependência de internet
   - Sem envio de dados para servidor externo

### Editar Laudo

O laudo gerado pode ser editado no campo de texto antes de salvar ou exportar PDF.

### Salvar e Exportar

- **Salvar**: Armazena na seção "Meus Laudos" (localStorage)
- **Baixar PDF**: Gera PDF profissional com cabeçalho da unidade, assinatura digital e página

---

## 🤖 Configuração da IA Local

### Modelos Disponíveis

Você pode trocar de modelo alterando `VITE_OLLAMA_MODEL` no `.env.local`:

| Modelo | Tamanho | Velocidade | Qualidade | Português |
|--------|---------|-----------|-----------|-----------|
| **mistral** (padrão) | 4.1GB | ⚡⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| neural-chat | 4.7GB | ⚡⚡⚡ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| openchat | 3.8GB | ⚡⚡⚡ | ⭐⭐⭐ | ⭐⭐⭐ |
| zephyr | 4.2GB | ⚡⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### Instalar Novo Modelo

```bash
ollama pull <nome-do-modelo>
ollama list  # Ver modelos instalados
```

### Customizar Comportamento

Edite `src/utils/aiReportGenerator.ts` para ajustar:
- `temperature`: Criatividade (0-1, padrão 0.6)
- `num_predict`: Tamanho máximo do laudo (padrão 1000)
- `top_k`, `top_p`: Variedade e coerência
- `repeat_penalty`: Reduzir repetição

---

## 📁 Estrutura do Projeto

```
src/
├── pages/
│   ├── Login.tsx                    # Página de autenticação
│   ├── Index.tsx                    # Home
│   ├── UltrasoundReportGenerator.tsx # Editor de laudos (Principal)
│   ├── UsersManagement.tsx          # Gerenciamento de usuários
│   ├── RolesManagement.tsx          # Gestão de papéis e permissões
│   └── Settings.tsx                 # Configurações da unidade
├── components/
│   ├── Navbar.tsx                   # Navegação
│   ├── ProtectedRoute.tsx           # Rotas protegidas por permissão
│   └── AIReportGenerator.tsx        # Componente de IA (NOVO!)
├── contexts/
│   └── AuthContext.tsx              # Context de autenticação
├── utils/
│   ├── auth.ts                      # Lógica de autenticação
│   ├── storage.ts                   # Persistência de laudos
│   └── aiReportGenerator.ts         # IA local com Ollama (NOVO!)
└── types/
    └── index.ts                     # Types TypeScript
```

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Ollama
VITE_OLLAMA_MODEL=mistral
```

Se deixar vazio ou não usar Ollama, o app utilizará templates automáticos.

---

## 🔒 Segurança & Privacidade

✅ **Dados Locais**: Tudo é armazenado no localStorage do navegador  
✅ **Sem Upload**: Nenhuma informação de paciente é enviada para a internet  
✅ **IA Offline**: Ollama roda localmente, sem dependência de APIs  
✅ **LGPD Compliant**: Perfeito para dados sensíveis de saúde  
✅ **Sem Rastreamento**: Sem analytics ou coleta de dados

---

## 🆘 Solução de Problemas

### "Ollama não está disponível"

```bash
# Verifique se Ollama está rodando
curl http://localhost:11434/api/tags

# Se não responder, inicie:
ollama serve
```

### Geração de IA muito lenta

- Use um modelo menor: `ollama pull neural-chat`
- Aumente a RAM alocada (Ollama usa até a RAM disponível)
- Reduza `num_predict` em `aiReportGenerator.ts`

### Modelo não encontrado

```bash
ollama list              # Ver modelos instalados
ollama pull mistral      # Baixar modelo
```

---

## 📚 Documentação Adicional

- **[OLLAMA_SETUP.md](./OLLAMA_SETUP.md)** - Guia completo de configuração da IA local
- **Modelos de Laudos**: Baseados em [Compêndio da Radiologia](https://sites.google.com/site/compendiodaradiologia/)

---

## 📦 Tech Stack

- **React 18.3** + TypeScript
- **Vite 6.4** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Components
- **jsPDF** - PDF generation
- **Ollama** - Local AI (opcional)
- **React Router** - Navigation
- **Sonner** - Toast notifications

---

## 🚢 Deploy

### Build para Produção

```bash
npm run build      # Cria pasta dist/
npm run preview    # Testa o build localmente
```

Faça upload da pasta `dist/` para seu servidor.

### Observação Importante

Se usar em produção, você precisará de um servidor Ollama rodando separadamente. Considere:

1. **Servidor Ollama em máquina servidor**: Acesse via IP interno
2. **Ou**: Use API de terceiros (OpenAI, Hugging Face) como fallback
3. **Ou**: Apenas templates automáticos (sem IA)

---

## 👥 Contribuições

Contribuições são bem-vindas! Abra uma issue ou PR com suas ideias.

---

## 📄 Licença

MIT

---

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique o arquivo [OLLAMA_SETUP.md](./OLLAMA_SETUP.md)
2. Abra uma issue no GitHub
3. Consulte a documentação do [Ollama](https://ollama.ai)

---

**Desenvolvido com ❤️ para radiologistas que querem eficiência, privacidade e IA local.**
