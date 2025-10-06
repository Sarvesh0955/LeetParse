export const cppConfig = {
  id: 'cpp',
  name: 'C++',
  extension: '.cpp',
  fileTemplate: 'template.cpp',
  leetcodeSlug: 'cpp',
  supportsClasses: true,
  supportsTemplates: true,
  defaultIncludes: [
    '#include<bits/stdc++.h>',
    'using namespace std;'
  ],
  dataTypes: {
    'int': 'int',
    'string': 'string',
    'boolean': 'bool',
    'array': 'vector',
    'matrix': 'vector<vector<{type}>>',
    'linkedlist': 'ListNode*',
    'tree': 'TreeNode*'
  }
};