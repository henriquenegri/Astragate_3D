# Three.js 3D Viewer

Visualizador de modelos 3D com controle por giroscópio para dispositivos móveis.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (HTTPS)
npm run dev
```

Acesse em:
- **Desktop:** https://localhost:5173/
- **Mobile:** https://[SEU-IP-LOCAL]:5173/

## 📦 Funcionalidades

- ✅ Carregamento de modelos 3D (GLB/GLTF)
- ✅ Controle por giroscópio (mobile)
- ✅ Câmera centralizada automaticamente
- ✅ HTTPS para acesso mobile na rede local

## 📱 Como Usar

1. Coloque seu modelo 3D em `/public/` (ex: `test.glb`)
2. Atualize o caminho em `src/main.ts`:
   ```typescript
   this.loadGLTFModel('/test.glb', new THREE.Vector3(0, 0, 0), 1)
   ```
3. Acesse pelo celular e ative o giroscópio

## 🛠️ Tecnologias

- Vite
- Three.js
- TypeScript
- Device Orientation API
