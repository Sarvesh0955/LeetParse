export const pythonConfig = {
  id: 'python3',
  name: 'Python',
  extension: '.py',
  fileTemplate: 'template.py',
  leetcodeSlug: 'python3',
  supportsClasses: true,
  supportsTemplates: false,
  defaultIncludes: [
    'from typing import *',
    'import sys',
    'import json'
  ],
  dataTypes: {
    'int': 'int',
    'string': 'str',
    'boolean': 'bool',
    'array': 'List[int]',
    'matrix': 'List[List[int]]',
    'linkedlist': 'Optional[ListNode]',
    'tree': 'Optional[TreeNode]'
  }
};