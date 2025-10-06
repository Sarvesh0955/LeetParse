export const javaConfig = {
  id: 'java',
  name: 'Java',
  extension: '.java',
  fileTemplate: 'template.java',
  leetcodeSlug: 'java',
  supportsClasses: true,
  supportsTemplates: false,
  defaultIncludes: [
    'import java.util.*;',
    'import java.io.*;'
  ],
  dataTypes: {
    'int': 'int',
    'string': 'String',
    'boolean': 'boolean',
    'array': 'int[]',
    'matrix': 'int[][]',
    'linkedlist': 'ListNode',
    'tree': 'TreeNode'
  }
};