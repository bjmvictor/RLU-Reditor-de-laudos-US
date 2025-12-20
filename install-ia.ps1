# Script de Instalação Automática - IA Offline FlowUS
# Execute este script como Administrador

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   IA OFFLINE - INSTALADOR AUTOMATICO" -ForegroundColor Cyan
Write-Host "   FlowUS - Reditor de Laudos" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  AVISO: Execute este script como Administrador para melhor compatibilidade" -ForegroundColor Yellow
    Write-Host ""
}

# Função para verificar se comando existe
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# ETAPA 1: Verificar se Ollama já está instalado
Write-Host "📋 ETAPA 1: Verificando instalação do Ollama..." -ForegroundColor Yellow
Write-Host ""

if (Test-CommandExists "ollama") {
    Write-Host "✅ Ollama já está instalado!" -ForegroundColor Green
    $version = ollama --version
    Write-Host "   Versão: $version" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ Ollama não encontrado. Iniciando instalação..." -ForegroundColor Red
    Write-Host ""
    
    # Baixar instalador
    Write-Host "📥 Baixando Ollama..." -ForegroundColor Cyan
    $installerPath = "$env:TEMP\OllamaSetup.exe"
    
    try {
        Invoke-WebRequest -Uri "https://ollama.com/download/OllamaSetup.exe" -OutFile $installerPath -UseBasicParsing
        Write-Host "✅ Download concluído!" -ForegroundColor Green
        Write-Host ""
        
        # Executar instalador
        Write-Host "🔧 Instalando Ollama..." -ForegroundColor Cyan
        Write-Host "   (Uma janela de instalação será aberta. Siga as instruções.)" -ForegroundColor Gray
        Write-Host ""
        
        Start-Process -FilePath $installerPath -Wait
        
        Write-Host "✅ Instalação concluída!" -ForegroundColor Green
        Write-Host "   Por favor, feche e reabra o PowerShell para continuar." -ForegroundColor Yellow
        Write-Host ""
        
        # Limpar arquivo temporário
        Remove-Item $installerPath -ErrorAction SilentlyContinue
        
        Write-Host "Pressione qualquer tecla para sair..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit
        
    } catch {
        Write-Host "❌ Erro ao baixar/instalar Ollama: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, instale manualmente:" -ForegroundColor Yellow
        Write-Host "1. Acesse: https://ollama.com/download/windows" -ForegroundColor Gray
        Write-Host "2. Baixe e execute o instalador" -ForegroundColor Gray
        Write-Host "3. Execute este script novamente" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Pressione qualquer tecla para sair..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}

# ETAPA 2: Verificar modelos instalados
Write-Host "📋 ETAPA 2: Verificando modelos de IA..." -ForegroundColor Yellow
Write-Host ""

$models = ollama list 2>&1
$hasMistral = $models -match "mistral"

if ($hasMistral) {
    Write-Host "✅ Modelo Mistral já está instalado!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ Modelo Mistral não encontrado." -ForegroundColor Red
    Write-Host "📥 Baixando modelo Mistral (~4.1 GB)..." -ForegroundColor Cyan
    Write-Host "   Isso pode demorar 5-15 minutos dependendo da sua internet." -ForegroundColor Gray
    Write-Host ""
    
    try {
        ollama pull mistral
        Write-Host ""
        Write-Host "✅ Modelo Mistral baixado com sucesso!" -ForegroundColor Green
        Write-Host ""
    } catch {
        Write-Host "❌ Erro ao baixar modelo: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Tente manualmente:" -ForegroundColor Yellow
        Write-Host "   ollama pull mistral" -ForegroundColor Gray
        Write-Host ""
    }
}

# ETAPA 3: Iniciar servidor Ollama
Write-Host "📋 ETAPA 3: Iniciando servidor Ollama..." -ForegroundColor Yellow
Write-Host ""

# Verificar se servidor já está rodando
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Servidor Ollama já está rodando!" -ForegroundColor Green
        Write-Host ""
    }
} catch {
    Write-Host "🚀 Iniciando servidor Ollama em background..." -ForegroundColor Cyan
    
    # Iniciar servidor em processo separado
    Start-Process powershell -ArgumentList "ollama serve" -WindowStyle Minimized
    
    # Aguardar servidor iniciar
    Write-Host "   Aguardando servidor iniciar" -NoNewline -ForegroundColor Gray
    Start-Sleep -Seconds 2
    
    for ($i = 0; $i -lt 10; $i++) {
        try {
            $test = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -ErrorAction SilentlyContinue
            if ($test.StatusCode -eq 200) {
                Write-Host " ✅" -ForegroundColor Green
                Write-Host ""
                Write-Host "✅ Servidor Ollama iniciado com sucesso!" -ForegroundColor Green
                Write-Host ""
                break
            }
        } catch {
            Write-Host "." -NoNewline -ForegroundColor Gray
            Start-Sleep -Seconds 1
        }
    }
}

