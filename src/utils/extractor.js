/**
 * LeetCode Data Extractor
 * 
 * This module handles extracting problem data directly from LeetCode pages,
 * including test cases, user code, and problem metadata via the LeetCode API.
 */

//------------------------------------------------------------------------------
// TEST CASE EXTRACTION
//------------------------------------------------------------------------------

/**
 * Extracts test cases from the LeetCode problem page's custom test case input
 * @returns {string} The extracted test case data as a string
 */
function extractTestCase() {
  let testCases = '';
  try {
    const testCaseDiv = document.querySelector("div.cm-content");
    if (testCaseDiv) {
      const testCaseLines = testCaseDiv.querySelectorAll(".cm-line");
      const testCaseContentArray = [];
      testCaseLines.forEach((line) => {
        testCaseContentArray.push(line.textContent);
      });

      testCases = testCaseContentArray.join("\n").trim();
    } else {
      console.error("Test case div not found");
    }
  } catch (error) {
    console.error("Error extracting data:", error);
  }
  return testCases;
}

//------------------------------------------------------------------------------
// USER CODE EXTRACTION
//------------------------------------------------------------------------------

/**
 * Extracts user's solution code from the browser localStorage
 * @param {string} questionID - The ID of the LeetCode question
 * @param {string} language - The programming language used (default is 'cpp')
 * @returns {string} The user's code as a string
 */
function extractUserCode(questionID, language = 'cpp') {
  let userCode = '';
  try {
    // Find the user's code in localStorage based on question ID and language
    const localStorageKeys = Object.keys(localStorage);
    const codeKey = localStorageKeys.find(key => 
      key.startsWith(`${questionID}_`) && key.endsWith(`_${language}`)
    );

    // Retrieve and process the code
    if (codeKey) {
      userCode = localStorage.getItem(codeKey);
    } else {
      console.log(`No code found for question ID ${questionID} in ${language}`);
    }
    
    // Handle stringified JSON (LeetCode sometimes stores code as JSON string)
    if (userCode && userCode.startsWith('"') && userCode.endsWith('"')) {
      try {
        userCode = JSON.parse(userCode);
      } catch (parseError) {
        console.error("Error parsing code from localStorage:", parseError);
      }
    }
  } catch (error) {
    console.error("Error extracting code:", error);
  }
  
  return userCode;
}

//------------------------------------------------------------------------------
// URL AND METADATA EXTRACTION
//------------------------------------------------------------------------------

/**
 * Extracts problem slug from a LeetCode URL
 * @param {string} url - The LeetCode problem URL
 * @returns {string} The extracted problem slug (e.g., "two-sum")
 */
function extractProblemSlug(url) {
  try {
    // Extract the problem slug from the URL path
    // Example: https://leetcode.com/problems/two-sum/ -> "two-sum"
    const match = url.match(/\/problems\/([^\/]+)/);

    if (!match || !match[1]) {
      console.warn("Could not extract problem slug from URL:", url);
      return "";
    }
    
    return match[1];
  } catch (error) {
    console.error("Error extracting problem slug:", error);
    return "";
  }
}

//------------------------------------------------------------------------------
// API INTERACTIONS
//------------------------------------------------------------------------------

/**
 * Fetches problem details from LeetCode GraphQL API
 * @param {string} url - The LeetCode problem URL
 * @returns {Promise<Object|null>} The problem details from API or null if failed
 */
async function fetchProblemDetails(url) {
  try {
    // First extract the problem slug from the URL
    const titleSlug = extractProblemSlug(url);
    if (!titleSlug) {
      console.error("Could not extract problem slug from URL");
      return null;
    }

    // Call the LeetCode GraphQL API to get problem details
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query questionDetail($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            titleSlug
            questionId
            codeSnippets {
              code
              lang
              langSlug
            }
            exampleTestcaseList
          }
        }`,
        variables: { titleSlug },
      }),
    });

    // Handle API errors
    if (!response.ok) {
      console.error("Failed to fetch problem details:", response.statusText);
      return null;
    }

    // Parse and return the API response
    return await response.json();
  } catch (error) {
    console.error("Error fetching problem details:", error);
    return null;
  }
}

//------------------------------------------------------------------------------
// MAIN EXTRACTION FUNCTION
//------------------------------------------------------------------------------

/**
 * Main function to extract all necessary data from the LeetCode problem page
 * @param {string} language - Programming language to use (default: 'cpp')
 * @param {boolean} otherTests - Whether to extract test cases from custom input
 * @returns {Object} The extracted problem data object containing:
 *   - userCode: User's solution code if available
 *   - inputCode: Original template code
 *   - testCases: Test case data
 *   - problemName: Slug of the problem
 */
async function extractData(language = 'cpp', otherTests = false) {
  // Initialize the problem data object
  const problemData = {
    userCode: '',
    inputCode: '',
    testCases: '',
    problemName: ''
  };
  
  try {
    // Get the current page URL
    const url = window.location.href;
    problemData.problemName = extractProblemSlug(url);

    // Fetch problem details from the API
    const problemDetails = await fetchProblemDetails(url);
    const apiData = problemDetails?.data?.question || null;
    
    // Extract data from API response
    if (apiData) {
      // Find the code snippet for the specified language
      problemData.inputCode = apiData.codeSnippets
        .find((snippet) => snippet.langSlug === language)?.code || '';
      
      // Get default test cases
      problemData.testCases = apiData.exampleTestcaseList.join("\n").trim();
      
      // Get user's code from localStorage or fall back to template
      problemData.userCode = extractUserCode(apiData.questionId, language) || problemData.inputCode;
    }
    
    // If custom tests are requested, extract from the custom input area
    if (otherTests) {
      problemData.testCases = extractTestCase();
    }
  } catch (error) {
    console.error("Error extracting data:", error);
  }
  
  return problemData;
}

export { extractData };
