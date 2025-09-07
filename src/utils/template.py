import json
import sys
from typing import List, Optional, Dict, Any, Union
from collections import defaultdict, deque

# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Definition for binary tree
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class IO:
    """
    Input/Output utility class for various data types
    Handles reading from stdin and writing to stdout for different types
    """
    
    @staticmethod
    def read_bool():
        return input().strip().lower() in ['true', '1']
    
    @staticmethod
    def read_int():
        return int(input().strip())
    
    @staticmethod
    def read_float():
        return float(input().strip())
    
    @staticmethod
    def read_string():
        return input().strip()
    
    @staticmethod
    def read_list_int():
        line = input().strip()
        if not line or line == "[]":
            return []
        return list(map(int, line.strip('[]').split(',')))
    
    @staticmethod
    def read_list_string():
        line = input().strip()
        if not line or line == "[]":
            return []
        # Handle quoted strings in list
        line = line.strip('[]')
        if not line:
            return []
        items = []
        current = ""
        in_quotes = False
        for char in line:
            if char == '"' and not in_quotes:
                in_quotes = True
            elif char == '"' and in_quotes:
                in_quotes = False
                items.append(current)
                current = ""
            elif char == ',' and not in_quotes:
                if current and current != ' ':
                    items.append(current.strip())
                current = ""
            else:
                if not (char == ' ' and not in_quotes and not current):
                    current += char
        if current.strip():
            items.append(current.strip())
        return items
    
    @staticmethod
    def read_list_list_int():
        line = input().strip()
        if not line or line == "[]":
            return []
        # Parse nested list format like [[1,2],[3,4]]
        result = []
        line = line.strip('[]')
        if not line:
            return []
        
        i = 0
        while i < len(line):
            if line[i] == '[':
                j = i + 1
                bracket_count = 1
                while j < len(line) and bracket_count > 0:
                    if line[j] == '[':
                        bracket_count += 1
                    elif line[j] == ']':
                        bracket_count -= 1
                    j += 1
                sublist_str = line[i+1:j-1]
                if sublist_str:
                    result.append(list(map(int, sublist_str.split(','))))
                else:
                    result.append([])
                i = j
                while i < len(line) and line[i] in ', ':
                    i += 1
            else:
                i += 1
        return result
    
    @staticmethod
    def read_linked_list():
        values = IO.read_list_int()
        if not values:
            return None
        
        head = ListNode(values[0])
        current = head
        for val in values[1:]:
            current.next = ListNode(val)
            current = current.next
        return head
    
    @staticmethod
    def read_binary_tree():
        line = input().strip()
        if not line or line == "[]" or line == "null":
            return None
        
        # Parse tree in level-order format like [3,9,20,null,null,15,7]
        line = line.strip('[]')
        if not line:
            return None
        
        values = []
        current = ""
        for char in line:
            if char == ',':
                val = current.strip()
                values.append(None if val == "null" else int(val))
                current = ""
            else:
                current += char
        if current.strip():
            val = current.strip()
            values.append(None if val == "null" else int(val))
        
        if not values or values[0] is None:
            return None
        
        root = TreeNode(values[0])
        queue = [root]
        i = 1
        
        while queue and i < len(values):
            node = queue.pop(0)
            
            # Left child
            if i < len(values):
                if values[i] is not None:
                    node.left = TreeNode(values[i])
                    queue.append(node.left)
                i += 1
            
            # Right child
            if i < len(values):
                if values[i] is not None:
                    node.right = TreeNode(values[i])
                    queue.append(node.right)
                i += 1
        
        return root
    
    @staticmethod
    def write_bool(x):
        print("True" if x else "False", end="")
    
    @staticmethod
    def write_int(x):
        print(x, end="")
    
    @staticmethod
    def write_float(x):
        print(x, end="")
    
    @staticmethod
    def write_string(x):
        print(x, end="")
    
    @staticmethod
    def write_list(x):
        if isinstance(x[0], list):
            # Handle nested list
            print("[", end="")
            for i, sublist in enumerate(x):
                if i > 0:
                    print(",", end="")
                IO.write_list(sublist)
            print("]", end="")
        else:
            print("[", end="")
            for i, item in enumerate(x):
                if i > 0:
                    print(",", end="")
                if isinstance(item, str):
                    print(f'"{item}"', end="")
                else:
                    print(item, end="")
            print("]", end="")
    
    @staticmethod
    def write_linked_list(head):
        values = []
        current = head
        while current:
            values.append(current.val)
            current = current.next
        IO.write_list(values)
    
    @staticmethod
    def write_binary_tree(root):
        if not root:
            print("[]", end="")
            return
        
        result = []
        queue = [root]
        
        while queue:
            node = queue.pop(0)
            if node:
                result.append(node.val)
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append(None)
        
        # Remove trailing nulls
        while result and result[-1] is None:
            result.pop()
        
        print("[", end="")
        for i, val in enumerate(result):
            if i > 0:
                print(",", end="")
            if val is None:
                print("null", end="")
            else:
                print(val, end="")
        print("]", end="")

# Convenience functions
def input_data(data_type):
    if data_type == "int":
        return IO.read_int()
    elif data_type == "float":
        return IO.read_float()
    elif data_type == "string":
        return IO.read_string()
    elif data_type == "bool":
        return IO.read_bool()
    elif data_type == "List[int]":
        return IO.read_list_int()
    elif data_type == "List[str]":
        return IO.read_list_string()
    elif data_type == "List[List[int]]":
        return IO.read_list_list_int()
    elif data_type == "ListNode":
        return IO.read_linked_list()
    elif data_type == "TreeNode":
        return IO.read_binary_tree()
    else:
        return input().strip()

def output_data(x):
    if isinstance(x, bool):
        IO.write_bool(x)
    elif isinstance(x, int):
        IO.write_int(x)
    elif isinstance(x, float):
        IO.write_float(x)
    elif isinstance(x, str):
        IO.write_string(x)
    elif isinstance(x, list):
        IO.write_list(x)
    elif isinstance(x, ListNode):
        IO.write_linked_list(x)
    elif isinstance(x, TreeNode):
        IO.write_binary_tree(x)
    else:
        print(x, end="")
    print(" ", end="")

{{user template}}

{{Solution Class}}

if __name__ == "__main__":
    t = int(input())
    for _ in range(t):
{{Input Statements}}