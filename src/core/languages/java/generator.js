import templateContent from './template.java?raw';

/**
 * Java specific code generation logic
 */
export class JavaCodeGenerator {
  constructor() {
    this.template = templateContent;
  }

  /**
   * Maps Java types to appropriate input method calls
   * @param {string} paramType - The parameter type from function signature
   * @returns {object} - Object with inputMethod, declaration, and needsNextLine
   */
  getInputMethodForType(paramType) {
    const type = paramType.trim();
    
    // Handle 2D arrays first (must come before single arrays)
    if (type.includes('[][]')) {
      if (type.includes('int[][]')) return { inputMethod: 'IO.Input.readInt2DArray()', declaration: `int[][] `, needsNextLine: false };
      if (type.includes('char[][]')) return { inputMethod: 'IO.Input.readChar2DArray()', declaration: `char[][] `, needsNextLine: false };
      return { inputMethod: 'IO.Input.readInt2DArray()', declaration: `int[][] `, needsNextLine: false }; // default fallback
    }
    
    // Handle single arrays
    if (type.includes('[]')) {
      if (type.includes('int[]')) return { inputMethod: 'IO.Input.readIntArray()', declaration: `int[] `, needsNextLine: false };
      if (type.includes('long[]')) return { inputMethod: 'IO.Input.readLongArray()', declaration: `long[] `, needsNextLine: false };
      if (type.includes('double[]')) return { inputMethod: 'IO.Input.readDoubleArray()', declaration: `double[] `, needsNextLine: false };
      if (type.includes('String[]')) return { inputMethod: 'IO.Input.readStringArray()', declaration: `String[] `, needsNextLine: false };
      if (type.includes('char[]')) return { inputMethod: 'IO.Input.readCharArray()', declaration: `char[] `, needsNextLine: false };
      return { inputMethod: 'IO.Input.readIntArray()', declaration: `int[] `, needsNextLine: false }; // default fallback
    }
    
    // Handle generics and collections (2D lists first, then single lists)
    if (type.includes('List<List<Integer>>')) return { inputMethod: 'IO.Input.readIntListList()', declaration: `List<List<Integer>> `, needsNextLine: false };
    if (type.includes('List<List<String>>')) return { inputMethod: 'IO.Input.readStringListList()', declaration: `List<List<String>> `, needsNextLine: false };
    if (type.includes('List<Integer>')) return { inputMethod: 'IO.Input.readIntList()', declaration: `List<Integer> `, needsNextLine: false };
    if (type.includes('List<String>')) return { inputMethod: 'IO.Input.readStringList()', declaration: `List<String> `, needsNextLine: false };
    if (type.includes('Set<Integer>')) return { inputMethod: 'IO.Input.readIntSet()', declaration: `Set<Integer> `, needsNextLine: false };
    if (type.includes('Map<Integer, Integer>')) return { inputMethod: 'IO.Input.readIntIntMap()', declaration: `Map<Integer, Integer> `, needsNextLine: false };
    
    // Handle tree and linked list structures
    if (type.includes('TreeNode')) return { inputMethod: 'IO.Input.readTreeNode()', declaration: `TreeNode `, needsNextLine: false };
    if (type.includes('ListNode')) return { inputMethod: 'IO.Input.readListNode()', declaration: `ListNode `, needsNextLine: false };
    
    // Handle primitive types (these need nextLine() to consume the newline)
    if (type.includes('int')) return { inputMethod: 'IO.Input.readInt()', declaration: `int `, needsNextLine: true };
    if (type.includes('long')) return { inputMethod: 'IO.Input.readLong()', declaration: `long `, needsNextLine: true };
    if (type.includes('double')) return { inputMethod: 'IO.Input.readDouble()', declaration: `double `, needsNextLine: true };
    if (type.includes('float')) return { inputMethod: 'IO.Input.readFloat()', declaration: `float `, needsNextLine: true };
    if (type.includes('boolean')) return { inputMethod: 'IO.Input.readBoolean()', declaration: `boolean `, needsNextLine: true };
    if (type.includes('char')) return { inputMethod: 'IO.Input.readChar()', declaration: `char `, needsNextLine: true };
    if (type.includes('String')) return { inputMethod: 'IO.Input.readString()', declaration: `String `, needsNextLine: false };
    
    // Default fallback
    return { inputMethod: 'IO.Input.readInt()', declaration: `int `, needsNextLine: true };
  }

