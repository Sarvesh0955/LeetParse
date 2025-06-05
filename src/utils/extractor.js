/**
 * Extracts test cases from the LeetCode problem page
 * @returns {Object} The extracted problem data
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
 * Extracts input code data from the LeetCode problem page
 * @returns {Object} The extracted problem data
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
  } catch (error) {
    console.error("Error extracting code:", error);
  }
  if (userCode) {
    try {
      if (userCode.startsWith('"') && userCode.endsWith('"')) {
        const parsedCode = JSON.parse(userCode);
        userCode = parsedCode;
      }
    } catch (error) {
      console.error("Error parsing code from localStorage:", error);
    }
  }
  return userCode;
}

/**
 * Extracts problem name from a LeetCode URL
 * @param {string} url - The LeetCode problem URL
 * @returns {string} The extracted problem name in a readable format
 */
function extractProblemSlug(url) {
  try {
    const match = url.match(/\/problems\/([^\/]+)/);

    if (!match || !match[1]) {
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
 * @returns {Promise<Object>} The problem details from API
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
 * Extracts data from the LeetCode problem page
 * @returns {Object} The extracted problem data
 */
async function extractData() {
  const problemData = {
    userCode: '',
    inputCode: '',
    testCases: ''
  };
  try {
    const url = window.location.href;
    problemData.problemName = extractProblemSlug(url);

    const problemDetails = await fetchProblemDetails(url);
    if (problemDetails && problemDetails.data) {
      problemData.inputCode = problemDetails.data.question.codeSnippets
        .find((snippet) => snippet.langSlug === "cpp")?.code;
      problemData.testCases = problemDetails.data.question.exampleTestcaseList
                              .join("\n").trim();
    }

    problemData.userCode = extractUserCode(problemDetails.data.question.questionId, 'cpp') || problemData.inputCode;
  } catch (error) {
    console.error("Error extracting data:", error);
  }
  return problemData;
}

export { extractData };
