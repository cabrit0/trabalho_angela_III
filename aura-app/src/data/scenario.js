// Shuffle array utility
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Get random questions from pool
export const getRandomQuestions = (actQuestions, count = 10) => {
    const shuffled = shuffleArray(actQuestions);
    return shuffled.slice(0, count);
};

export const SCENARIO_DATA = {
    act1: [
        // PHISHING - 15+ questions
        {
            id: 1,
            type: 'phishing',
            question: "📩 RECEBIDO: 'URGENTE: A tua conta Instagram foi comprometida. Clica aqui para recuperar: bit.ly/secure-login'",
            options: [
                { label: "Clicar imediatamente para não perder a conta", risk: "high" },
                { label: "Ignorar e bloquear o remetente", risk: "safe" },
                { label: "Responder a perguntar se é verdade", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "AMEAÇA BLOQUEADA. Phishing detetado.",
                risk: "MALWARE INSTALADO. Credenciais capturadas via keylogger."
            }
        },
        {
            id: 2,
            type: 'phishing',
            question: "📧 Email do 'Banco': 'Confirme os seus dados para evitar bloqueio da conta. Clique no link abaixo.'",
            options: [
                { label: "Clicar no link e preencher os dados", risk: "high" },
                { label: "Ligar diretamente para o banco pelo número oficial", risk: "safe" },
                { label: "Responder ao email a pedir mais informações", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "VERIFICAÇÃO CORRETA. Bancos nunca pedem dados por email.",
                risk: "CONTA BANCÁRIA COMPROMETIDA. Transferência de 500€ iniciada."
            }
        },
        {
            id: 3,
            type: 'phishing',
            question: "📱 SMS: 'CTT: A sua encomenda está retida. Pague 1.99€ de taxa: ctt-entregas.site'",
            options: [
                { label: "Pagar rapidamente para receber a encomenda", risk: "high" },
                { label: "Verificar no site oficial dos CTT", risk: "safe" },
                { label: "Ignorar porque não encomendei nada", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "SMISHING EVITADO. O domínio era falso.",
                risk: "CARTÃO CLONADO. Dados de pagamento roubados."
            }
        },
        {
            id: 4,
            type: 'cloning',
            question: "💬 WhatsApp de 'amigo': 'Podes enviar-me o código que te mandei por SMS? O meu telemóvel está avariado.'",
            options: [
                { label: "Enviar o código para ajudar", risk: "high" },
                { label: "Ligar para o amigo para confirmar", risk: "safe" },
                { label: "Perguntar qual código por mensagem", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CLONAGEM PREVENIDA. O 'amigo' era um atacante.",
                risk: "WHATSAPP HACKEADO. Mensagens a todos os contactos enviadas."
            }
        },
        {
            id: 5,
            type: 'phishing',
            question: "🎮 Pop-up: 'Parabéns! Ganhaste um iPhone 15! Clica para reclamar o prémio!'",
            options: [
                { label: "Clicar para reclamar o prémio grátis", risk: "high" },
                { label: "Fechar imediatamente o pop-up", risk: "safe" },
                { label: "Investigar se a promoção é real", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "SCAM BLOQUEADO. Prémios 'grátis' são sempre fraude.",
                risk: "ADWARE INSTALADO. Browser infectado com anúncios."
            }
        },
        {
            id: 6,
            type: 'phishing',
            question: "📧 Email: 'Netflix: O seu pagamento falhou. Atualize os dados em netflix-billing.com'",
            options: [
                { label: "Clicar e atualizar o cartão", risk: "high" },
                { label: "Ir diretamente a netflix.com e verificar", risk: "safe" },
                { label: "Cancelar a Netflix por mensagem", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "PHISHING IDENTIFICADO. O domínio não era netflix.com.",
                risk: "SUBSCRIÇÕES FRAUDULENTAS ativadas com o teu cartão."
            }
        },
        {
            id: 7,
            type: 'social',
            question: "👤 Pedido de amizade no Facebook de alguém com foto atraente e 2 amigos em comum.",
            options: [
                { label: "Aceitar - temos amigos em comum", risk: "high" },
                { label: "Verificar o perfil antes de aceitar", risk: "safe" },
                { label: "Aceitar e ver o que acontece", risk: "high" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "PERFIL ANALISADO. Era uma conta falsa para recolher dados.",
                risk: "DADOS DE PERFIL EXPOSTOS a rede de scammers."
            }
        },
        {
            id: 8,
            type: 'phishing',
            question: "📧 'Spotify: A tua conta será eliminada em 24h. Confirma aqui: spotify-verify.net'",
            options: [
                { label: "Confirmar rapidamente para não perder músicas", risk: "high" },
                { label: "Entrar na app Spotify e verificar notificações", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "URGÊNCIA FALSA RECONHECIDA. Empresas não eliminam contas assim.",
                risk: "SESSÃO SPOTIFY ROUBADA. Playlists eliminadas."
            }
        },
        {
            id: 9,
            type: 'vishing',
            question: "📞 Chamada: 'Olá, somos da Microsoft. O seu PC tem vírus. Dê-nos acesso remoto para limpar.'",
            options: [
                { label: "Dar acesso - a Microsoft sabe", risk: "high" },
                { label: "Desligar imediatamente", risk: "safe" },
                { label: "Pedir o número de funcionário", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "VISHING BLOQUEADO. Microsoft nunca liga aos utilizadores.",
                risk: "RANSOMWARE INSTALADO. Ficheiros encriptados. Resgate: 500€."
            }
        },
        {
            id: 10,
            type: 'phishing',
            question: "💼 LinkedIn: 'Recrutador da Google quer falar consigo. Envie CV e data nascimento.'",
            options: [
                { label: "Enviar tudo para não perder a oportunidade", risk: "high" },
                { label: "Verificar se o recrutador é real no site da Google", risk: "safe" },
                { label: "Responder só com o CV", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "VERIFICAÇÃO CORRETA. Era um perfil falso.",
                risk: "IDENTIDADE EXPOSTA para fraude de emprego."
            }
        },
        {
            id: 11,
            type: 'phishing',
            question: "🎁 Email: 'Amazon: Tens um voucher de 100€ à tua espera. Reclama já!'",
            options: [
                { label: "Reclamar o voucher grátis", risk: "high" },
                { label: "Verificar na minha conta Amazon real", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "FRAUDE EVITADA. Vouchers surpresa não existem.",
                risk: "CREDENCIAIS AMAZON ROUBADAS. Encomendas falsas no teu nome."
            }
        },
        {
            id: 12,
            type: 'social',
            question: "📸 DM no Instagram: 'Olá! Vi o teu perfil e adorei. Podemos falar no Telegram?'",
            options: [
                { label: "Adicionar no Telegram", risk: "high" },
                { label: "Ignorar mensagens de desconhecidos", risk: "safe" },
                { label: "Pedir mais informações primeiro", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "ROMANCE SCAM EVITADO. Era o início de uma fraude.",
                risk: "MANIPULAÇÃO EMOCIONAL iniciada. Fases seguintes: pedidos de dinheiro."
            }
        },
        {
            id: 13,
            type: 'phishing',
            question: "📧 'Apple: Detetámos login suspeito. Verifique em: apple-security-check.com'",
            options: [
                { label: "Verificar imediatamente", risk: "high" },
                { label: "Ir a appleid.apple.com diretamente", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "DOMÍNIO FALSO IDENTIFICADO.",
                risk: "APPLE ID COMPROMETIDO. Dispositivos bloqueados remotamente."
            }
        },
        {
            id: 14,
            type: 'phishing',
            question: "🎮 Discord: 'Ganhas Nitro grátis se votares no meu servidor: dlscord-vote.gift'",
            options: [
                { label: "Votar para ajudar e ganhar Nitro", risk: "high" },
                { label: "Reportar como scam", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "LINK MALICIOSO REPORTADO. 'dlscord' não é 'discord'.",
                risk: "TOKEN DISCORD ROUBADO. Conta usada para spam."
            }
        },
        {
            id: 15,
            type: 'phishing',
            question: "📧 'EDP: Fatura em atraso. Pague já para evitar corte: edp-pagamentos.pt'",
            options: [
                { label: "Pagar para evitar problemas", risk: "high" },
                { label: "Verificar na área de cliente oficial", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "FRAUDE ENERGÉTICA EVITADA.",
                risk: "DADOS BANCÁRIOS COMPROMETIDOS."
            }
        }
    ],

    act2: [
        // CONECTIVIDADE & PASSWORDS - 15+ questions
        {
            id: 20,
            type: 'wifi',
            question: "📶 Aeroporto: Rede 'FREE_AIRPORT_WIFI' disponível. Queres ligar?",
            options: [
                { label: "Ligar - é grátis e conveniente", risk: "high" },
                { label: "Usar dados móveis", risk: "safe" },
                { label: "Ligar com VPN ativa", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CONEXÃO SEGURA MANTIDA.",
                risk: "MAN-IN-THE-MIDDLE ATIVO. Tráfego intercetado."
            }
        },
        {
            id: 21,
            type: 'password',
            question: "🔐 Password para a escola: 'Benfica2024'",
            options: [
                { label: "Manter - é fácil de lembrar", risk: "high" },
                { label: "Mudar para '7#kLm!nP2@xQ'", risk: "safe" },
                { label: "Adicionar '!' no final: 'Benfica2024!'", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "ENTROPIA MÁXIMA. Password forte criada.",
                risk: "DICIONÁRIO ATTACK: Password crackeada em 0.3 segundos."
            }
        },
        {
            id: 22,
            type: 'wifi',
            question: "☕ Café: Rede 'Starbucks_Guest' sem password. Precisas de ver emails.",
            options: [
                { label: "Ligar só para ver emails rapidamente", risk: "high" },
                { label: "Esperar até ter rede segura", risk: "safe" },
                { label: "Ligar mas não fazer login em nada", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "PACIÊNCIA É SEGURANÇA.",
                risk: "SESSÃO DE EMAIL INTERCETADA. Inbox exposta."
            }
        },
        {
            id: 23,
            type: 'password',
            question: "🔑 Usas a mesma password para Instagram, Email e Banco?",
            options: [
                { label: "Sim, é mais fácil de lembrar", risk: "high" },
                { label: "Não, cada conta tem password única", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "COMPARTIMENTAÇÃO CORRETA. Um leak não afeta tudo.",
                risk: "CREDENTIAL STUFFING: Uma password = todas as contas."
            }
        },
        {
            id: 24,
            type: 'security',
            question: "🔒 O site mostra 'http://' em vez de 'https://'. Continuas?",
            options: [
                { label: "Continuar - funciona na mesma", risk: "high" },
                { label: "Não inserir dados sensíveis", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CONEXÃO NÃO ENCRIPTADA RECONHECIDA.",
                risk: "DADOS TRANSMITIDOS EM TEXTO PLANO. Capturados."
            }
        },
        {
            id: 25,
            type: 'password',
            question: "📝 Onde guardas as tuas passwords?",
            options: [
                { label: "Num ficheiro .txt no ambiente de trabalho", risk: "high" },
                { label: "Num gestor de passwords (Bitwarden, 1Password)", risk: "safe" },
                { label: "Escritas num papel na carteira", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "GESTÃO SEGURA. Passwords encriptadas.",
                risk: "FICHEIRO EXPOSTO. Todas as passwords acessíveis."
            }
        },
        {
            id: 26,
            type: 'wifi',
            question: "🏨 Hotel: 'Hotel_Premium_5G' pede login com email e password do quarto.",
            options: [
                { label: "Introduzir os dados pedidos", risk: "medium" },
                { label: "Perguntar na receção qual é a rede oficial", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "VERIFICAÇÃO PRESENCIAL CORRETA.",
                risk: "EVIL TWIN ATTACK. Rede falsa a imitar o hotel."
            }
        },
        {
            id: 27,
            type: 'security',
            question: "🔐 A app pede acesso a: Câmara, Microfone, Contactos, Localização. Aceitas?",
            options: [
                { label: "Aceitar tudo para usar a app", risk: "high" },
                { label: "Permitir apenas o necessário", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "PRINCÍPIO DO MENOR PRIVILÉGIO aplicado.",
                risk: "PERMISSÕES EXCESSIVAS. Spyware potencial."
            }
        },
        {
            id: 28,
            type: 'password',
            question: "🎂 A tua password contém a tua data de nascimento?",
            options: [
                { label: "Sim, é fácil de lembrar", risk: "high" },
                { label: "Não, evito dados pessoais", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "OSINT BLOQUEADO. Datas são fáceis de descobrir.",
                risk: "DATA DE NASCIMENTO PÚBLICA. Password adivinhada."
            }
        },
        {
            id: 29,
            type: 'security',
            question: "📱 Ativaste autenticação de dois fatores (2FA) nas tuas contas?",
            options: [
                { label: "Não, é inconveniente", risk: "high" },
                { label: "Sim, em todas as contas importantes", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CAMADA EXTRA DE PROTEÇÃO ativa.",
                risk: "CONTA VULNERÁVEL. Password única = acesso total."
            }
        },
        {
            id: 30,
            type: 'wifi',
            question: "🔄 O teu router de casa ainda tem a password 'admin/admin'?",
            options: [
                { label: "Sim, nunca mudei", risk: "high" },
                { label: "Não, mudei para uma password forte", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "ROUTER PROTEGIDO.",
                risk: "REDE DOMÉSTICA EXPOSTA. DNS hijacking possível."
            }
        },
        {
            id: 31,
            type: 'password',
            question: "🔄 Com que frequência mudas as tuas passwords?",
            options: [
                { label: "Nunca mudei desde que criei", risk: "high" },
                { label: "Quando há notícia de data breach", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "RESPOSTA A INCIDENTES correta.",
                risk: "PASSWORDS ANTIGAS. Possivelmente já leaked."
            }
        },
        {
            id: 32,
            type: 'security',
            question: "💾 Fazes backup dos teus ficheiros importantes?",
            options: [
                { label: "Não, está tudo no computador", risk: "high" },
                { label: "Sim, na cloud e/ou disco externo", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "RESILIÊNCIA A RANSOMWARE.",
                risk: "RANSOMWARE = PERDA TOTAL de dados."
            }
        },
        {
            id: 33,
            type: 'wifi',
            question: "📶 Partilhas a password do Wi-Fi de casa com visitantes frequentemente?",
            options: [
                { label: "Sim, dou a todos", risk: "medium" },
                { label: "Tenho uma rede de convidados separada", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "SEGMENTAÇÃO DE REDE aplicada.",
                risk: "DISPOSITIVOS COMPROMETIDOS podem entrar na rede principal."
            }
        },
        {
            id: 34,
            type: 'password',
            question: "🔐 Qual destas passwords é mais segura?",
            options: [
                { label: "P@ssw0rd123!", risk: "medium" },
                { label: "cavalo-bateria-correto-agrafe", risk: "safe" },
                { label: "qwerty2024", risk: "high" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "PASSPHRASES são mais seguras e fáceis de lembrar.",
                risk: "PASSWORDS PREVISÍVEIS são crackeadas rapidamente."
            }
        }
    ],

    act3: [
        // INTERAÇÃO HUMANA - 15+ questions
        {
            id: 40,
            type: 'grooming',
            question: "💬 Discord DM: 'Oi! Sou produtor musical. Tens perfil de modelo. Manda selfie agora.'",
            options: [
                { label: "Mandar foto - é uma oportunidade!", risk: "high" },
                { label: "Bloquear e reportar", risk: "safe" },
                { label: "Perguntar qual agência", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "PREDADOR BLOQUEADO.",
                risk: "IMAGEM CAPTURADA. Partilhada em fóruns obscuros."
            }
        },
        {
            id: 41,
            type: 'fake_news',
            question: "📰 Artigo: 'URGENTE: Beber lixívia cura COVID-19!' (5000 partilhas)",
            options: [
                { label: "Partilhar para avisar amigos", risk: "high" },
                { label: "Verificar em fontes oficiais (DGS/OMS)", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "DESINFORMAÇÃO IDENTIFICADA.",
                risk: "FAKE NEWS ESPALHADA. Alguém pode ser prejudicado."
            }
        },
        {
            id: 42,
            type: 'privacy',
            question: "📸 Publicaste foto no Instagram com geolocalização ativa?",
            options: [
                { label: "Sim, mostro sempre onde estou", risk: "high" },
                { label: "Não, desativei a localização", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "PRIVACIDADE PROTEGIDA.",
                risk: "PADRÕES DE MOVIMENTO EXPOSTOS. Stalking facilitado."
            }
        },
        {
            id: 43,
            type: 'grooming',
            question: "💬 Alguém online pede-te para manter a conversa 'secreta' dos teus pais.",
            options: [
                { label: "Concordar - parece ser especial", risk: "high" },
                { label: "Terminar a conversa e contar a um adulto", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "SINAL DE ALERTA RECONHECIDO.",
                risk: "MANIPULAÇÃO EMOCIONAL em progresso. Isolar é tática clássica."
            }
        },
        {
            id: 44,
            type: 'cyberbullying',
            question: "👥 Grupo de WhatsApp partilha foto embaraçosa de colega. O que fazes?",
            options: [
                { label: "Rir e partilhar também", risk: "high" },
                { label: "Não partilhar e apoiar a vítima", risk: "safe" },
                { label: "Sair do grupo silenciosamente", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "EMPATIA DEMONSTRADA. Cyberbullying combatido.",
                risk: "CUMPLICIDADE NO BULLYING. Consequências legais possíveis."
            }
        },
        {
            id: 45,
            type: 'privacy',
            question: "🏠 Publicaste foto do teu quarto que mostra janela para a rua?",
            options: [
                { label: "Sim, é só uma foto normal", risk: "high" },
                { label: "Não, evito mostrar detalhes identificáveis", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "OSINT PREVENIDO. Localização não exposta.",
                risk: "LOCALIZAÇÃO FÍSICA IDENTIFICÁVEL através de detalhes visuais."
            }
        },
        {
            id: 46,
            type: 'fake_news',
            question: "📱 Vídeo viral: 'Político X disse isto!' Mas é um clip cortado de 3 segundos.",
            options: [
                { label: "Partilhar - está nas redes todas", risk: "high" },
                { label: "Procurar o vídeo/discurso completo", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CONTEXTO VERIFICADO. Era manipulação.",
                risk: "DESINFORMAÇÃO AMPLIFICADA."
            }
        },
        {
            id: 47,
            type: 'grooming',
            question: "🎁 Alguém online oferece-te presentes caros sem razão aparente.",
            options: [
                { label: "Aceitar - é simpático", risk: "high" },
                { label: "Recusar e questionar as intenções", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "LOVE BOMBING IDENTIFICADO. Tática de manipulação.",
                risk: "OBRIGAÇÃO CRIADA. Próximo passo: pedidos de favores."
            }
        },
        {
            id: 48,
            type: 'privacy',
            question: "📱 Perfil público ou privado nas redes sociais?",
            options: [
                { label: "Público - quero muitos seguidores", risk: "high" },
                { label: "Privado - apenas amigos aceites", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CONTROLO DE AUDIÊNCIA mantido.",
                risk: "QUALQUER PESSOA pode ver tudo sobre ti."
            }
        },
        {
            id: 49,
            type: 'scam',
            question: "💰 Mensagem: 'Investi 100€ e ganhei 5000€ em crypto! Tu também podes!'",
            options: [
                { label: "Investir também para ganhar", risk: "high" },
                { label: "Ignorar - se fosse real não precisavam de recrutar", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "ESQUEMA PONZI EVITADO.",
                risk: "DINHEIRO PERDIDO. Returns prometidos nunca chegam."
            }
        },
        {
            id: 50,
            type: 'privacy',
            question: "🎂 Partilhas a tua data de nascimento completa nas redes?",
            options: [
                { label: "Sim, para receber parabéns", risk: "high" },
                { label: "Não, ou mostro só dia/mês", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "DADO SENSÍVEL PROTEGIDO.",
                risk: "DATA DE NASCIMENTO = chave para roubo de identidade."
            }
        },
        {
            id: 51,
            type: 'grooming',
            question: "📹 Alguém online pede videochamada 'privada' num site estranho?",
            options: [
                { label: "Aceitar - parece ser seguro", risk: "high" },
                { label: "Recusar e bloquear", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "SEXTORTION PREVENIDA.",
                risk: "GRAVAÇÃO SEM CONSENTIMENTO. Extorsão iminente."
            }
        },
        {
            id: 52,
            type: 'fake_news',
            question: "🏥 Post: 'Vacinas causam autismo! NÃO VACINEM OS FILHOS!'",
            options: [
                { label: "Partilhar para alertar", risk: "high" },
                { label: "Verificar estudos científicos reais", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "DESINFORMAÇÃO MÉDICA IDENTIFICADA.",
                risk: "FAKE NEWS PERIGOSA partilhada."
            }
        },
        {
            id: 53,
            type: 'privacy',
            question: "✈️ Publicas fotos de viagem enquanto ainda estás fora?",
            options: [
                { label: "Sim, em tempo real", risk: "high" },
                { label: "Não, partilho quando voltar", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CASA PROTEGIDA. Ladrões não sabem que está vazia.",
                risk: "CASA VAZIA ANUNCIADA publicamente."
            }
        },
        {
            id: 54,
            type: 'catfish',
            question: "❤️ Namoras com alguém online há 6 meses que nunca quis fazer videochamada?",
            options: [
                { label: "Normal, algumas pessoas são tímidas", risk: "high" },
                { label: "Suspeito, pode ser catfish", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CATFISHING QUESTIONADO.",
                risk: "IDENTIDADE FALSA confirmada. Meses de manipulação."
            }
        }
    ]
};
