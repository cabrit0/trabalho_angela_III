# AURA: The Digital Mirror 🕵️

Simulação imersiva de cibersegurança para estudantes do 9º ano.

## 🚀 Deploy

### Opção 1: Vercel CLI
```bash
cd aura-app
npx vercel
```

### Opção 2: GitHub + Vercel Dashboard
1. Push para GitHub
2. Importar projeto em vercel.com
3. Framework: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`

## 🛠️ Desenvolvimento Local

```bash
cd aura-app
npm install
npm run dev
```

## 📁 Estrutura

```
aura-app/
├── src/
│   ├── pages/          # Register, Act1-3, Boss, Report
│   ├── components/     # GlitchText, CRTVignette, etc.
│   ├── context/        # GameContext (estado global)
│   ├── hooks/          # useSound, useDeviceData
│   └── data/           # scenario.js (perguntas)
├── vercel.json         # Configuração Vercel
└── vite.config.js      # Configuração Vite
```

## ✨ Funcionalidades

- 30+ perguntas sobre phishing, passwords, privacidade
- Perguntas aleatórias (10 por ato)
- Respostas baralhadas
- Efeitos visuais: glitch, CRT, animações
- Feedback imediato com "Data Leak" overlay
- Relatório final com "scare" e debriefing educativo
