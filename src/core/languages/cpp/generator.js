import templateContent from './template.cpp?raw';

/**
 * C++ specific code generation logic
 */
export class CppCodeGenerator {
  constructor() {
    this.template = templateContent;
  }

  /**
   * Generates the input code for special class problems
   * @param {Object} data - The parsed problem data
   * @returns {string} - Generated input handling code
   */
  generateSolutionClassInputCode(data) {
    if (!data?.parameters?.[0] || !data?.inputCode) {
      console.error("Invalid data structure for solution class:", data);
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
    
    const functionName = data.parameters[0][0] || "unknownFunction";
    if (!data.parameters[0][0]) {
      console.warn("Function name is missing, using default:", functionName);
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

  /**
   * Generates the input code for special class problems (like data structures)
   * @param {Object} data - The parsed problem data
   * @returns {string} - Generated input handling code for class-based problems
   */
  generateSpecialClassInputCode(data) {
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
        console.error("Class name is missing in parameters");
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
      
      // Generate method calls for each method in the class
      for (let i = 1; i < data.parameters.length; i++) {
        if (Array.isArray(data.parameters[i]) && data.parameters[i].length === 3) {
          const [methodName, methodParams, returnType] = data.parameters[i];
          if (!methodName) {
            console.warn(`Method name missing at index ${i}`);
            continue;
          }
          
          inputStatements += `            if (operation == "${methodName}") {\n`;
          
          let paramDeclarations = '';
          let paramList = '';
          if (methodParams && Array.isArray(methodParams)) {
            methodParams.forEach(param => {
              if (Array.isArray(param) && param.length === 2) {
                const [paramType, paramName] = param;
                paramDeclarations += `                ${paramType};\n`;
                paramDeclarations += `                input(${paramName});\n`;
                paramList += `${paramName}, `;
              }
            });
            paramList = paramList.slice(0, -2); // Remove last comma and space
          }
          
          inputStatements += paramDeclarations;
          
          if (returnType && returnType !== 'void') {
            inputStatements += `                output(obj->${methodName}(${paramList}));\n`;
          } else {
            inputStatements += `                obj->${methodName}(${paramList});\n`;
            inputStatements += `                cout << "null";\n`;
          }
          
          inputStatements += `                cout << " ";\n`;
          inputStatements += `                continue;\n`;
          inputStatements += `            }\n`;
        }
      }
      
      inputStatements += `        }\n`;
      inputStatements += `        cout << endl;\n`;
    }
    
    return inputStatements;
  }

  /**
   * Generates the main function input code for regular function problems
   * @param {Object} data - The parsed problem data
   * @returns {string} - Generated input handling code
   */
  generateMainInputCode(data) {
    if (!data || !data.parameters) {
      console.error("Invalid data structure for main input code");
      return '';
    }
    
    let inputStatements = '';
    let outputStatement = '';
    let functionCall = '';
    
    if (Array.isArray(data.parameters) && data.parameters.length > 0) {
      const [functionName, params, returnType] = data.parameters;
      
      if (params && Array.isArray(params)) {
        params.forEach(param => {
          if (Array.isArray(param) && param.length >= 2) {
            const [paramType, paramName] = param;
            inputStatements += `        ${paramType};\n`;
            inputStatements += `        input(${paramName});\n`;
            functionCall += `${paramName}, `;
          }
        });
        functionCall = functionCall.slice(0, -2); // Remove last comma and space
      }
      
      if (returnType && returnType !== 'void') {
        outputStatement = `        output(${functionName}(${functionCall}));\n`;
      } else {
        outputStatement = `        ${functionName}(${functionCall});\n`;
      }
    }
    
    return inputStatements + outputStatement + '        cout << endl;\n';
  }

  /**
   * Main method to generate complete C++ code
   * @param {Object} data - The parsed problem data
   * @param {string} testCases - Test case data
   * @param {string} userCode - User's solution code
   * @returns {string} - Complete generated C++ code
   */
  generateCode(data, testCases, userCode) {
    let generatedCode = this.template;
    
    // User template will be handled by main codegen, just leave the placeholder
    // The main codegen will handle '{{user template}}'
    
    // Replace solution class placeholder
    generatedCode = generatedCode.replace('{{Solution Class}}', userCode || '');
    
    // Generate appropriate input handling based on problem type
    let inputCode = '';
    if (data.isClass) {
      if (data.isSpecialClass) {
        inputCode = this.generateSpecialClassInputCode(data);
      } else {
        inputCode = this.generateSolutionClassInputCode(data);
      }
    } else {
      inputCode = this.generateMainInputCode(data);
    }
    
    // Replace input statements placeholder
    generatedCode = generatedCode.replace('{{Input Statements}}', inputCode);
    
    return generatedCode;
  }
}