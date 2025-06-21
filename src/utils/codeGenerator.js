import templateContent from './template.cpp?raw';

const BASE_TEMPLATE = templateContent;

// Generates the input code for special class problems
function solutionClassInputCode(data) {
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

function specialClassInputCode(data) {
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

/**
 * Generates the input code for the main function based on the provided parameters.
 * @param {Object} data - The data object containing inputCode and parameters.
 * @param {string} language - The programming language to generate code for (default: 'cpp').
 * @returns {string} The formatted complete code with solution class and input statements.
 */
function generateCode(data, language = 'cpp') {
    if (!data) {
        throw new Error('No data provided for code generation.');
    }
    
    if (language !== 'cpp') {
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
            inputStatements = solutionClassInputCode(data);
        } else {
            inputStatements = specialClassInputCode(data);
        }
        
        if (!inputStatements) {
            console.warn('Generated input statements are empty.');
        }
        
        let generatedCode = BASE_TEMPLATE
            .replace('{{Solution Class}}', data.userCode)
            .replace('{{Input Statements}}', inputStatements || '');
        
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