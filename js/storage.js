/**
 * ==========================================================================
 * JESUS REINA AI V3 ULTRA ENGINE — STORAGE SYSTEM
 * ==========================================================================
 * Repository Feature: Safe LocalStorage abstraction layer for state persistence.
 * Architecture: Vanilla JS Enterprise Pattern (IIFE Isolation)
 * Core Function: Save, load, and clear configurations or workspace caches.
 */

(function () {
    'use strict';

    const PREFIX = 'JRAI_V3_';

    window.JRAI_Storage = {
        /**
         * Grava um dado de forma segura convertendo para string JSON
         * @param {string} key - Chave de identificação
         * @param {any} value - Valor ou objeto a ser armazenado
         */
        set(key, value) {
            try {
                const serializedValue = JSON.stringify(value);
                localStorage.setItem(`${PREFIX}${key}`, serializedValue);
                return true;
            } catch (err) {
                console.error(`[JR AI V3 Storage] Erro ao gravar chave "${key}":`, err);
                return false;
            }
        },

        /**
         * Recupera e faz o parse do dado armazenado
         * @param {string} key - Chave de identificação
         * @param {any} defaultValue - Retorno padrão caso a chave não exista
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(`${PREFIX}${key}`);
                return item ? JSON.parse(item) : defaultValue;
            } catch (err) {
                console.error(`[JR AI V3 Storage] Erro ao ler chave "${key}":`, err);
                return defaultValue;
            }
        },

        /**
         * Remove uma chave específica do armazenamento
         * @param {string} key - Chave a ser deletada
         */
        remove(key) {
            try {
                localStorage.removeItem(`${PREFIX}${key}`);
                return true;
            } catch (err) {
                console.error(`[JR AI V3 Storage] Erro ao remover chave "${key}":`, err);
                return false;
            }
        },

        /**
         * Limpa todos os dados gerados exclusivamente por esta Engine
         */
        clearEngineStorage() {
            try {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith(PREFIX)) {
                        localStorage.removeItem(key);
                    }
                });
                console.log('[JR AI V3 Storage] Memória de cache da Engine limpa.');
                return true;
            } catch (err) {
                console.error('[JR AI V3 Storage] Falha na purga do Storage:', err);
                return false;
            }
        }
    };
})();
