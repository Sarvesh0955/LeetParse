import cppTemplateContent from './template.cpp?raw';
import pythonTemplateContent from './template.py?raw';
import javaTemplateContent from './template.java?raw';

const TEMPLATES = {
    cpp: cppTemplateContent,
    python: pythonTemplateContent,
    java: javaTemplateContent
};

// Generates the input code for special class problems - C++
function solutionClassInputCodeCpp(data) {
    if (!data || !data.inputCode || !data.parameters || !data.parameters[0]) {
        console.error("Invalid data structure for solution class");
        return '';
    }
    
    let inputStatements = '';
    let solution = '';
    if (data.parameters[0][1] && Array.isArray(data.parameters[0][1])) {
        data.parameters[0][1].forEach(param => {
            if (Array.isArray(param) && param.length === 2) {
                const [paramType, paramName] = param;
                inputStatements += `        ${paramType};\n`;
                inputStatements += `        input(${paramName});\n`;
                solution += `${paramName},`;
            }
        });
    }
    
    let functionName = data.parameters[0][0];
    if (!functionName) {
        console.error("Function name is missing");
        functionName = "unknownFunction";
    }
    
    const returnType = data.parameters[0][2];
    const hasReturnType = returnType && returnType !== 'void';
    if (hasReturnType) {
        inputStatements += `        Solution obj;\n        output(obj.${functionName}(`;
        solution = solution.slice(0, -1) + '));\n        cout << endl;';
    } else {
        inputStatements += `        Solution obj;\n        obj.${functionName}(`;
        solution = solution.slice(0, -1) + ');';
    }
    
    inputStatements += `${solution}`;
    return inputStatements;
}

function specialClassInputCodeCpp(data) {
    if (!data || !data.parameters || !Array.isArray(data.parameters) || data.parameters.length < 1) {
        console.error("Invalid data structure for special class");
        return '';
    }
    
    let inputStatements = '';
    if (data.parameters[0] && data.parameters[0].length === 3) {
        inputStatements += `        int operations;\n`;
        inputStatements += `        input(operations);\n`;
        inputStatements += `        string operation;\n`;
        inputStatements += `        input(operation);\n`;
        inputStatements += `        int params;\n`;
        inputStatements += `        input(params);\n`;
        inputStatements += `        cout << "null ";\n`;

        const [className, constructorParams] = data.parameters[0];
        if (!className) {
            console.error("Class name is missing");
            return '';
        }
        
        if (constructorParams && Array.isArray(constructorParams)) {
            constructorParams.forEach(param => {
                if (Array.isArray(param) && param.length === 2) {
                    const [paramType, paramName] = param;
                    inputStatements += `        ${paramType};\n`;
                    inputStatements += `        input(${paramName});\n`;
                }
            });
        }
        
        inputStatements += `        ${className}* obj = new ${className}(`;
        if (constructorParams && Array.isArray(constructorParams)) {
            let constructorArgs = constructorParams.map(param => param[1]).join(', ');
            inputStatements += `${constructorArgs});\n`;
        } else {
            inputStatements += ');\n';
        }
        
        inputStatements += `        for (int op = 0; op < operations - 1; op++) {\n`;
        inputStatements += `            input(operation);\n`;
        inputStatements += `            input(params);\n`;
        
        if (!data.problemClass) {
            inputStatements += `            if (operation == "constructor") {\n                cout << "null ";\n                continue;\n            }\n`;
        } else {
            inputStatements += `            if (operation == "${data.problemClass}") {\n                cout << "null ";\n                continue;\n            }\n`;
        }
        
        for (let i = 1; i < data.parameters.length; i++) {
            if (Array.isArray(data.parameters[i]) && data.parameters[i].length === 3) {
                const [methodName, methodParams, returnType] = data.parameters[i];
                if (!methodName) {
                    console.warn(`Method name missing at index ${i}`);
                    continue;
                }
                
                inputStatements += `            else if (operation == "${methodName}") {\n`;
                
                if (methodParams && Array.isArray(methodParams)) {
                    methodParams.forEach(param => {
                        if (Array.isArray(param) && param.length === 2) {
                            const [paramType, paramName] = param;
                            inputStatements += `                ${paramType};\n`;
                            inputStatements += `                input(${paramName});\n`;
                        }
                    });
                }
                inputStatements += `                `;

                const methodHasReturn = (returnType && returnType !== 'void');
                if (methodHasReturn) {
                    inputStatements += `output(obj->${methodName}(`;
                } else {
                    inputStatements += `obj->${methodName}(`;
                }
                
                if (methodParams && Array.isArray(methodParams)) {
                    let args = methodParams.map(param => param[1]).join(', ');
                    if (methodHasReturn) {
                        inputStatements += `${args}));\n`;
                        inputStatements += `                cout << " ";\n`;
                    }
                    else {  
                        inputStatements += `${args});\n`;
                        inputStatements += `                cout << "null ";\n`;
                    }
                } else {
                    if (methodHasReturn) {
                        inputStatements += '));\n';
                        inputStatements += `                cout << " ";\n`;
                    }
                    else {
                        inputStatements += ');\n';
                        inputStatements += `                cout << "null ";\n`;
                    }
                }
                inputStatements += `            }\n`;
            }
        }
        inputStatements += `        }\n`;
        inputStatements += `        cout << endl;\n`;
    } else {
        console.error("Invalid parameters format for special class");
    }
    return inputStatements;
}

