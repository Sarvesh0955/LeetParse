from typing import *
from collections import deque, defaultdict
import random

# Global input buffer for single word reading
class InputBuffer:
    def __init__(self):
        self.buffer = []
        self.index = 0
    
    def next_word(self):
        while self.index >= len(self.buffer):
            try:
                line = input().strip()
                if line:
                    self.buffer = line.split()
                    self.index = 0
                else:
                    continue
            except EOFError:
                return None
        
        word = self.buffer[self.index]
        self.index += 1
        return word
    
    def next_line(self):
        self.buffer = []
        self.index = 0
        try:
            return input().strip()
        except EOFError:
            return None

_input_buffer = InputBuffer()

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
            word = _input_buffer.next_word()
            return word.lower() in ['true', '1', 'yes'] if word else False
        
        @staticmethod
        def read_int() -> int:
            word = _input_buffer.next_word()
            return int(word) if word else 0
        
        @staticmethod
        def read_float() -> float:
            word = _input_buffer.next_word()
            return float(word) if word else 0.0
        
        @staticmethod
        def read_string() -> str:
            return _input_buffer.next_line()
        
        @staticmethod
        def read_char() -> str:
            word = _input_buffer.next_word()
            return word[0] if word else ''
        
        @staticmethod
        def consume_newline() -> None:
            _input_buffer.next_line()
        
        # Array functions
        @staticmethod
        def read_int_array() -> List[int]:
            n = IO.Input.read_int()  
            return [IO.Input.read_int() for _ in range(n)] 
        
        @staticmethod
        def read_float_array() -> List[float]:
            n = IO.Input.read_int()  
            return [IO.Input.read_float() for _ in range(n)]  
        
        @staticmethod
        def read_string_array() -> List[str]:
            n = IO.Input.read_int() 
            return [IO.Input.read_string() for _ in range(n)]  
        
        @staticmethod
        def read_char_array() -> List[str]:
            return list(IO.Input.read_string())
        
        # 2D Array functions
        @staticmethod
        def read_int_2d_array() -> List[List[int]]:
            m = IO.Input.read_int()  
            result = []
            for _ in range(m):
                n = IO.Input.read_int()  
                row = [IO.Input.read_int() for _ in range(n)] 
                result.append(row)
            return result
        
        @staticmethod
        def read_char_2d_array() -> List[List[str]]:
            m = IO.Input.read_int() 
            result = []
            for _ in range(m):
                row_str = IO.Input.read_string()  
                result.append(list(row_str))
            return result
        
        # Set and Dictionary functions
        @staticmethod
        def read_int_set() -> Set[int]:
            n = IO.Input.read_int()
            return {IO.Input.read_int() for _ in range(n)}
        
        @staticmethod
        def read_string_set() -> Set[str]:
            n = IO.Input.read_int()
            return {_input_buffer.next_word() for _ in range(n)}
        
        @staticmethod
        def read_int_int_dict() -> Dict[int, int]:
            n = IO.Input.read_int()
            result = {}
            for _ in range(n):
                key = IO.Input.read_int()
                value = IO.Input.read_int()
                result[key] = value
            return result
        
        @staticmethod
        def read_string_int_dict() -> Dict[str, int]:
            n = IO.Input.read_int()
            result = {}
            for _ in range(n):
                key = _input_buffer.next_word()
                value = IO.Input.read_int()
                result[key] = value
            return result
        
        # Linked List
        @staticmethod
        def read_list_node() -> Optional[ListNode]:
            n = IO.Input.read_int()
            if n == 0:
                return None
            
            values = [IO.Input.read_int() for _ in range(n)]
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
            n = IO.Input.read_int()
            if n == 0:
                return None
                
            values = []
            for _ in range(n):
                word = _input_buffer.next_word()
                if word and word.lower() == 'null':
                    values.append(None)
                else:
                    values.append(int(word) if word else 0)
            
            if not values or values[0] is None:
                return None
            
            root = TreeNode(values[0])
            queue = deque([root])
            i = 1
            
            while queue and i < len(values):
                node = queue.popleft()
                
                if i < len(values):
                    if values[i] is not None:
                        node.left = TreeNode(values[i])
                        queue.append(node.left)
                    i += 1
                
                if i < len(values):
                    if values[i] is not None:
                        node.right = TreeNode(values[i])
                        queue.append(node.right)
                    i += 1
            
            return root
        
        # Tuple functions
        @staticmethod
        def read_int_pair() -> Tuple[int, int]:
            first = IO.Input.read_int()
            second = IO.Input.read_int()
            return (first, second)
        
        @staticmethod
        def read_string_pair() -> Tuple[str, str]:
            first = _input_buffer.next_word()
            second = _input_buffer.next_word()
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
            print(f'"{x}"', end="")
        
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
                    print(",", end="")
            print("]", end="")
        
        @staticmethod
        def write_float_array(arr: List[float]) -> None:
            print("[", end="")
            for i, val in enumerate(arr):
                print(val, end="")
                if i < len(arr) - 1:
                    print(",", end="")
            print("]", end="")
        
        @staticmethod
        def write_string_array(arr: List[str]) -> None:
            print("[", end="")
            for i, val in enumerate(arr):
                print(f'"{val}"', end="")
                if i < len(arr) - 1:
                    print(",", end="")
            print("]", end="")
        
        @staticmethod
        def write_char_array(arr: List[str]) -> None:
            print("[", end="")
            for i, val in enumerate(arr):
                print(f"'{val}'", end="")
                if i < len(arr) - 1:
                    print(",", end="")
            print("]", end="")
        
        # 2D Array functions
        @staticmethod
        def write_int_2d_array(arr: List[List[int]]) -> None:
            print("[", end="")
            for i, row in enumerate(arr):
                IO.Output.write_int_array(row)
                if i < len(arr) - 1:
                    print(",", end="")
            print("]", end="")
        
        @staticmethod
        def write_char_2d_array(arr: List[List[str]]) -> None:
            print("[", end="")
            for i, row in enumerate(arr):
                IO.Output.write_char_array(row)
                if i < len(arr) - 1:
                    print(",", end="")
            print("]", end="")
        
        # Set and Dictionary functions
        @staticmethod
        def write_set(s: Set) -> None:
            print("{", end="")
            items = list(s)
            for i, val in enumerate(items):
                print(val, end="")
                if i < len(items) - 1:
                    print(",", end="")
            print("}", end="")
        
        @staticmethod
        def write_dict(d: Dict) -> None:
            print("{", end="")
            items = list(d.items())
            for i, (key, val) in enumerate(items):
                print(f"{key}: {val}", end="")
                if i < len(items) - 1:
                    print(",", end="")
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
        if x is None:
            print("null", end="")
        elif isinstance(x, bool):
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

# Convenience functions for backward compatibility
def input_int() -> int:
    return IO.Input.read_int()

def input_string() -> str:
    return IO.Input.read_string()

def input_array() -> List[int]:
    return IO.Input.read_int_array()

def output(x) -> None:
    IO.output(x)

# Additional convenience functions for single word reading
def input_word() -> str:
    return _input_buffer.next_word()

def input_line() -> str:
    return _input_buffer.next_line()

def consume_newline() -> None:
    return IO.Input.consume_newline()

{{user template}}

{{Solution Class}}

def main():
    t = IO.Input.read_int()
    for _ in range(t):
{{Input Statements}}

if __name__ == "__main__":
    main()