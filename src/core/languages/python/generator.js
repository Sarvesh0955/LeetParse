import templateContent from './template.py?raw';

/**
 * Python specific code generation logic
 */
export class PythonCodeGenerator {
  constructor() {
    this.template = templateContent;
  }

  /**
   * Maps Python types to appropriate input method calls
   * @param {string} paramType - The parameter type from function signature
   * @returns {object} - Object with inputMethod and variable assignment
   */
  getInputMethodForType(paramType) {
    const type = paramType.trim();
    
    // Handle 2D arrays/lists first (must come before single arrays)
    if (type.includes('List[List[')) {
      if (type.includes('List[List[int]]')) return { inputMethod: 'IO.Input.read_int_2d_array()' };
      if (type.includes('List[List[str]]')) return { inputMethod: 'IO.Input.read_char_2d_array()' };
      return { inputMethod: 'IO.Input.read_int_2d_array()' }; // default fallback
    }
    
    // Handle single arrays/lists
    if (type.includes('List[')) {
      if (type.includes('List[int]')) return { inputMethod: 'IO.Input.read_int_array()' };
      if (type.includes('List[float]')) return { inputMethod: 'IO.Input.read_float_array()' };
      if (type.includes('List[str]')) return { inputMethod: 'IO.Input.read_string_array()' };
      return { inputMethod: 'IO.Input.read_int_array()' }; // default fallback
    }
    
    // Handle sets and dictionaries
    if (type.includes('Set[int]')) return { inputMethod: 'IO.Input.read_int_set()' };
    if (type.includes('Set[str]')) return { inputMethod: 'IO.Input.read_string_set()' };
    if (type.includes('Dict[int, int]')) return { inputMethod: 'IO.Input.read_int_int_dict()' };
    if (type.includes('Dict[str, int]')) return { inputMethod: 'IO.Input.read_string_int_dict()' };
    
    // Handle tree and linked list structures
    if (type.includes('TreeNode')) return { inputMethod: 'IO.Input.read_tree_node()' };
    if (type.includes('ListNode')) return { inputMethod: 'IO.Input.read_list_node()' };
    
    // Handle tuples
    if (type.includes('Tuple[int, int]')) return { inputMethod: 'IO.Input.read_int_pair()' };
    if (type.includes('Tuple[str, str]')) return { inputMethod: 'IO.Input.read_string_pair()' };
    
    // Handle primitive types
    if (type.includes('int')) return { inputMethod: 'IO.Input.read_int()' };
    if (type.includes('float')) return { inputMethod: 'IO.Input.read_float()' };
    if (type.includes('bool')) return { inputMethod: 'IO.Input.read_bool()' };
    if (type.includes('str')) return { inputMethod: 'IO.Input.read_string()' };
    
    // Default fallback
    return { inputMethod: 'IO.Input.read_int()' };
  }

