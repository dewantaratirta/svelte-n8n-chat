import { writable } from 'svelte/store';

/**
 * @typedef {Object} ApiConfig
 * @property {string} WEBHOOK_URL - The URL for the webhook
 * @property {string} SESSION_ID - The session identifier
 */

/**
 * Default configuration values
 * @type {ApiConfig}
 */
const DEFAULT_CONFIG = {
  WEBHOOK_URL: '',
  HISTORY_URL: '',
  SESSION_ID: '',
};

/**
 * Create a writable store with the API configuration
 */
const createConfigStore = (options = DEFAULT_CONFIG) => {
  const { subscribe, set, update } = writable(options);

  return {
    subscribe,
    /**
     * Set a specific configuration option
     * @param {string} key - The configuration key
     * @param {any} value - The configuration value
     */
    setOption: (key, value) => update(config => ({ ...config, [key]: value })),
    /**
     * Update multiple configuration options at once
     * @param {Partial<ApiConfig>} options - The options to update
     */
    updateConfig: (options) => update(config => ({ ...config, ...options })),
    /**
     * Reset the configuration to default values
     */
    reset: () => set(options)
  };
};

// Export the store instance
export const configStore = createConfigStore();

/**
 * Helper to get the current config as a plain object
 * @returns {ApiConfig} The current configuration object
 */
export function getConfig() {
  let currentConfig;
  const unsubscribe = configStore.subscribe(value => {
    currentConfig = value;
  });
  unsubscribe();
  return currentConfig;
}
