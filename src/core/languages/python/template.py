from typing import *
import sys
import json
from collections import deque, defaultdict
import re

# Definition for singly-linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Definition for binary tree node
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class IO:
    """
    Input/Output utility class for LeetCode problems
    Handles reading from stdin and writing to stdout for various data types
    """
    
    class Input:
        """Input functions for various data types"""
        
        @staticmethod
        def read_bool() -> bool:
            return input().strip().lower() in ['true', '1', 'yes']
        
        @staticmethod
        def read_int() -> int:
            return int(input().strip())
        
        @staticmethod
        def read_float() -> float:
            return float(input().strip())
        
        @staticmethod
        def read_string() -> str:
            return input().strip()
        
        @staticmethod
        def read_char() -> str:
            return input().strip()[0]
        
        # Array functions
        @staticmethod
        def read_int_array() -> List[int]:
            n = IO.Input.read_int()  # Read array size first
            return list(map(int, input().strip().split()))  # Then read space-separated elements
        
        @staticmethod
        def read_float_array() -> List[float]:
            n = IO.Input.read_int()  # Read array size first
            return list(map(float, input().strip().split()))  # Then read space-separated elements
        
        @staticmethod
        def read_string_array() -> List[str]:
            n = IO.Input.read_int()  # Read array size first
            return [IO.Input.read_string() for _ in range(n)]  # Each string on new line
        
        @staticmethod
        def read_char_array() -> List[str]:
            return list(IO.Input.read_string())
        
        # 2D Array functions
        @staticmethod
        def read_int_2d_array() -> List[List[int]]:
            m = IO.Input.read_int()  # number of rows
            result = []
            for _ in range(m):
                n = IO.Input.read_int()  # number of elements in this row
                row = list(map(int, input().strip().split()))  # space-separated elements
                result.append(row)
            return result
        
        @staticmethod
        def read_char_2d_array() -> List[List[str]]:
            m = IO.Input.read_int()  # number of rows
            result = []
            for _ in range(m):
                row = list(input().strip())
                result.append(row)
            return result
        
        # Set and Dictionary functions
        @staticmethod
        def read_int_set() -> Set[int]:
            return set(map(int, input().strip().split()))
        
        @staticmethod
        def read_string_set() -> Set[str]:
            return set(input().strip().split())
        
        @staticmethod
        def read_int_int_dict() -> Dict[int, int]:
            n = IO.Input.read_int()
            result = {}
            for _ in range(n):
                key, value = map(int, input().strip().split())
                result[key] = value
            return result
        
        @staticmethod
        def read_string_int_dict() -> Dict[str, int]:
            n = IO.Input.read_int()
            result = {}
            for _ in range(n):
                line_parts = input().strip().split()
                key = line_parts[0]
                value = int(line_parts[1])
                result[key] = value
            return result
        
        # Linked List
        @staticmethod
        def read_list_node() -> Optional[ListNode]:
            line = input().strip()
            if not line or line == "[]":
                return None
            
            # Handle [1,2,3] format or space-separated format
            if line.startswith('[') and line.endswith(']'):
                line = line[1:-1]  # Remove brackets
            
            if not line:
                return None
                
            values = [int(x.strip()) for x in line.split(',') if x.strip()]
            if not values:
                return None
                
            head = ListNode(values[0])
            current = head
            for i in range(1, len(values)):
                current.next = ListNode(values[i])
                current = current.next
            return head
        
        # Binary Tree (level-order traversal format)
        @staticmethod
        def read_tree_node() -> Optional[TreeNode]:
            line = input().strip()
            if not line or line == "[]":
                return None
            
            # Handle [1,2,3,null,null,4,5] format
            if line.startswith('[') and line.endswith(']'):
                line = line[1:-1]  # Remove brackets
            
            if not line:
                return None
                
            values = []
            for val_str in line.split(','):
                val_str = val_str.strip()
                if val_str.lower() == 'null':
                    values.append(None)
                else:
                    values.append(int(val_str))
            
            if not values or values[0] is None:
                return None
            
            root = TreeNode(values[0])
            queue = deque([root])
            i = 1
            
            while queue and i < len(values):
                node = queue.popleft()
                
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
        
        # Tuple functions
        @staticmethod
        def read_int_pair() -> Tuple[int, int]:
            first, second = map(int, input().strip().split())
            return (first, second)
        
        @staticmethod
        def read_string_pair() -> Tuple[str, str]:
            first, second = input().strip().split()
            return (first, second)
    
    class Output:
        """Output functions for various data types"""
        
        @staticmethod
        def write_bool(x: bool) -> None:
            print("true" if x else "false", end="")
        
        @staticmethod
        def write_int(x: int) -> None:
            print(x, end="")
        
        @staticmethod
        def write_float(x: float) -> None:
            print(x, end="")
        
        @staticmethod
        def write_string(x: str) -> None:
            print(x, end="")
        
        @staticmethod
        def write_char(x: str) -> None:
            print(x, end="")
        
        # Array functions
        @staticmethod
        def write_int_array(arr: List[int]) -> None:
            print("[", end="")
            for i, val in enumerate(arr):
                print(val, end="")
                if i < len(arr) - 1:
                    print(", ", end="")
            print("]", end="")
        
        @staticmethod
        def write_float_array(arr: List[float]) -> None:
            print("[", end="")
            for i, val in enumerate(arr):
                print(val, end="")
                if i < len(arr) - 1:
                    print(", ", end="")
            print("]", end="")
        
        @staticmethod
        def write_string_array(arr: List[str]) -> None:
            print("[", end="")
            for i, val in enumerate(arr):
                print(f'"{val}"', end="")
                if i < len(arr) - 1:
                    print(", ", end="")
            print("]", end="")
        
        @staticmethod
        def write_char_array(arr: List[str]) -> None:
            print("[", end="")
            for i, val in enumerate(arr):
                print(f"'{val}'", end="")
                if i < len(arr) - 1:
                    print(", ", end="")
            print("]", end="")
        
        # 2D Array functions
        @staticmethod
        def write_int_2d_array(arr: List[List[int]]) -> None:
            print("[", end="")
            for i, row in enumerate(arr):
                IO.Output.write_int_array(row)
                if i < len(arr) - 1:
                    print(", ", end="")
            print("]", end="")
        
        @staticmethod
        def write_char_2d_array(arr: List[List[str]]) -> None:
            print("[", end="")
            for i, row in enumerate(arr):
                IO.Output.write_char_array(row)
                if i < len(arr) - 1:
                    print(", ", end="")
            print("]", end="")
        
        # Set and Dictionary functions
        @staticmethod
        def write_set(s: Set) -> None:
            print("{", end="")
            items = list(s)
            for i, val in enumerate(items):
                print(val, end="")
                if i < len(items) - 1:
                    print(", ", end="")
            print("}", end="")
        
        @staticmethod
        def write_dict(d: Dict) -> None:
            print("{", end="")
            items = list(d.items())
            for i, (key, val) in enumerate(items):
                print(f"{key}: {val}", end="")
                if i < len(items) - 1:
                    print(", ", end="")
            print("}", end="")
        
        # Linked List
        @staticmethod
        def write_list_node(head: Optional[ListNode]) -> None:
            current = head
            while current:
                print(current.val, end="")
                if current.next:
                    print(" -> ", end="")
                current = current.next
        
        # Binary Tree (level-order output)
        @staticmethod
        def write_tree_node(root: Optional[TreeNode]) -> None:
            if not root:
                print("[]", end="")
                return
            
            print("[", end="")
            queue = deque([root])
            first = True
            
            while queue:
                level_size = len(queue)
                has_next_level = False
                
                for _ in range(level_size):
                    node = queue.popleft()
                    
                    if not first:
                        print(", ", end="")
                    first = False
                    
                    if node:
                        print(node.val, end="")
                        queue.append(node.left)
                        queue.append(node.right)
                        if node.left or node.right:
                            has_next_level = True
                    else:
                        print("null", end="")
                
                if not has_next_level:
                    break
            
            print("]", end="")
        
        # Tuple functions
        @staticmethod
        def write_tuple(t: tuple) -> None:
            print("(", end="")
            for i, val in enumerate(t):
                print(val, end="")
                if i < len(t) - 1:
                    print(", ", end="")
            print(")", end="")
    
    # Convenience wrapper functions
    @staticmethod
    def output(x) -> None:
        """
        Generic output function that determines the type and calls appropriate write function
        """
        if isinstance(x, bool):
            IO.Output.write_bool(x)
        elif isinstance(x, int):
            IO.Output.write_int(x)
        elif isinstance(x, float):
            IO.Output.write_float(x)
        elif isinstance(x, str) and len(x) == 1:
            IO.Output.write_char(x)
        elif isinstance(x, str):
            IO.Output.write_string(x)
        elif isinstance(x, list):
            if x and isinstance(x[0], list):
                # 2D array
                if x[0] and isinstance(x[0][0], int):
                    IO.Output.write_int_2d_array(x)
                elif x[0] and isinstance(x[0][0], str):
                    IO.Output.write_char_2d_array(x)
                else:
                    print(x, end="")
            elif x and isinstance(x[0], int):
                IO.Output.write_int_array(x)
            elif x and isinstance(x[0], float):
                IO.Output.write_float_array(x)
            elif x and isinstance(x[0], str):
                if all(len(s) == 1 for s in x):
                    IO.Output.write_char_array(x)
                else:
                    IO.Output.write_string_array(x)
            else:
                print(x, end="")
        elif isinstance(x, set):
            IO.Output.write_set(x)
        elif isinstance(x, dict):
            IO.Output.write_dict(x)
        elif isinstance(x, ListNode):
            IO.Output.write_list_node(x)
        elif isinstance(x, TreeNode):
            IO.Output.write_tree_node(x)
        elif isinstance(x, tuple):
            IO.Output.write_tuple(x)
        else:
            print(x, end="")
        print(" ", end="")

# Convenience functions for backward compatibility
def input_int() -> int:
    return IO.Input.read_int()

def input_string() -> str:
    return IO.Input.read_string()

def input_array() -> List[int]:
    return IO.Input.read_int_array()

def output(x) -> None:
    IO.output(x)

{{user template}}

{{Solution Class}}

def main():
    t = IO.Input.read_int()
    for _ in range(t):
{{Input Statements}}

if __name__ == "__main__":
    main()