/**
 * ==========================================================================
 * JESUS REINA AI V3 ULTRA ENGINE — GLOBAL UTILITIES SYSTEM
 * ==========================================================================
 * Repository Feature: Core toolset and micro-helpers for AI engines.
 * Architecture: Global Namespace Export Pattern (Thread-Safe)
 * Core Function: Clipboard control, HTML sanitization, and typing animations.
 */

(function () {
    'use strict';

    // Inicializa o namespace global se não existir
    window.JRAI_Utils = {

        /**
         * Copia um texto para a área de transferência do sistema operacional
         * @param {string} text - O conteúdo textual a ser copiado
         * @param {HTMLElement} triggerElement - O botão que disparou a ação para feedback visual
         * @returns {Promise<boolean>}
         */
        async copyToClipboard(text, triggerElement) {
            if (!text) return false;

            try {
                await navigator.clipboard.writeText(text);
                
                // Feedback visual premium instantâneo
                if (triggerElement) {
                    const originalHTML = triggerElement.innerHTML;
                    triggerElement.innerHTML = '<i class="fa-solid fa-check" style="color: #00ff66;"></i>';
                    triggerElement.style.pointerEvents = 'none';

                    setTimeout(() => {
                        triggerElement.innerHTML = originalHTML;
                        triggerElement.style.pointerEvents = 'auto';
                    }, 2000);
                }
                return true;
            } catch (err) {
                console.error('[JR AI V3 Utils] Falha ao acessar área de transferência:', err);
                return false;
            }
        },

        /**
         * Sanitiza strings brutas prevenindo quebras de layout ou XSS no preview
         * @param {string} str - Texto ou código contendo tags HTML
         * @returns {string} Texto escapado e seguro
         */
        sanitizeHTML(str) {
            if (!str) return '';
            return str.replace(/[&<>"']/g, (match) => {
                const escapeChars = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;'
                };
                return escapeChars[match];
            });
        },

        /**
         * Gera um identificador único alfanumérico (UUID simplificado) para sessões e históricos
         * @returns {string} ID único formatado
         */
        generateUniqueID() {
            return 'jr-engine-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
        },

        /**
         * Cria um efeito de digitação gradual (typewriter) em elementos de texto da IA
         * @param {HTMLElement} element - O elemento HTML de destino
         * @param {string} text - O texto completo a ser renderizado
         * @param {number} speed - Intervalo em milissegundos por caractere (padrão: 15ms)
         * @param {Function} callback - Função opcional disparada ao término da digitação
         */
        typeWriterEffect(element, text, speed = 15, callback = null) {
            if (!element || !text) return;

            let index = 0;
            element.innerHTML = ''; // Limpa o container

            function type() {
                if (index < text.length) {
                    // Trata quebras de linha nativas de forma adequada
                    if (text.charAt(index) === '\n') {
                        element.innerHTML += '<br>';
                    } else {
                        element.innerHTML += text.charAt(index);
                    }
                    index++;
                    setTimeout(type, speed);
                } else if (typeof callback === 'function') {
                    callback();
                }
            }

            type();
        },

        /**
         * Executa um atraso assíncrono controlado (Apenas para simulações visuais e delays de IA)
         * @param {number} ms - Milissegundos de espera
         * @returns {Promise<void>}
         */
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    // Configuração global para os botões de cópia genéricos espalhados pela DOM (.btn-copy)
    document.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('click', (e) => {
            const btnCopy = e.target.closest('.btn-copy');
            if (!btnCopy) return;

            // Busca a zona de código mais próxima relacionada ao botão
            const outputZone = btnCopy.closest('.output-zone');
            if (outputZone) {
                const codeElement = outputZone.querySelector('code');
                if (codeElement) {
                    window.JRAI_Utils.copyToClipboard(codeElement.innerText, btnCopy);
                }
            }
        });
    });

})();
