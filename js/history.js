/**
 * ==========================================================================
 * JESUS REINA AI V3 ULTRA ENGINE — HISTORY LOG SYSTEM
 * ==========================================================================
 * Repository Feature: Tracking and auditing user creations (prompts/codes).
 * Architecture: Event-driven log aggregation feeding into UI components.
 * Core Function: Maintains operational history for quick reloads or undo/redo layers.
 */

(function () {
    'use strict';

    // Garante dependência do módulo de Storage
    const storageKey = 'generation_history';

    window.JRAI_History = {
        /**
         * Adiciona um novo registro de geração ao histórico persistente
         * @param {string} type - Tipo da ação ('prompt', 'code', 'app_build')
         * @param {object} payload - Dados gerados (input, output, metadata)
         */
        addRecord(type, payload) {
            if (!window.JRAI_Storage) return;

            const currentHistory = window.JRAI_Storage.get(storageKey, []);
            
            const newRecord = {
                id: window.JRAI_Utils ? window.JRAI_Utils.generateUniqueID() : Date.now(),
                timestamp: new Date().toISOString(),
                type: type,
                data: payload
            };

            // Insere no início do array (Mais recente primeiro)
            currentHistory.unshift(newRecord);

            // Limita o histórico a 50 registros para evitar estouro de memória no client-side
            if (currentHistory.length > 50) {
                currentHistory.pop();
            }

            window.JRAI_Storage.set(storageKey, currentHistory);
            
            // Emite um evento avisando que o histórico foi atualizado
            window.dispatchEvent(new CustomEvent('JRAI_History_Updated', { detail: newRecord }));
            return newRecord;
        },

        /**
         * Recupera todos os registros ou filtra por tipo específico
         * @param {string|null} filterType - Opcional. Filtro por tipo ('code', 'prompt', etc.)
         */
        getRecords(filterType = null) {
            if (!window.JRAI_Storage) return [];
            const all = window.JRAI_Storage.get(storageKey, []);
            
            if (filterType) {
                return all.filter(record => record.type === filterType);
            }
            return all;
        },

        /**
         * Limpa todo o histórico de operações do usuário
         */
        clearAllHistory() {
            if (!window.JRAI_Storage) return false;
            return window.JRAI_Storage.remove(storageKey);
        }
    };

    // Ouvinte global para debugar ações no console em ambiente de desenvolvimento
    window.addEventListener('JRAI_History_Updated', (e) => {
        console.log(`[JR AI V3 History] Novo log registrado [${e.detail.type.toUpperCase()}] ID: ${e.detail.id}`);
    });
})();
