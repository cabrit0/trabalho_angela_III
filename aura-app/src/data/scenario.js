export const SCENARIO_DATA = {
    act1: [
        {
            id: 1,
            type: 'phishing',
            question: "RECEBIDO: 'URGENTE: A tua conta Instagram foi comprometida. Clica aqui para recuperar: bit.ly/secure-login'",
            options: [
                { label: "Clicar imediatamente", risk: "high" },
                { label: "Ignorar e bloquear", risk: "safe" },
                { label: "Responder a perguntar se é verdade", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "AMEAÇA BLOQUEADA. Phishing detetado.",
                risk: "ERRO CRÍTICO. Malware instalado via drive-by download."
            }
        },
        {
            id: 2,
            type: 'cloning',
            question: "Um amigo pede o teu código de verificação WhatsApp por SMS porque 'o dele não funciona'.",
            options: [
                { label: "Enviar o código", risk: "high" },
                { label: "Ligar para confirmar a identidade", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "IDENTIDADE CONFIRMADA. Tentativa de clonagem evitada.",
                risk: "ACESSO PERDIDO. A tua conta agora pertence a um botnet."
            }
        }
    ],
    act2: [
        {
            id: 3,
            type: 'wifi',
            question: "Detetada rede Wi-Fi aberta: 'Free_Starbucks_WiFi'. Sinal forte. Ligar?",
            options: [
                { label: "Ligar apenas para ver Instagram", risk: "high" },
                { label: "Usar dados móveis (4G/5G)", risk: "safe" },
                { label: "Ligar com VPN", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "CONEXÃO SEGURA. Rede pública ignorada.",
                risk: "DADOS INTERCETADOS (Man-in-the-Middle). Passwords capturadas."
            }
        },
        {
            id: 4,
            type: 'password',
            question: "Password definida para a conta da escola: 'Benfica123'.",
            options: [
                { label: "Manter (é fácil de lembrar)", risk: "high" },
                { label: "Alterar para 'B3nf!c@_2025!'", risk: "medium" },
                { label: "Criar frase aleatória 'Cavalo-Pilhas-Correto'", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "ENTROPIA MÁXIMA. Brute-force impossível.",
                risk: "CRACKED EM 0.3 SEGUNDOS. Acesso root concedido."
            }
        }
    ],
    act3: [
        {
            id: 5,
            type: 'grooming',
            question: "RECEBIDO (Discord): 'Oi, sou produtor musical. Adoro as tuas fotos. Manda uma selfie agora para ver se tens perfil para modelo.'",
            options: [
                { label: "Mandar a foto (é uma oportunidade!)", risk: "high" },
                { label: "Ignorar e bloquear o user", risk: "safe" },
                { label: "Pedir o nome da agência primeiro", risk: "medium" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "PREDADOR BLOQUEADO. Grooming evitado.",
                risk: "FOTO CAPTURADA. Imagem partilhada em fóruns da Deep Web."
            }
        },
        {
            id: 6,
            type: 'fake_news',
            question: "TITULO: 'Celebridade X diz que beber lixívia cura a gripe'. Partilhado por 5000 pessoas.",
            options: [
                { label: "Partilhar imediatamente", risk: "high" },
                { label: "Verificar fonte oficial (ex: SNS/DGS)", risk: "safe" }
            ],
            correctRisk: "safe",
            feedback: {
                safe: "FAKE NEWS DETETADA. Corrente de desinformação quebrada.",
                risk: "DESINFORMAÇÃO ESPALHADA. Crédito social reduzido."
            }
        }
    ]
};
