/**
 * ==========================================================================
 * JESUS REINA AI V3 ULTRA ENGINE — EXTREME PROMPT GENERATION ENGINE V2
 * ==========================================================================
 * Repository Feature: Automated systemic expansion for high-tier LLM inputs.
 * Architecture: Vanilla JS Enterprise Pattern (IIFE Isolation)
 * Core Function: Category detection, blueprint mapping, and macro-prompt construction.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const btnGenerate = document.getElementById('btn-generate-prompt');
        const selectCategory = document.getElementById('prompt-category');
        const inputBase = document.getElementById('prompt-input-base');
        const outputCode = document.getElementById('prompt-output-code');

        if (!btnGenerate || !selectCategory || !inputBase || !outputCode) {
            console.warn('[JR AI V3 PromptEngine] Elementos de controle da UI ausentes.');
            return;
        }

        // Dicionário Core de Expansão Arquitetural (Sem Placeholders, Pronto para Produção)
        const engineeringBlueprints = {
            site: "[ARQUITETURA: LANDING PAGE HIGH-CONVERSION]\n- ESTRUTURA: Hero section com proposta de valor clara, sub-chamada magnética, CTA duplo flutuante, prova social em carrossel dinâmico, grid de recursos com micro-animações, FAQ colapsável e rodapé corporativo com mapa do site.\n- UI/UX: Design atômico, tipografia contrastante com ritmo fluido, espaçamentos consistentes usando escala 8px, carregamento progressivo e acessibilidade WCAG AA.",
            
            app: "[ARQUITETURA: MOBILE HYBRID APPLICATION]\n- ESTRUTURA: Splash screen animada, fluxo de onboarding nativo em 3 etapas, navegação por Bottom Bar com micro-interações, gaveta lateral de perfil, esqueleto de carregamento (skeleton screen) para estados assíncronos e tratamento robusto de modo offline.",
            
            game: "[ARQUITETURA: BROWSER GAME ENGINE & STATE]\n- ESTRUTURA: Loop de jogo principal (RequestAnimationFrame), gerenciador de estado centralizado imutável, sistema de detecção de colisão por matriz indexada, renderização otimizada em Canvas 2D/WebGL, painel HUD responsivo e persistência de pontuação máxima local.",
            
            loja: "[ARQUITETURA: E-COMMERCE HIGH-PERFORMANCE]\n- ESTRUTURA: Vitrine reativa com filtros facetados síncronos, página de detalhes do produto com zoom de imagem, carrinho de compras flutuante com cálculo em tempo real, fluxo de checkout limpo em uma única página e esqueleto de SEO estruturado em JSON-LD.",
            
            saas: "[ARQUITETURA: SOFTWARE AS A SERVICE MULTI-TENANT]\n- ESTRUTURA: Painel administrativo com controle de permissões baseado em papéis (RBAC), métricas agregadas por KPIs, gráficos interativos síncronos, sistema de faturamento integrado por tokens e camada de webhook para integrações de terceiros.",
            
            ia: "[ARQUITETURA: AUTOMATED AI AGENT GATEWAY]\n- ESTRUTURA: Histórico de contexto em memória curta com poda por similaridade, barramento de comandos estruturados para chamadas de ferramentas externas (Tool Calling), parser robusto para respostas JSON imperfeitas e fallback elegante para timeouts de LLM.",
            
            dashboard: "[ARQUITETURA: REAL-TIME DATA ANALYTICS DASHBOARD]\n- ESTRUTURA: Grid customizável drag-and-drop de widgets, pooling síncrono ou conexões via WebSocket para dados em tempo real, exportador nativo de relatórios em CSV/PDF, paginação otimizada no client-side e tratamento térmico de renderização.",
            
            delivery: "[ARQUITETURA: ON-DEMAND DELIVERY SYSTEM LOGISTICS]\n- ESTRUTURA: Fluxo bifurcado (Cliente, Restaurante e Entregador), rastreamento dinâmico de status por linha do tempo síncrona, cálculo preciso de rota baseado em matriz de distância, carrinho inteligente com verificação de raio de entrega e checkout blindado.",
            
            chatbot: "[ARQUITETURA: ADVANCED CONVERSATIONAL CHAT FLOW]\n- ESTRUTURA: Árvore de decisão hierárquica baseada em intenções do usuário, suporte integrado a Rich Cards (botões, listas e imagens), persistência de contexto da conversa, sistema de transbordo humano automatizado e analytics de taxa de retenção.",
            
            "rede-social": "[ARQUITETURA: HIGH-ENGAGEMENT SOCIAL NETWORK HUB]\n- ESTRUTURA: Feed de conteúdo com rolagem infinita virtualizada (virtual scroll), suporte multimídia nativo otimizado, sistema de engajamento assíncrono (likes, compartilhamentos, comentários aninhados) e notificações em tempo real.",
            
            automacao: "[ARQUITETURA: WORKFLOW AUTOMATION PIPELINE DESIGNER]\n- ESTRUTURA: Orquestrador de tarefas baseado em gatilhos (Triggers) e ações (Actions), motor de agendamento por expressão Cron, tratamento avançado de retentativas (Retry Policy) com atraso exponencial e painel de auditoria de execução.",
            
            editor: "[ARQUITETURA: WYSIWYG VISUAL STUDIO CANVAS]\n- ESTRUTURA: Árvore de nós hierárquica convertida em layout real, manipulação direta de propriedades CSS em tempo real, empilhamento de histórico recursivo (Undo/Redo via padrão Command) e exportador de código estático unificado.",
            
            streaming: "[ARQUITETURA: ULTRA-LOW LATENCY MEDIA STREAMING HUB]\n- ESTRUTURA: Reprodutor de vídeo customizado com controle adaptativo de bitrate, fila de reprodução inteligente contínua, sistema de busca por indexação fonética, gerenciador de perfis de usuários isolados e rastreador de progresso de mídia de alta fidelidade."
        };

        /**
         * Dispara a construção macro do prompt profissional
         */
        btnGenerate.addEventListener('click', async () => {
            const category = selectCategory.value;
            const baseText = inputBase.value.trim();

            if (!baseText) {
                inputBase.focus();
                inputBase.style.borderColor = 'var(--neon-magenta)';
                setTimeout(() => inputBase.style.borderColor = 'rgba(255, 255, 255, 0.08)', 1500);
                return;
            }

            // Bloqueia a UI para simular o processamento quântico do motor
            btnGenerate.disabled = true;
            btnGenerate.innerHTML = '<i class="fa-solid fa-microchip fa-spin"></i> EXPANDINDO MATRIZ DE CONHECIMENTO...';
            outputCode.innerText = '// Processando blueprints de engenharia avançada...';

            // Simula delay de renderização computacional da IA
            await window.JRAI_Utils.sleep(1200);

            const blueprint = engineeringBlueprints[category] || "[ARQUITETURA: SISTEMA CUSTOMIZADO PROFISSIONAL]";
            
            // Constrói a estrutura mestre do prompt definitivo
            const macroPrompt = `ACT AS An Expert Senior Software Architect and Master Prompt Engineer.
Analyze the following user idea: "${baseText}"

Strictly adhere to this corporate-level engineering blueprint for compilation:
==========================================================================
${blueprint}
==========================================================================

ADDITIONAL COMPILER INSTRUCTIONS:
- Generate production-ready, clean, modular code.
- Absolutely NO placeholders, NO pseudo-code, and NO skipped blocks.
- Inject smooth premium UX animations, full glassmorphism, responsive behavior, and complete security validation.
- Deliver code architecture cleanly separated (HTML/CSS/JS).
- Maintain rigorous standards of execution. Confirm understanding and start step-by-step implementation immediately.`;

            // Renderiza o output com o efeito de digitação premium
            if (window.JRAI_Utils && window.JRAI_Utils.typeWriterEffect) {
                window.JRAI_Utils.typeWriterEffect(outputCode, macroPrompt, 5, () => {
                    finalizeGeneration(macroPrompt);
                });
            } else {
                outputCode.innerText = macroPrompt;
                finalizeGeneration(macroPrompt);
            }
        });

        /**
         * Reativa a interface e grava a operação no histórico local
         */
        function finalizeGeneration(finalText) {
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = 'EXPANDIR PARA PROMPT EXTREMO';

            // Registra a ação de sucesso no histórico para o usuário auditar depois
            if (window.JRAI_History) {
                window.JRAI_History.addRecord('prompt', {
                    category: selectCategory.value,
                    userInput: inputBase.value,
                    expandedPrompt: finalText
                });
            }
        }
    });
})();