  /**
   * Generates the input code for regular Solution class problems
   * @param {Object} data - The parsed problem data
   * @returns {string} - Generated input handling code
   */
  generateSolutionClassInputCode(data) {
    if (!data || !data.parameters || !data.parameters[0]) {
      console.error("Invalid data structure for solution class", data);
      return '';
    }
    
    let inputStatements = '';
    let paramList = [];
    
    if (data.parameters[0][1] && Array.isArray(data.parameters[0][1])) {
      data.parameters[0][1].forEach(param => {
        if (Array.isArray(param) && param.length === 2) {
          const [paramType, paramName] = param;
          const inputInfo = this.getInputMethodForType(paramType);
          
          inputStatements += `        ${paramName} = ${inputInfo.inputMethod}\n`;
          paramList.push(paramName);
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
      inputStatements += `        solution = Solution()\n`;
      inputStatements += `        result = solution.${functionName}(${paramList.join(', ')})\n`;
      inputStatements += `        IO.output(result)\n`;
      inputStatements += `        print()\n`;
    } else {
      inputStatements += `        solution = Solution()\n`;
      inputStatements += `        solution.${functionName}(${paramList.join(', ')})\n`;
      inputStatements += `        print("null")\n`;
    }
    
    return inputStatements;
  }

  /**
   * Generates the input code for special class problems (like data structures)
   * @param {Object} data - The parsed problem data
   * @returns {string} - Generated input handling code for class-based problems
   */
  generateSpecialClassInputCode(data) {
    if (!data || !data.parameters || !Array.isArray(data.parameters) || data.parameters.length < 1) {
      console.error("Invalid data structure for special class", data);
      return '';
    }
    
    let inputStatements = '';
    
    if (data.parameters[0] && data.parameters[0].length >= 2) {
      inputStatements += `        operations = IO.Input.read_int()\n`;
      inputStatements += `        operation = IO.Input.read_string()\n`;
      inputStatements += `        params = IO.Input.read_int()\n`;
      inputStatements += `        print("null", end=" ")\n`;

      const [className, constructorParams] = data.parameters[0];
      if (!className) {
        console.error("Class name is missing");
        return '';
      }
      
      let constructorArgs = [];
      if (constructorParams && Array.isArray(constructorParams)) {
        constructorParams.forEach(param => {
          if (Array.isArray(param) && param.length === 2) {
            const [paramType, paramName] = param;
            const inputInfo = this.getInputMethodForType(paramType);
            inputStatements += `        ${paramName} = ${inputInfo.inputMethod}\n`;
            constructorArgs.push(paramName);
          }
        });
      }
      
      inputStatements += `        obj = ${data.problemClass}(${constructorArgs.join(', ')})\n`;
      
      inputStatements += `        for _ in range(operations - 1):\n`;
      inputStatements += `            operation = IO.Input.read_string()\n`;
      inputStatements += `            params = IO.Input.read_int()\n`;
      
      const problemClassName = data.problemClass || className;
      inputStatements += `            if operation == "${problemClassName}":\n`;
      inputStatements += `                print("null", end=" ")\n`;
      inputStatements += `                continue\n`;
      
      // Generate method calls for each method in the class
      for (let i = 1; i < data.parameters.length; i++) {
        if (Array.isArray(data.parameters[i]) && data.parameters[i].length >= 2) {
          const [methodName, methodParams, returnType] = data.parameters[i];
          if (!methodName) {
            console.warn(`Method name missing at index ${i}`);
            continue;
          }
          
          inputStatements += `            if operation == "${methodName}":\n`;
          
          let methodParamList = [];
          if (methodParams && Array.isArray(methodParams)) {
            methodParams.forEach(param => {
              if (Array.isArray(param) && param.length === 2) {
                const [paramType, paramName] = param;
                const inputInfo = this.getInputMethodForType(paramType);
                inputStatements += `                ${paramName} = ${inputInfo.inputMethod}\n`;
                methodParamList.push(paramName);
              }
            });
          }
          
          if (returnType && returnType !== 'void') {
            inputStatements += `                result = obj.${methodName}(${methodParamList.join(', ')})\n`;
            inputStatements += `                IO.output(result)\n`;
          } else {
            inputStatements += `                obj.${methodName}(${methodParamList.join(', ')})\n`;
            inputStatements += `                print("null", end="")\n`;
          }
          
          inputStatements += `                print(end=" ")\n`;
          inputStatements += `                continue\n`;
        }
      }
      
      inputStatements += `        print()\n`;
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
      console.error("Invalid data structure for main input code", data);
      return '';
    }
    
    let inputStatements = '';
    let paramList = [];
    
    if (Array.isArray(data.parameters) && data.parameters.length >= 2) {
      const [functionName, params, returnType] = data.parameters;
      
      if (params && Array.isArray(params)) {
        params.forEach(param => {
          if (Array.isArray(param) && param.length >= 2) {
            const [paramType, paramName] = param;
            const inputInfo = this.getInputMethodForType(paramType);
            inputStatements += `        ${paramName} = ${inputInfo.inputMethod}\n`;
            paramList.push(paramName);
          }
        });
      }
      
      if (returnType && returnType !== 'void') {
        inputStatements += `        result = ${functionName}(${paramList.join(', ')})\n`;
        inputStatements += `        IO.output(result)\n`;
      } else {
        inputStatements += `        ${functionName}(${paramList.join(', ')})\n`;
      }
    }
    
    inputStatements += `        print()\n`;
    return inputStatements;
  }

  /**
   * Main method to generate complete Python code
   * @param {Object} data - The parsed problem data
   * @param {string} testCases - Test case data
   * @param {string} userCode - User's solution code
   * @returns {string} - Complete generated Python code
   */
  generateCode(data, testCases, userCode) {
    let generatedCode = this.template;
    
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