// Python version of solutionClassInputCode
function solutionClassInputCodePython(data) {
    if (!data || !data.inputCode || !data.parameters || !data.parameters[0]) {
        console.error("Invalid data structure for solution class");
        return '';
    }
    
    let inputStatements = '';
    let solution = '';
    if (data.parameters[0][1] && Array.isArray(data.parameters[0][1])) {
        data.parameters[0][1].forEach(param => {
            if (Array.isArray(param) && param.length === 2) {
                const [paramType, paramName] = param;
                inputStatements += `        ${paramName} = input_data("${paramType}")\n`;
                solution += `${paramName}, `;
            }
        });
    }
    
    let functionName = data.parameters[0][0];
    if (!functionName) {
        console.error("Function name is missing");
        functionName = "unknownFunction";
    }
    
    const returnType = data.parameters[0][2];
    const hasReturnType = returnType && returnType !== 'void';
    if (hasReturnType) {
        inputStatements += `        solution = Solution()\n        result = solution.${functionName}(`;
        solution = solution.slice(0, -2) + ')\n        output_data(result)\n        print()';
    } else {
        inputStatements += `        solution = Solution()\n        solution.${functionName}(`;
        solution = solution.slice(0, -2) + ')';
    }
    
    inputStatements += `${solution}`;
    return inputStatements;
}

// Java version of solutionClassInputCode
function solutionClassInputCodeJava(data) {
    if (!data || !data.inputCode || !data.parameters || !data.parameters[0]) {
        console.error("Invalid data structure for solution class");
        return '';
    }
    
    let inputStatements = '';
    let solution = '';
    if (data.parameters[0][1] && Array.isArray(data.parameters[0][1])) {
        data.parameters[0][1].forEach(param => {
            if (Array.isArray(param) && param.length === 2) {
                const [paramType, paramName] = param;
                const javaType = convertToJavaType(paramType);
                inputStatements += `            ${javaType} ${paramName} = `;
                inputStatements += getJavaInputCall(paramType) + ';\n';
                solution += `${paramName}, `;
            }
        });
    }
    
    let functionName = data.parameters[0][0];
    if (!functionName) {
        console.error("Function name is missing");
        functionName = "unknownFunction";
    }
    
    const returnType = data.parameters[0][2];
    const hasReturnType = returnType && returnType !== 'void';
    if (hasReturnType) {
        inputStatements += `            Solution solution = new Solution();\n            IO.output(solution.${functionName}(`;
        solution = solution.slice(0, -2) + '));\n            System.out.println();';
    } else {
        inputStatements += `            Solution solution = new Solution();\n            solution.${functionName}(`;
        solution = solution.slice(0, -2) + ');';
    }
    
    inputStatements += `${solution}`;
    return inputStatements;
}