  /**
   * Generates the input code for regular Solution class problems
   * @param {Object} data - The parsed problem data
   * @returns {string} - Generated input handling code
   */
  generateSolutionClassInputCode(data) {
    if (!data?.parameters?.[0]) {
      console.error("Invalid data structure for solution class:", data);
      return '';
    }
    
    let inputStatements = '';
    let solution = '';
    
    if (data.parameters[0][1] && Array.isArray(data.parameters[0][1])) {
      data.parameters[0][1].forEach(param => {
        if (Array.isArray(param) && param.length === 2) {
          const [paramType, paramName] = param;
          const inputInfo = this.getInputMethodForType(paramType);
          
          inputStatements += `            ${inputInfo.declaration}${paramName} = ${inputInfo.inputMethod};\n`;
          if (inputInfo.needsNextLine) {
            inputStatements += `            IO.Input.consumeNewline();\n`;
          }
          solution += `${paramName}, `;
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
      inputStatements += `            Solution obj = new Solution();\n`;
      inputStatements += `            IO.output(obj.${functionName}(`;
      solution = solution.slice(0, -2) + '));\n            System.out.println();';
    } else {
      inputStatements += `            Solution obj = new Solution();\n`;
      inputStatements += `            obj.${functionName}(`;
      solution = solution.slice(0, -2) + ');\n            System.out.println("null");';
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
    if (!data?.parameters?.length || !Array.isArray(data.parameters)) {
      console.error("Invalid data structure for special class:", data);
      return '';
    }
    
    let inputStatements = '';
    
    if (data.parameters[0] && data.parameters[0].length === 3) {
      inputStatements += `            int operations = IO.Input.readInt();\n`;
      inputStatements += `            String operation = IO.Input.readWord();\n`;
      inputStatements += `            int params = IO.Input.readInt();\n`;
      inputStatements += `            System.out.print("[null, ");\n`;

      const [className, constructorParams] = data.parameters[0];
      if (!className) {
        console.error("Class name is missing in parameters");
        return '';
      }
      
      // Generate constructor parameter reading
      let constructorArgs = '';
      if (constructorParams && Array.isArray(constructorParams)) {
        constructorParams.forEach(param => {
          if (Array.isArray(param) && param.length === 2) {
            const [paramType, paramName] = param;
            const inputInfo = this.getInputMethodForType(paramType);
            inputStatements += `            ${inputInfo.declaration}${paramName} = ${inputInfo.inputMethod};\n`;
            if (inputInfo.needsNextLine) {
              inputStatements += `            IO.Input.consumeNewline();\n`;
            }
            constructorArgs += `${paramName}, `;
          }
        });
        constructorArgs = constructorArgs.slice(0, -2); // Remove last comma and space
      }
      
      inputStatements += `            ${className} obj = new ${className}(${constructorArgs});\n`;
      
      inputStatements += `            for (int op = 0; op < operations - 1; op++) {\n`;
      inputStatements += `                operation = IO.Input.readWord();\n`;
      inputStatements += `                params = IO.Input.readInt();\n`;
      
      // Handle constructor calls
      if (!data.problemClass) {
        inputStatements += `                if (operation.equals("constructor")) {\n                    System.out.print("null ");\n                    continue;\n                }\n`;
      } else {
        inputStatements += `                if (operation.equals("${data.problemClass}")) {\n                    System.out.print("null ");\n                    continue;\n                }\n`;
      }
      
      // Generate method calls for each method in the class
      for (let i = 1; i < data.parameters.length; i++) {
        if (Array.isArray(data.parameters[i]) && data.parameters[i].length === 3) {
          const [methodName, methodParams, returnType] = data.parameters[i];
          if (!methodName) {
            console.warn(`Method name missing at index ${i}`);
            continue;
          }
          
          inputStatements += `                if (operation.equals("${methodName}")) {\n`;
          
          let paramDeclarations = '';
          let paramList = '';
          if (methodParams && Array.isArray(methodParams)) {
            methodParams.forEach(param => {
              if (Array.isArray(param) && param.length === 2) {
                const [paramType, paramName] = param;
                const inputInfo = this.getInputMethodForType(paramType);
                paramDeclarations += `                    ${inputInfo.declaration}${paramName} = ${inputInfo.inputMethod};\n`;
                if (inputInfo.needsNextLine) {
                  paramDeclarations += `                    IO.Input.consumeNewline();\n`;
                }
                paramList += `${paramName}, `;
              }
            });
            paramList = paramList.slice(0, -2); // Remove last comma and space
          }
          
          inputStatements += paramDeclarations;
          
          if (returnType && returnType !== 'void') {
            inputStatements += `                    IO.output(obj.${methodName}(${paramList}));\n`;
          } else {
            inputStatements += `                    obj.${methodName}(${paramList});\n`;
            inputStatements += `                    System.out.print("null");\n`;
          }
          
          inputStatements += `                    if(op < operations - 2) {\n`;
          inputStatements += `                        System.out.print(", ");\n`;
          inputStatements += `                    }\n`;
          inputStatements += `                    continue;\n`;
          inputStatements += `                }\n`;
        }
      }
      
      inputStatements += `            }\n`;
      inputStatements += `            System.out.print("]");\n`;
      inputStatements += `            System.out.println();\n`;
    }
    
    return inputStatements;
  }

  /**
   * Main method to generate complete Java code
   * @param {Object} data - The parsed problem data
   * @param {string} testCases - Test case data
   * @param {string} userCode - User's solution code
   * @returns {string} - Complete generated Java code
   */
  generateCode(data, testCases, userCode) {
    let generatedCode = this.template;
    
    // Replace solution class placeholder
    generatedCode = generatedCode.replace('{{Solution Class}}', userCode || '');
    
    // Generate appropriate input handling based on problem type
    let inputCode = '';
    if (data.isSpecialClass) {
      inputCode = this.generateSpecialClassInputCode(data);
    } else {
      inputCode = this.generateSolutionClassInputCode(data);
    }
    
    // Replace input statements placeholder
    generatedCode = generatedCode.replace('{{Input Statements}}', inputCode);
    
    return generatedCode;
  }
}