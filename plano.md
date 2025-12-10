Aqui está o plano de desenvolvimento completo e detalhado para a plataforma AURA: The Digital Mirror.

Este plano foi desenhado para maximizar o impacto visual e a narrativa de "susto pedagógico", utilizando Vite + React para a performance e LocalStorage para a persistência da sessão.

Markdown

# 📂 plano.md - AURA: The Digital Mirror

## 1. Visão Geral do Projeto
**Objetivo:** Criar uma aplicação web imersiva (estilo terminal/hacker) que atua como um teste de diagnóstico de cibersegurança para alunos do 9º ano.
**Mecânica:** A app simula uma invasão ao dispositivo do aluno baseada nas respostas "erradas" (ingénuas), utilizando dados reais do browser para criar um efeito de choque ("susto").
**Stack Tecnológica:**
- **Core:** React (Vite)
- **Estilo:** Tailwind CSS (pela rapidez e facilidade em criar temas dark/hacker)
- **Animações:** Framer Motion (CRUCIAL para glitch effects, transições de páginas e feedback "agressivo")
- **Audio:** Howler.js (ou Audio API nativa) para SFX de ambiente e interação
- **Persistência:** LocalStorage (para guardar o progresso e o "Dossiê da Vítima")
- **Ícones:** Lucide React (ícones técnicos/interface)

---

## 2. Estrutura de Pastas Sugerida