// Python version of specialClassInputCode
function specialClassInputCodePython(data) {
    if (!data || !data.parameters || !Array.isArray(data.parameters) || data.parameters.length < 1) {
        console.error("Invalid data structure for special class");
        return '';
    }
    
    let inputStatements = '';
    if (data.parameters[0] && data.parameters[0].length === 3) {
        inputStatements += `        operations = int(input())\n`;
        inputStatements += `        operation = input().strip()\n`;
        inputStatements += `        params = int(input())\n`;
        inputStatements += `        print("null", end=" ")\n`;

        const [className, constructorParams] = data.parameters[0];
        if (!className) {
            console.error("Class name is missing");
            return '';
        }
        
        if (constructorParams && Array.isArray(constructorParams)) {
            constructorParams.forEach(param => {
                if (Array.isArray(param) && param.length === 2) {
                    const [paramType, paramName] = param;
                    inputStatements += `        ${paramName} = input_data("${paramType}")\n`;
                }
            });
        }
        
        inputStatements += `        obj = ${className}(`;
        if (constructorParams && Array.isArray(constructorParams)) {
            let constructorArgs = constructorParams.map(param => param[1]).join(', ');
            inputStatements += `${constructorArgs})\n`;
        } else {
            inputStatements += ')\n';
        }
        
        inputStatements += `        for _ in range(operations - 1):\n`;
        inputStatements += `            operation = input().strip()\n`;
        inputStatements += `            params = int(input())\n`;
        
        if (!data.problemClass) {
            inputStatements += `            if operation == "constructor":\n                print("null", end=" ")\n                continue\n`;
        } else {
            inputStatements += `            if operation == "${data.problemClass}":\n                print("null", end=" ")\n                continue\n`;
        }
        
        for (let i = 1; i < data.parameters.length; i++) {
            if (Array.isArray(data.parameters[i]) && data.parameters[i].length === 3) {
                const [methodName, methodParams, returnType] = data.parameters[i];
                if (!methodName) {
                    console.warn(`Method name missing at index ${i}`);
                    continue;
                }
                
                inputStatements += `            elif operation == "${methodName}":\n`;
                
                if (methodParams && Array.isArray(methodParams)) {
                    methodParams.forEach(param => {
                        if (Array.isArray(param) && param.length === 2) {
                            const [paramType, paramName] = param;
                            inputStatements += `                ${paramName} = input_data("${paramType}")\n`;
                        }
                    });
                }

                const methodHasReturn = (returnType && returnType !== 'void');
                if (methodHasReturn) {
                    inputStatements += `                result = obj.${methodName}(`;
                    if (methodParams && Array.isArray(methodParams)) {
                        let args = methodParams.map(param => param[1]).join(', ');
                        inputStatements += `${args})\n`;
                        inputStatements += `                output_data(result)\n`;
                    } else {
                        inputStatements += ')\n';
                        inputStatements += `                output_data(result)\n`;
                    }
                } else {
                    inputStatements += `                obj.${methodName}(`;
                    if (methodParams && Array.isArray(methodParams)) {
                        let args = methodParams.map(param => param[1]).join(', ');
                        inputStatements += `${args})\n`;
                    } else {
                        inputStatements += ')\n';
                    }
                    inputStatements += `                print("null", end=" ")\n`;
                }
            }
        }
        inputStatements += `        print()\n`;
    } else {
        console.error("Invalid parameters format for special class");
    }
    return inputStatements;
}

// Java version of specialClassInputCode
function specialClassInputCodeJava(data) {
    if (!data || !data.parameters || !Array.isArray(data.parameters) || data.parameters.length < 1) {
        console.error("Invalid data structure for special class");
        return '';
    }
    
    let inputStatements = '';
    if (data.parameters[0] && data.parameters[0].length === 3) {
        inputStatements += `            int operations = IO.readInt();\n`;
        inputStatements += `            String operation = IO.readString();\n`;
        inputStatements += `            int params = IO.readInt();\n`;
        inputStatements += `            System.out.print("null ");\n`;

        const [className, constructorParams] = data.parameters[0];
        if (!className) {
            console.error("Class name is missing");
            return '';
        }
        
        if (constructorParams && Array.isArray(constructorParams)) {
            constructorParams.forEach(param => {
                if (Array.isArray(param) && param.length === 2) {
                    const [paramType, paramName] = param;
                    const javaType = convertToJavaType(paramType);
                    inputStatements += `            ${javaType} ${paramName} = `;
                    inputStatements += getJavaInputCall(paramType) + ';\n';
                }
            });
        }
        
        inputStatements += `            ${className} obj = new ${className}(`;
        if (constructorParams && Array.isArray(constructorParams)) {
            let constructorArgs = constructorParams.map(param => param[1]).join(', ');
            inputStatements += `${constructorArgs});\n`;
        } else {
            inputStatements += ');\n';
        }
        
        inputStatements += `            for (int op = 0; op < operations - 1; op++) {\n`;
        inputStatements += `                operation = IO.readString();\n`;
        inputStatements += `                params = IO.readInt();\n`;
        
        if (!data.problemClass) {
            inputStatements += `                if (operation.equals("constructor")) {\n                    System.out.print("null ");\n                    continue;\n                }\n`;
        } else {
            inputStatements += `                if (operation.equals("${data.problemClass}")) {\n                    System.out.print("null ");\n                    continue;\n                }\n`;
        }
        
        for (let i = 1; i < data.parameters.length; i++) {
            if (Array.isArray(data.parameters[i]) && data.parameters[i].length === 3) {
                const [methodName, methodParams, returnType] = data.parameters[i];
                if (!methodName) {
                    console.warn(`Method name missing at index ${i}`);
                    continue;
                }
                
                inputStatements += `                else if (operation.equals("${methodName}")) {\n`;
                
                if (methodParams && Array.isArray(methodParams)) {
                    methodParams.forEach(param => {
                        if (Array.isArray(param) && param.length === 2) {
                            const [paramType, paramName] = param;
                            const javaType = convertToJavaType(paramType);
                            inputStatements += `                    ${javaType} ${paramName} = `;
                            inputStatements += getJavaInputCall(paramType) + ';\n';
                        }
                    });
                }

                const methodHasReturn = (returnType && returnType !== 'void');
                if (methodHasReturn) {
                    inputStatements += `                    IO.output(obj.${methodName}(`;
                    if (methodParams && Array.isArray(methodParams)) {
                        let args = methodParams.map(param => param[1]).join(', ');
                        inputStatements += `${args}));\n`;
                    } else {
                        inputStatements += '));\n';
                    }
                } else {
                    inputStatements += `                    obj.${methodName}(`;
                    if (methodParams && Array.isArray(methodParams)) {
                        let args = methodParams.map(param => param[1]).join(', ');
                        inputStatements += `${args});\n`;
                    } else {
                        inputStatements += ');\n';
                    }
                    inputStatements += `                    System.out.print("null ");\n`;
                }
                inputStatements += `                }\n`;
            }
        }
        inputStatements += `            }\n`;
        inputStatements += `            System.out.println();\n`;
    } else {
        console.error("Invalid parameters format for special class");
    }
    return inputStatements;
}

