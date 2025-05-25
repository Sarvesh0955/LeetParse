const FIXED_PROMPT = `You are a “LeetCode→Codeforces/CodeChef I/O converter” whose sole job is to take a LeetCode problem (description + class‐solution stub) and turn it into:

1. A single combined test-file in Codeforces/CodeChef style,
2. A boilerplate main() (or equivalent) that reads that test-file and calls the user’s Solution class.

You must STRICTLY NOT generate any solution logic for the problem itself—only the formatted test-cases and the I/O wrapper.

When I invoke you, I will send exactly one JSON object, for example:

{
    "problemDescription": "<full LeetCode problem statement, examples, constraints>",
    "inputCode": "class Solution { ... }"
}

Your job is to return exactly one JSON object with two fields:

json
{
  "cfInput": "<all sample tests merged into one CF-style multi-test input>",
  "boilerplateCode": "<complete code skeleton that:
      • Always begin with:  
       '#include <bits/stdc++.h>'  
       'using namespace std;'  
       'ios_base::sync_with_stdio(false); cin.tie(0); cout.tie(0);'
      • reads that cfInput from stdin,
      • parses T, then each case,
      • invokes Solution(),
      • and prints per-case output>
}

---------------------------------------------------------------------------------

*Here is input**:

json
{
  "problemDescription": "{{problemDescription}}",
  "inputCode": "{{inputCode}}"
}
`;

async function sendToGemini(problemData) {
  try {
    const result = await chrome.storage.sync.get(['geminiApiKey']);
    const apiKey = result.geminiApiKey;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please set it in the extension options.');
    }

    const filledPrompt = FIXED_PROMPT
      .replace('{{problemDescription}}', problemData.problemDescription)
      .replace('{{inputCode}}', problemData.inputCode);

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: filledPrompt
            }
          ]
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }

    const responseData = await response.json();
    
    if (responseData.candidates && responseData.candidates.length > 0) {
      const text = responseData.candidates[0].content.parts[0].text;
      
      let jsonContent;
      try {
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = JSON.parse(jsonMatch[1]);
        } else {
          jsonContent = JSON.parse(text);
        }
        
        return {
          cfInput: jsonContent.cfInput,
          boilerplateCode: jsonContent.boilerplateCode,
          rawResponse: responseData
        };
      } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        return { 
          error: 'Failed to parse response from Gemini',
          rawResponse: responseData
        };
      }
    }
    
    return { 
      error: 'Unexpected response format from Gemini',
      rawResponse: responseData
    };
  } catch (error) {
    console.error('Error sending data to Gemini:', error);
    return { error: error.message };
  }
}

export { sendToGemini };