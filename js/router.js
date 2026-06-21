/**
 * ==========================================================================
 * JESUS REINA AI V3 ULTRA ENGINE — SPA ROUTER SYSTEM
 * ==========================================================================
 * Repository Feature: Zero-reload reactive navigation engine.
 * Architecture: Vanilla JS Enterprise Pattern (IIFE Isolation)
 * Core Function: Manages active UI states, views switching, and hooks.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.workspace-section');

        if (navItems.length === 0 || sections.length === 0) {
            console.warn('[JR AI V3 Router] Aviso: Elementos de navegação ou seções não mapeados na DOM.');
            return;
        }

        /**
         * Inicializa os ouvintes de clique para cada item do menu
         */
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetViewId = item.getAttribute('data-target');
                if (!targetViewId) return;

                // Evita reprocessar a rota caso o usuário clique na aba já ativa
                if (item.classList.contains('active')) return;

                switchRoute(targetViewId, item);
            });
        });

        /**
         * Transiciona as telas aplicando e removendo classes de visibilidade
         * @param {string} targetId - O ID da seção de destino (ex: 'chat-ia')
         * @param {HTMLElement} activeNavItem - O elemento do menu que foi clicado
         */
        function switchRoute(targetId, activeNavItem) {
            const targetSection = document.getElementById(targetId);
            
            if (!targetSection) {
                console.error(`[JR AI V3 Router] Erro: A seção destino '#${targetId}' não existe.`);
                return;
            }

            // 1. Atualiza o estado visual dos botões de navegação (Sidebar)
            navItems.forEach(nav => nav.classList.remove('active'));
            activeNavItem.classList.add('active');

            // 2. Remove a atividade da seção atualmente visível
            sections.forEach(section => {
                if (section.classList.contains('view-active')) {
                    section.classList.remove('view-active');
                }
            });

            // 3. Ativa a nova seção com animação de fade/scale controlada pelo CSS
            targetSection.classList.add('view-active');

            // 4. Dispara um Gancho Global (Hook) de Ciclo de Vida da Rota
            // Útil para inicializar ou resetar comportamentos específicos de cada tela dinamicamente
            triggerRouteLifecycleHook(targetId);
        }

        /**
         * Emite um evento customizado global notificando o ecossistema sobre a mudança de tela
         * @param {string} routeId - ID da rota ativa
         */
        function triggerRouteLifecycleHook(routeId) {
            const routeChangeEvent = new CustomEvent('JRAI_Route_Changed', {
                detail: { activeRoute: routeId }
            });
            window.dispatchEvent(routeChangeEvent);

            // Log de desenvolvimento corporativo visível no console do inspetor
            console.log(`[JR AI V3 Engine] Rota alterada com sucesso -> Módulo: ${routeId.toUpperCase()}`);
        }

        // Monitora quando o sistema sai do splash screen para sincronizar a primeira inicialização
        window.addEventListener('JRAI_Engine_Ready', () => {
            console.log('[JR AI V3 Router] Sincronizado com o núcleo. Navegação operacional.');
        });
    });

})();
