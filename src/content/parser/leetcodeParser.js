/**
 * LeetCode page parser
 * Extracts problem information from LeetCode problem pages
 */

import { parseData } from '../../core/utils/parser.js';

/**
 * Parses a LeetCode problem page and extracts all relevant information
 * @param {string} language - Programming language to parse for
 * @param {boolean} useCustomTests - Whether to extract custom test cases
 * @returns {Promise<Object>} Parsed problem data
 */
export async function parseLeetCodeProblem(language = 'cpp', useCustomTests = false) {
  try {
    const data = await parseData(language, useCustomTests);
    console.log("Parsed data:", data);
    return {
      success: true,
      data,
      language
    };
  } catch (error) {
    console.error("Error parsing problem:", error);
    return {
      success: false,
      error: error.message || "Unknown error parsing problem"
    };
  }
}
