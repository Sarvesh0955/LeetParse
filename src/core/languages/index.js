import { cppConfig, CppCodeGenerator } from './cpp/index.js';
import { javaConfig, JavaCodeGenerator } from './java/index.js';
import { pythonConfig, PythonCodeGenerator } from './python/index.js';

/**
 * Language registry that manages all supported programming languages
 */
class LanguageRegistry {
  constructor() {
    this.languages = new Map();
    this.generators = new Map();
    
    // Register all supported languages
    this.registerLanguage(cppConfig, CppCodeGenerator);
    this.registerLanguage(javaConfig, JavaCodeGenerator);
    this.registerLanguage(pythonConfig, PythonCodeGenerator);
  }

  /**
   * Register a new language with its config and generator
   * @param {Object} config - Language configuration
   * @param {Class} GeneratorClass - Code generator class
   */
  registerLanguage(config, GeneratorClass) {
    this.languages.set(config.id, config);
    this.generators.set(config.id, GeneratorClass);
  }

  /**
   * Get all supported languages
   * @returns {Array} Array of language configurations
   */
  getAllLanguages() {
    return Array.from(this.languages.values());
  }

  /**
   * Get language configuration by ID
   * @param {string} languageId - Language identifier
   * @returns {Object|null} Language configuration or null if not found
   */
  getLanguageConfig(languageId) {
    return this.languages.get(languageId) || null;
  }

  /**
   * Get code generator for a language
   * @param {string} languageId - Language identifier
   * @returns {Object|null} Code generator instance or null if not found
   */
  getCodeGenerator(languageId) {
    const GeneratorClass = this.generators.get(languageId);
    return GeneratorClass ? new GeneratorClass() : null;
  }

  /**
   * Check if a language is supported
   * @param {string} languageId - Language identifier
   * @returns {boolean} True if language is supported
   */
  isLanguageSupported(languageId) {
    return this.languages.has(languageId);
  }

  /**
   * Get formatted list for UI components
   * @returns {Array} Array with value and label properties
   */
  getLanguageOptions() {
    return this.getAllLanguages().map(lang => ({
      value: lang.id,
      label: lang.name
    }));
  }
}

// Create and export a singleton instance
export const languageRegistry = new LanguageRegistry();

/**
 * Factory function to create code generators
 * @param {string} languageId - Language identifier
 * @returns {Object|null} Code generator instance or null if not supported
 */
export function createCodeGenerator(languageId) {
  return languageRegistry.getCodeGenerator(languageId);
}

/**
 * Get language configuration
 * @param {string} languageId - Language identifier
 * @returns {Object|null} Language configuration or null if not found
 */
export function getLanguageConfig(languageId) {
  return languageRegistry.getLanguageConfig(languageId);
}

/**
 * Get all supported languages
 * @returns {Array} Array of language configurations
 */
export function getSupportedLanguages() {
  return languageRegistry.getAllLanguages();
}

/**
 * Check if language is supported
 * @param {string} languageId - Language identifier
 * @returns {boolean} True if language is supported
 */
export function isLanguageSupported(languageId) {
  return languageRegistry.isLanguageSupported(languageId);
}

// Export individual language exports for backward compatibility
export { cppConfig, CppCodeGenerator };
export { javaConfig, JavaCodeGenerator };
export { pythonConfig, PythonCodeGenerator };