// Helper functions for Java type conversion
function convertToJavaType(cppType) {
    const typeMap = {
        'int': 'int',
        'string': 'String',
        'bool': 'boolean',
        'vector<int>': 'int[]',
        'vector<string>': 'String[]',
        'vector<vector<int>>': 'int[][]',
        'ListNode': 'ListNode',
        'TreeNode': 'TreeNode'
    };
    return typeMap[cppType] || cppType;
}

function getJavaInputCall(cppType) {
    const inputMap = {
        'int': 'IO.readInt()',
        'string': 'IO.readString()',
        'bool': 'IO.readBoolean()',
        'vector<int>': 'IO.readIntArray()',
        'vector<string>': 'IO.readStringArray()',
        'vector<vector<int>>': 'IO.readInt2DArray()',
        'ListNode': 'IO.readLinkedList()',
        'TreeNode': 'IO.readBinaryTree()'
    };
    return inputMap[cppType] || 'IO.readString()';
}

/**
 * Generates the input code for the main function based on the provided parameters.
 * @param {Object} data - The data object containing inputCode and parameters.
 * @param {string} language - The programming language to generate code for.
 * @returns {string} The formatted complete code with solution class and input statements.
 */
async function generateCode(data, language = 'cpp') {
    if (!data) {
        throw new Error('No data provided for code generation.');
    }
    
    if (!TEMPLATES[language]) {
        console.log(`Language ${language} not yet implemented, using C++ instead`);
        language = 'cpp';
    }
    
    if (!data.inputCode) {
        throw new Error('Invalid data provided. inputCode is required.');
    }
    
    if (typeof data.inputCode !== 'string') {
        throw new Error('inputCode must be a string.');
    }
    
    if (!data.parameters || !Array.isArray(data.parameters)) {
        throw new Error('Parameters must be provided as an array.');
    }

    let inputStatements = '';
    
    try {
        if(data.parameters.length <= 1) {
            if (language === 'python') {
                inputStatements = solutionClassInputCodePython(data);
            } else if (language === 'java') {
                inputStatements = solutionClassInputCodeJava(data);
            } else {
                inputStatements = solutionClassInputCodeCpp(data);
            }
        } else {
            if (language === 'python') {
                inputStatements = specialClassInputCodePython(data);
            } else if (language === 'java') {
                inputStatements = specialClassInputCodeJava(data);
            } else {
                inputStatements = specialClassInputCodeCpp(data);
            }
        }
        
        if (!inputStatements) {
            console.warn('Generated input statements are empty.');
        }

        // Get user template from storage
        let userTemplate = '';
        try {
            const result = await chrome.storage.sync.get(['userTemplate']);
            userTemplate = result.userTemplate || '';
        } catch (error) {
            console.warn('Failed to get user template from storage:', error);
        }
        
        let generatedCode = TEMPLATES[language]
            .replace('{{Solution Class}}', data.userCode)
            .replace('{{Input Statements}}', inputStatements || '')
            .replace('{{user template}}', userTemplate);
        
        generatedCode = generatedCode
            .replace(/\u00A0/g, ' ')  
            .replace(/[\t\f\v\r]+/g, ' '); 
            
        return generatedCode.trim();
    } catch (error) {
        console.error('Error generating code:', error);
        throw new Error(`Failed to generate code: ${error.message}`);
    }
}

export { generateCode };