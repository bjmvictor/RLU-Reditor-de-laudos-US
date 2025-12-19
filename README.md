
# FlowUS - Reditor de Laudos

Aplicação web para criação rápida e padronizada de laudos de ultrassonografia com sistema completo de autenticação, controle de acesso e personalização.

## Funcionalidades

### Autenticação e Controle de Acesso
- Login seguro com usuário/senha
- Sistema de papéis (roles) e permissões (RBAC)
- Usuário padrão: `admin` / `admin`
- Gerenciamento completo de usuários (criar, editar, bloquear)
- Controle granular de permissões por papel

### Gerenciamento
- **Usuários**: Cadastro com nome, CRM (opcional), papéis e status
- **Papéis**: Criação de papéis personalizados com permissões específicas
- **Configurações**: Personalização da unidade (nome, endereço, telefone, logo, cores)

### Gerador de Laudos
- Preenchimento automático dos dados do médico logado
- Múltiplos tipos de exame (Abdominal Total, Tireoide, Pélvico, Mamas, etc.)
- Interface intuitiva para seleção de achados
- Geração automática de texto padronizado
- Edição livre do laudo antes de salvar

### Exportação e Persistência
- **Salvar localmente**: Laudos salvos no navegador (localStorage)
- **Gerenciar laudos**: Listar, carregar e excluir laudos salvos
- **PDF Profissional**: 
  - Cabeçalho com dados da unidade personalizado
  - Rodapé com assinatura digital (nome e CRM do médico)
  - Numeração de páginas
  - Layout profissional com cores configuráveis

### Interface
- Temas claro/escuro
- Design responsivo e moderno
- Navegação intuitiva com navbar contextual
- Gradientes suaves e paleta de cores personalizável

## Requisitos
- Node.js 18+ (recomendado)

## Instalação
```powershell
cd "C:\Users\benjamin.vieira\Documents\FlowUS\FlowUS - Reditor de Laudos"
npm install
```

## Desenvolvimento
```powershell
npm run dev
```
Acesse a aplicação no endereço indicado pelo Vite (ex.: http://localhost:8080).

## Build de Produção
```powershell
npm run build
npm run preview
```

## Estrutura do Projeto
```
src/
├── components/       # Componentes reutilizáveis (Navbar, ProtectedRoute)
├── contexts/         # Contextos React (AuthContext)
├── pages/           # Páginas da aplicação
│   ├── Login.tsx
│   ├── Index.tsx
│   ├── UltrasoundReportGenerator.tsx
│   ├── UsersManagement.tsx
│   ├── RolesManagement.tsx
│   └── Settings.tsx
├── types/           # Definições TypeScript
├── utils/           # Utilitários (auth, storage)
└── App.tsx          # Rotas e configuração principal
```

## Papéis Padrão
- **Administrador**: Acesso total (gerenciar usuários, papéis, configurações, laudos)
- **Médico**: Criar e editar laudos
- **Usuário**: Apenas visualizar laudos

## Permissões Disponíveis
- `view_reports`: Visualizar Laudos
- `create_reports`: Criar Laudos
- `edit_reports`: Editar Laudos
- `delete_reports`: Excluir Laudos
- `manage_users`: Gerenciar Usuários
- `manage_roles`: Gerenciar Papéis
- `manage_settings`: Gerenciar Configurações

## Uso Básico
1. Faça login com `admin` / `admin`
2. Configure a unidade em **Configurações** (nome, endereço, logo)
3. Crie usuários médicos em **Usuários** (com CRM)
4. Acesse **Laudos** para criar um novo laudo
5. Selecione o tipo de exame e marque os achados
6. Gere, edite, salve e exporte em PDF profissional

## Licença
Uso interno FlowUS. Ajustar conforme necessidade.

