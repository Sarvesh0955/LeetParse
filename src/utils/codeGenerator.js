const BASE_TEMPLATE = `
#include<bits/stdc++.h>
using namespace std;

namespace {
    void input(bool& x) { cin >> x; }
    void input(char& x) { cin >> x; }
    void input(int& x) { cin >> x; }
    void input(unsigned int& x) { cin >> x; }
    void input(long int& x) { cin >> x; }
    void input(unsigned long& x) { cin >> x; }
    void input(long long int& x) { cin >> x; }
    void input(unsigned long long& x) { cin >> x; }
    void input(float& x) { cin >> x; }
    void input(double& x) { cin >> x; }
    void input(long double& x) { cin >> x; }
    void input(string& x) { cin >> ws;getline(cin, x); }
    template <typename T>
    void input(vector<T>& x);
    template <typename T>
    void input(vector<vector<T>>& mat);
    template <typename F, typename S>
    void input(pair<F, S>& x);
    template <typename T>
    void input(vector<T>& x) { int n; cin >> n; x.resize(n); for(int i = 0; i < n; i++){ input(x[i]); }}
    template <typename T>
    void input(vector<vector<T>>& mat){ int n, m; cin >> n >> m; mat.resize(n); for(int i = 0; i < n; i++)
        { mat[i].resize(m); for(int j = 0; j < m; j++){ input(mat[i][j]);} }}
    template <typename F, typename S>
    void input(pair<F, S>& x) { input(x.first); input(x.second); }
}

namespace {
    void output(bool x) { cout << (x ? "True" : "False"); }
    void output(char x) { cout << x; }
    void output(int x) { cout << x; }
    void output(unsigned int x) { cout << x; }
    void output(long int x) { cout << x; }
    void output(unsigned long x) { cout << x; }
    void output(long long int x) { cout << x; }
    void output(unsigned long long x) { cout << x; }
    void output(float x) { cout << x; }
    void output(double x) { cout << x; }
    void output(long double x) { cout << x; }
    void output(string x) { cout << x; }
    template <typename T>
    void output(vector<T> x);
    template <typename F, typename S>
    void output(pair<F, S> x);
    template <typename T>
    void output(vector<T> x) { int n = x.size(); for(int i = 0; i < n; i++){ output(x[i]); }}
    template <typename F, typename S>
    void output(pair<F, S> x) { output(x.first); output(x.second); }
}

{{Solution Class}}

int main() {
    int t;
    cin >> t;
    while (t--) {
{{Input Statements}}
    }
    return 0;
}
`;

/**
 * Generates the input code for the main function based on the provided parameters.
 * @param {Object} data - The data object containing inputCode and parameters.
 * @returns {string} The formatted complete code with solution class and input statements.
 */
function generateCode(data) {
    let inputStatements = '';
    let solution = '';
    
    let functionName = '';
    if (data.inputCode) {
        const functionMatch = data.inputCode.match(/class\s+Solution\s*{.*?(?:public:)?\s*(\w+)\s*\(/s);
        if (functionMatch && functionMatch[1]) {
            functionName = functionMatch[1];
            solution = `Solution obj;\n        output(obj.${functionName}(`;
        }
    }
    if (data.parameters && Array.isArray(data.parameters)) {
        data.parameters.forEach(param => {
            if (Array.isArray(param) && param.length === 2) {
                const [paramType, paramName] = param;
                inputStatements += `        ${paramType};\n`;
                inputStatements += `        input(${paramName});\n`;
                solution += `${paramName},`;
            }
        });
    }
    solution = solution.slice(0, -1) + '));\n        cout << endl;';
    inputStatements += `        ${solution}`;

    let generatedCode = BASE_TEMPLATE
        .replace('{{Solution Class}}', (data.inputCode || '').trim())
        .replace('{{Input Statements}}', inputStatements || '');
    
    generatedCode = generatedCode
        .replace(/\u00A0/g, ' ')  
        .replace(/[\t\f\v\r]+/g, ' '); 
        
    return generatedCode.trim();
}

export { generateCode };