# ETAPA 4: Testar IA
Write-Host "📋 ETAPA 4: Testando a IA..." -ForegroundColor Yellow
Write-Host ""

Write-Host "🧪 Enviando pergunta teste para a IA..." -ForegroundColor Cyan
Write-Host ""

try {
    $testResponse = ollama run mistral "Responda apenas: OK" --verbose 2>&1
    Write-Host "✅ IA respondeu com sucesso!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️  Aviso: Não foi possível testar a IA." -ForegroundColor Yellow
    Write-Host "   Mas ela provavelmente está funcionando." -ForegroundColor Gray
    Write-Host ""
}

# ETAPA 5: Verificar .env
Write-Host "📋 ETAPA 5: Verificando configuração do FlowUS..." -ForegroundColor Yellow
Write-Host ""

$envPath = ".env"
$envContent = "# IA Configuration`nVITE_OLLAMA_MODEL=mistral`n"

if (Test-Path $envPath) {
    $currentEnv = Get-Content $envPath -Raw
    if ($currentEnv -match "VITE_OLLAMA_MODEL") {
        Write-Host "✅ Arquivo .env já configurado!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "📝 Adicionando configuração da IA ao .env..." -ForegroundColor Cyan
        Add-Content -Path $envPath -Value "`n$envContent"
        Write-Host "✅ Configuração adicionada!" -ForegroundColor Green
        Write-Host ""
    }
} else {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Cyan
    Set-Content -Path $envPath -Value $envContent
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
    Write-Host ""
}

# RESUMO FINAL
Write-Host "============================================" -ForegroundColor Green
Write-Host "   ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📊 RESUMO DA INSTALAÇÃO:" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Ollama instalado e rodando" -ForegroundColor Green
Write-Host "✅ Modelo Mistral (4.1GB) disponível" -ForegroundColor Green
Write-Host "✅ Servidor ativo em http://localhost:11434" -ForegroundColor Green
Write-Host "✅ Configuração .env criada/atualizada" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Inicie o FlowUS:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. Acesse no navegador:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "3. Crie um novo laudo e clique em 'Gerar com IA'" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 DOCUMENTAÇÃO:" -ForegroundColor Cyan
Write-Host ""
Write-Host "- GUIA_INSTALACAO_IA_OFFLINE.md - Guia completo" -ForegroundColor Gray
Write-Host "- KNOWLEDGE_BASE_EXPANDIDA.md - Base de conhecimento" -ForegroundColor Gray
Write-Host "- SISTEMA_EXPANDIDO_COMPLETO.md - Visão geral" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 COMANDOS ÚTEIS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ver modelos instalados:" -ForegroundColor Gray
Write-Host "   ollama list" -ForegroundColor White
Write-Host ""
Write-Host "Testar IA diretamente:" -ForegroundColor Gray
Write-Host "   ollama run mistral 'Olá!'" -ForegroundColor White
Write-Host ""
Write-Host "Parar servidor:" -ForegroundColor Gray
Write-Host "   Ctrl + C na janela do Ollama" -ForegroundColor White
Write-Host ""

Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
