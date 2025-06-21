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

/**
 * Extracts user's solution code from the browser localStorage
 * @param {string} questionID - The ID of the LeetCode question
 * @param {string} language - The programming language used (default is 'cpp')
 * @returns {string} The user's code as a string
 */
function extractUserCode(questionID, language = 'cpp') {
  let userCode = '';
  try {
    const localStorageKeys = Object.keys(localStorage);
    const codeKey = localStorageKeys.find(key => 
      key.startsWith(`${questionID}_`) && key.endsWith(`_${language}`)
    );

    if (codeKey) {
      userCode = localStorage.getItem(codeKey);
    } else {
      console.log(`No code found for question ID ${questionID} in ${language}`);
    }

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

/**
 * Extracts problem slug from a LeetCode URL
 * @param {string} url - The LeetCode problem URL
 * @returns {string} The extracted problem slug (e.g., "two-sum")
 */
function extractProblemSlug(url) {
  try {
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

/**
 * Fetches problem details from LeetCode GraphQL API
 * @param {string} url - The LeetCode problem URL
 * @returns {Promise<Object|null>} The problem details from API or null if failed
 */
async function fetchProblemDetails(url) {
  try {
    const titleSlug = extractProblemSlug(url);
    if (!titleSlug) {
      console.error("Could not extract problem slug from URL");
      return null;
    }

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

    if (!response.ok) {
      console.error("Failed to fetch problem details:", response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching problem details:", error);
    return null;
  }
}

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
  const problemData = {
    userCode: '',
    inputCode: '',
    testCases: '',
    problemName: ''
  };
  
  try {
    const url = window.location.href;
    problemData.problemName = extractProblemSlug(url);

    const problemDetails = await fetchProblemDetails(url);
    const apiData = problemDetails?.data?.question || null;
    
    if (apiData) {
      problemData.inputCode = apiData.codeSnippets
        .find((snippet) => snippet.langSlug === language)?.code || '';
      
      problemData.testCases = apiData.exampleTestcaseList.join("\n").trim();
      
      problemData.userCode = extractUserCode(apiData.questionId, language) || problemData.inputCode;
    }
    
    if (otherTests) {
      problemData.testCases = extractTestCase();
    }
  } catch (error) {
    console.error("Error extracting data:", error);
  }
  
  return problemData;
}

export { extractData };