```text
src/
├── assets/
│   ├── fonts/           # Fontes Monospace (ex: 'Fira Code', 'VT323')
│   ├── sounds/          # Efeitos sonoros (teclado, erro, glitch)
│   └── images/          # Backgrounds estáticos (ruído, scanlines)
├── components/
│   ├── ui/              # Componentes base (Botões, Inputs, Cards, TerminalWindow)
│   ├── effects/         # Efeitos Visuais (CRTVignette, GlitchText, MatrixRain, Scanlines)
│   ├── layout/          # Container principal (LayoutWrapper)
│   └── game/            # Componentes do Quiz (QuestionBlock, ProgressBar, HackerFeedback)
├── context/
│   └── GameContext.jsx  # Gere o estado global (pontuação, etapa atual, dados recolhidos)
├── data/
│   └── scenario.js      # Array com os Atos, Perguntas e Respostas do "Hacker"
├── hooks/
│   ├── useTypewriter.js # Hook para efeito de escrita automática
│   └── useDeviceData.js # Hook para extrair bateria, OS, user agent (O Susto Real)
├── pages/
│   ├── Intro.jsx        # A Calibração
│   ├── Act1.jsx         # Engenharia Social
│   ├── Act2.jsx         # Invasão
│   ├── Act3.jsx         # Predador Silencioso
│   ├── Boss.jsx         # A Deep Web
│   └── Report.jsx       # Relatório Final (Susto + Debriefing)
└── utils/
    └── storage.js       # Helpers para LocalStorage
3. Plano de Tarefas (Roadmap)
Fase 1: Fundação e Setup
[x] Inicializar Projeto Vite (npm create vite@latest aura-app -- --template react)

[x] Instalar Dependências

npm install tailwindcss postcss autoprefixer framer-motion lucide-react

[x] Configurar Tailwind

Definir paleta de cores: neon-green (#0f0), alert-red (#f00), deep-black (#0a0a0a).

Configurar fonte Monospace como padrão.

[x] Configurar Router (opcional) ou Gestão de Estado (se for SPA linear, basta Renderização Condicional no App.jsx).

Fase 2: Identidade Visual & Atmosfera (PRIORIDADE MÁXIMA) 🎨
O sucesso do projeto depende de parecer um terminal de hacking real.
Meta-Visual: Estética "Cyberpunk Terminal" (Preto Profundo #050505, Verde Neon #00ff41, Vermelho Sangue #ff0055).

[x] Criar Componente layout/MainLayout e effects/CRTVignette
    [x] Layer fixo com pointer-events-none.
    [x] Efeito de Scanlines (gradiente linear repetido CSS).
    [x] Efeito de Vignette (cantos escuros radial-gradient).
    [x] Efeito RGB Shift (chromatic aberration) nas bordas.
    [ ] (Opcional) Curvatura de ecrã CRT via CSS transform.

[x] Criar Componente GlitchText
    [x] Animação de "clip-path" aleatório.
    [x] Divisão de cor (Color split) no hover ou estado de alerta.
    [x] Usar para títulos e mensagens de erro/ameaça.

[x] Criar Componente TypewriterEffect
    [x] Hook useTypewriter que revela texto char-a-char.
    [x] Blinking Cursor (█) no final da linha.
    [x] Variação de velocidade para simular "human typing" ou "system loading".

[x] Sound Design (Imersão Total)
    [x] Hook useSound para gerir sons com mute toggle.
    [ ] Som de "background hum" (servidor/ambiente low-fi).
    [ ] SFX: Teclas a bater (sync com Typewriter).
    [ ] SFX: Glitch/Erro agressivo.
    [ ] SFX: Sucesso "chime" 8-bit.

Fase 3: Core Engine (Lógica) ⚙️
[x] Hook useDeviceData

[x] Extrair User Agent (Sistema Operativo, Browser).

[x] Extrair Nível de Bateria (via navigator.getBattery()).

[x] Extrair Resolução de Ecrã.

[x] Simular IP (gerar números aleatórios credíveis).

[x] GameContext (Estado Global)

[x] Estado currentStage (Intro, Act1, Act2, etc.).

[x] Estado securityScore (Começa a 100%, desce a cada erro).

[x] Estado leakedData (Array que guarda as "falhas" do aluno para o relatório final).

[x] Helper LocalStorage

[x] saveProgress(): Guardar em que pergunta o aluno está (caso feche o browser).

[x] clearSession(): Para o botão de reinício no final.

Fase 4: Implementação da Narrativa (Os Atos) 📖

Baseado nos PDFs fornecidos.





4.1. Introdução: A Calibração
[x] Ecrã de Login Falso

[x] Pedir "Nickname".

[x] Ao submeter, disparar animação de hacking.

[x] Exibir os dados recolhidos pelo useDeviceData (Ex: "Acesso concedido: Android 13 detetado").

4.2. Ato I: Engenharia Social (O Isco)
[x] Desenvolver Perguntas (Phishing/Clonagem).

[x] Lógica de Resposta:

[x] Se Errar: Ecrã vermelho, mensagem de "Malware Instalado", reduzir score.

[x] Se Acertar: Ecrã verde momentâneo, "Ameaça Bloqueada".

4.3. Ato II: A Invasão (Conectividade)
[x] Desenvolver Perguntas (Wi-Fi/Passwords).

[x] Visual: Adicionar barra de progresso "Downloading Data..." que avança se o aluno errar.

4.4. Ato III: O Predador (Interação Humana)
[x] Desenvolver Perguntas (Grooming/Fake News/Fotos).

[x] Simulação GPS: Mostrar coordenadas falsas ou aproximadas com mensagem "Localização Física Detetada".

4.5. Boss Final: A Deep Web
[x] Quiz Final Rápido.

[x] Perguntas de tempo limitado (stress) sobre o valor dos dados.

Fase 5: O Clímax e Debriefing 🏁
[ ] Ecrã "Relatório de Vítima"

[ ] Compilar todas as respostas erradas numa lista.

[ ] Mostrar mensagem assustadora: "A tua identidade digital foi vendida por 0.05 BTC".

[ ] Botão de "Pânico" ou contagem decrescente falsa.

[ ] Ecrã de Debriefing (O Alívio).

[ ] Transição visual para um design "Limpo/Escolar" (branco/azul).

[ ] Mensagem clara: "Isto foi uma simulação."

[ ] Resumo educativo dos erros cometidos.

[ ] Botão "Reiniciar Sistema" (Limpa LocalStorage).

Fase 6: Polimento e Testes
[ ] Mobile Responsiveness: Testar em telemóvel (já que os alunos usarão smartphones ).

[ ] Performance: Garantir que as animações não travam em telemóveis mais fracos.

[ ] Deploy: Configurar build para Vercel ou Netlify.

4. Notas Técnicas Importantes
A Ilusão: Nunca guardes dados reais num servidor. Tudo deve viver na memória do browser (state) e localStorage apenas durante a sessão.

O Efeito Susto: Usa cores contrastantes. O fundo deve ser quase preto (#050505) e o texto de "hacking" deve ser verde terminal (#00ff00) ou vermelho sangue (#ff0000) para erros.

Bateria: A API de bateria (navigator.getBattery) pode não funcionar em todos os browsers (especialmente iOS), por isso cria um fallback que diz apenas "Bateria: Analisando..." ou simula um valor se a API falhar.