/**
 * ==========================================================================
 * JESUS REINA AI V3 ULTRA ENGINE — SPLASH SCREEN CONTROLLER
 * ==========================================================================
 * Repository Feature: Cinematic transition & Core initializers.
 * Architecture: Vanilla JS Enterprise Pattern (IIFE Isolation)
 * Core Function: Handles premium fade-outs, state toggles, and audio prep.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const splashScreen = document.getElementById('splash-screen');
        const btnEnterSystem = document.getElementById('btn-enter-system');
        const mainAppContainer = document.getElementById('main-app-container');

        // Fail-safe: Verifica se todos os elementos cruciais da DOM estão presentes
        if (!splashScreen || !btnEnterSystem || !mainAppContainer) {
            console.error('[JR AI V3 Error] Elementos vitais de inicialização não encontrados na DOM.');
            return;
        }

        /**
         * Inicializa a transição de entrada premium
         */
        btnEnterSystem.addEventListener('click', () => {
            // Injeta um feedback tátil ou visual imediato no botão
            btnEnterSystem.style.transform = 'scale(0.95)';
            btnEnterSystem.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> CARREGANDO NÚCLEO...';

            // Simula uma micro-checagem de sistemas de 600ms para aumentar o peso cinematográfico
            setTimeout(() => {
                executeCinematicExit();
            }, 600);
        });

        /**
         * Executa a animação de saída com desfoque e opacidade progressiva
         */
        function executeCinematicExit() {
            // Aplica transições via CSS transitions nativas do style.css
            splashScreen.style.opacity = '0';
            splashScreen.style.transform = 'scale(1.05) filter(blur(20px))';
            splashScreen.style.transition = 'all 0.8s cubic-bezier(0.85, 0, 0.15, 1)';

            // Revela o Container Principal do App simultaneamente
            mainAppContainer.classList.remove('app-hidden');
            mainAppContainer.style.opacity = '0';
            
            // Força um reflow para o navegador processar a opacidade zero antes de aplicar a animação de entrada
            void mainAppContainer.offsetWidth; 
            
            mainAppContainer.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)';
            mainAppContainer.style.opacity = '1';

            // Remove o Splash Screen inteiramente da árvore de renderização após o término da animação
            setTimeout(() => {
                splashScreen.style.display = 'none';
                
                // Dispara evento global notificando os outros módulos que o sistema está pronto
                const systemReadyEvent = new CustomEvent('JRAI_Engine_Ready');
                window.dispatchEvent(systemReadyEvent);
            }, 800);
        }

        // Efeito visual opcional: Animação sutil de entrada nos mini-cards de recursos ao carregar
        animateFeatureCards();
    });

    /**
     * Aplica um atraso escalonado (stagger effect) nos cards informativos do splash screen
     */
    function animateFeatureCards() {
        const cards = document.querySelectorAll('.feature-mini-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 + (index * 60)); // Efeito cascata elegante
        });
    }

})();
