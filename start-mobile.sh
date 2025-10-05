#!/bin/bash

# Script para iniciar o servidor com acesso móvel
# Uso: ./start-mobile.sh

echo "🚀 Iniciando servidor Three.js + WebXR..."
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Obter IP local
LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1)

echo -e "${GREEN}✅ Servidor iniciado!${NC}"
echo ""
echo -e "${BLUE}📱 Acesse no celular (mesma rede Wi-Fi):${NC}"
echo -e "   ${YELLOW}http://${LOCAL_IP}:5173${NC}"
echo ""
echo -e "${BLUE}🌍 Para acessar de qualquer lugar (via internet):${NC}"
echo -e "   Execute em outro terminal: ${YELLOW}npx localtunnel --port 5173${NC}"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

# Iniciar Vite
npm run dev -- --host
