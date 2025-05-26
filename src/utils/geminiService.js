const FIXED_PROMPT = `
You are a “LeetCode → Codeforces I/O Converter”.

Your only job is to take a LeetCode test case and given solution class and output exactly one JSON object with two fields:

{
  "cfInput":   "<CF-style multi-test input>",
  "boilerplateCode": "<C++ CF-style I/O wrapper>"
}

1. General Rules
   • Do NOT generate any solution logic or algorithm.
   • Do NOT include comments in the boilerplate code.
   • Do NOT hard-code any values—your code must parse any valid input.

2. cfInput Field
   A single string that represents all sample tests merged into one Codeforces-style input:
   1. T — number of sample test cases (first line).
   2. For each test case (in original order):
      – Flatten every parameter into whitespace-separated tokens or lines, one parameter per line.
      – Remove JSON-style brackets ([ ]) and commas (,).
      – Strings: output without quotes.
      – Booleans: output as 1 or 0.
      – Arrays: inline their elements as space-separated tokens.
      – 2D arrays or nested lists: each subarray on its own line.

   Examples:
     LeetCode sample:  
       x = [1,2]  
       s = "hi"  
       flag = true  
       mat = [[1,2],[1,3],[3,4],[3,5]]  
     ⇒ CF-style:  
     1      ← T = 1 sample  
     2      ← size of x  
     1 2    ← elements of x  
     hi     ← string s  
     true   ← boolean flag  
     4 2    ← number of rows in mat and number of element in each row
     1 2    ← first row  
     1 3    ← second row  
     3 4    ← third row  
     3 5    ← fourth row  

3. boilerplateCode Field
   A single C++ code skeleton that:

   #include <bits/stdc++.h>
   using namespace std;

   class Solution {
    public:
      //provided input function
   };

   int main() {
       ios::sync_with_stdio(false);
       cin.tie(nullptr);

       int T;
       cin >> T;
       while (T--) {
           // 1) read each parameter exactly as laid out in cfInput
           // 2) invoke Solution solution;
           // 3) call solution.someMethod(...);
           // 4) print the result to cout << result << '\n';
       }
       return 0;
   }

   Requirements:
   • Include #include <bits/stdc++.h> and standard ios setup.
   • Read T, then loop over all test cases.
   • Parse each parameter in the same order and format as in cfInput.
   • Instantiate the user’s Solution class and call its method.
   • Print each test’s output on its own line.

4. Final Output
   Return exactly one JSON object. No extra text. Example:

   {
     "cfInput": "3\n2\n1 2\nhi\ntrue\n...\n",
     "boilerplateCode": "#include <bits/stdc++.h>\nusing namespace std;\n...\n"
   }

Here is your input:

{
  "testCases": "{{testCases}}",
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
      .replace('{{testCases}}', problemData.testCases)
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