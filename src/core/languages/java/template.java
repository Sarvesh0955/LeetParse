import java.util.*;
import java.io.*;

// Definition for singly-linked list
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

// Definition for binary tree
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class IO {
    private static Scanner scanner = new Scanner(System.in);

    public static class Input {
        // Basic types
        public static boolean readBoolean() { return scanner.nextBoolean(); }
        public static char readChar() { return scanner.next().charAt(0); }
        public static int readInt() { return scanner.nextInt(); }
        public static long readLong() { return scanner.nextLong(); }
        public static float readFloat() { return scanner.nextFloat(); }
        public static double readDouble() { return scanner.nextDouble(); }
        public static String readString() { return scanner.nextLine(); }
        public static String readWord() { return scanner.next(); }
        
        // Utility method to consume newline after primitive inputs
        public static void consumeNewline() { scanner.nextLine(); }
        
        // Arrays
        public static int[] readIntArray() {
            int n = readInt();
            consumeNewline();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) {
                arr[i] = readInt();
            }
            consumeNewline();
            return arr;
        }
        
        public static long[] readLongArray() {
            int n = readInt();
            consumeNewline();
            long[] arr = new long[n];
            for (int i = 0; i < n; i++) {
                arr[i] = readLong();
            }
            consumeNewline();
            return arr;
        }
        
        public static double[] readDoubleArray() {
            int n = readInt();
            consumeNewline();
            double[] arr = new double[n];
            for (int i = 0; i < n; i++) {
                arr[i] = readDouble();
            }
            consumeNewline();
            return arr;
        }
        
        public static String[] readStringArray() {
            int n = readInt();
            consumeNewline();
            String[] arr = new String[n];
            for (int i = 0; i < n; i++) {
                arr[i] = readString();
            }
            return arr;
        }
        
        public static char[] readCharArray() {
            int n = readInt();
            consumeNewline();
            char[] arr = new char[n];
            for (int i = 0; i < n; i++) {
                arr[i] = readChar();
            }
            consumeNewline();
            return arr;
        }
        
        // 2D Arrays
        public static int[][] readInt2DArray() {
            int m = readInt();
            consumeNewline();
            int[][] arr = new int[m][];
            for (int i = 0; i < m; i++) {
                arr[i] = readIntArray();
            }
            return arr;
        }
        
        public static char[][] readChar2DArray() {
            int m = readInt();
            consumeNewline();
            char[][] arr = new char[m][];
            for (int i = 0; i < m; i++) {
                arr[i] = readCharArray();
            }
            return arr;
        }

        // Collections
        public static List<Integer> readIntList() {
            int n = readInt();
            consumeNewline();
            List<Integer> list = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                list.add(readInt());
            }
            consumeNewline();
            return list;
        }
        
        public static List<String> readStringList() {
            int n = readInt();
            List<String> list = new ArrayList<>();
            consumeNewline();
            for (int i = 0; i < n; i++) {
                list.add(readString());
            }
            return list;
        }
        
        // 2D Lists 
        public static List<List<Integer>> readIntListList() {
            int m = readInt(); 
            IO.Input.consumeNewline();
            List<List<Integer>> result = new ArrayList<>();
            for (int i = 0; i < m; i++) {
                result.add(readIntList());
            }
            return result;
        }
        
        public static List<List<String>> readStringListList() {
            int m = readInt(); 
            IO.Input.consumeNewline();
            List<List<String>> result = new ArrayList<>();
            for (int i = 0; i < m; i++) {
                result.add(readStringList());
            }
            return result;
        }
        
        // Linked List
        public static ListNode readListNode() {
            int n = readInt();
            consumeNewline();
            if (n == 0) return null;
            
            ListNode head = new ListNode(readInt());
            ListNode current = head;
            for (int i = 1; i < n; i++) {
                current.next = new ListNode(readInt());
                current = current.next;
            }
            return head;
        }
        
        // Binary Tree (level-order traversal format)
        public static TreeNode readTreeNode() {
            int n = readInt();
            consumeNewline();
            if (n == 0) return null;
            
            String[] values = new String[n];
            for (int i = 0; i < n; i++) {
                values[i] = readWord();
            }
            
            if (values[0].equals("null")) return null;
            
            TreeNode root = new TreeNode(Integer.parseInt(values[0]));
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);
            
            int i = 1;
            while (!queue.isEmpty() && i < n) {
                TreeNode node = queue.poll();
                if (i < n) {
                    if (!values[i].equals("null")) {
                        node.left = new TreeNode(Integer.parseInt(values[i]));
                        queue.offer(node.left);
                    }
                    i++;
                }
                if (i < n) {
                    if (!values[i].equals("null")) {
                        node.right = new TreeNode(Integer.parseInt(values[i]));
                        queue.offer(node.right);
                    }
                    i++;
                }
            }
            return root;
        }
    }
    
    public static class Output {
        // Basic types
        public static void write(boolean x) { System.out.print(x ? "true" : "false"); }
        public static void write(char x) { System.out.print("\"" + x + "\""); }
        public static void write(int x) { System.out.print(x); }
        public static void write(long x) { System.out.print(x); }
        public static void write(float x) { System.out.print(x); }
        public static void write(double x) { System.out.print(x); }
        public static void write(String x) { System.out.print("\"" + x + "\""); }
        
        // Arrays
        public static void write(int[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                output(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(long[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                output(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(double[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                output(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(String[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                output(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(char[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                output(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        // 2D Arrays
        public static void write(int[][] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                output(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(char[][] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                output(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        // Collections
        public static void write(List<?> list) {
            System.out.print("[");
            for (int i = 0; i < list.size(); i++) {
                output(list.get(i));
                if (i < list.size() - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        // Linked List
        public static void write(ListNode head) {
            System.out.print("[");
            boolean first = true;
            while (head != null) {
                if (!first) System.out.print(",");
                first = false;
                output(head.val);
                head = head.next;
            }
            System.out.print("]");
        }
        
        // Binary Tree (level-order output)
        public static void write(TreeNode root) {
            if (root == null) {
                System.out.print("[]");
                return;
            }
            
            System.out.print("[");
            Queue<TreeNode> queue = new LinkedList<>();
            queue.offer(root);
            boolean first = true;
            
            while (!queue.isEmpty()) {
                int levelSize = queue.size();
                boolean hasNextLevel = false;
                
                for (int i = 0; i < levelSize; i++) {
                    TreeNode node = queue.poll();
                    
                    if (!first) System.out.print(",");
                    first = false;
                    
                    if (node != null) {
                        output(node.val);
                        queue.offer(node.left);
                        queue.offer(node.right);
                        if (node.left != null || node.right != null) {
                            hasNextLevel = true;
                        }
                    } else {
                        System.out.print("null");
                    }
                }
                
                if (!hasNextLevel) break;
            }
            System.out.print("]");
        }
    }
    
    // Convenience wrapper functions
    public static void output(Object x) {
        if (x instanceof Boolean) Output.write((Boolean) x);
        else if (x instanceof Character) Output.write((Character) x);
        else if (x instanceof Integer) Output.write((Integer) x);
        else if (x instanceof Long) Output.write((Long) x);
        else if (x instanceof Float) Output.write((Float) x);
        else if (x instanceof Double) Output.write((Double) x);
        else if (x instanceof String) Output.write((String) x);
        else if (x instanceof int[]) Output.write((int[]) x);
        else if (x instanceof long[]) Output.write((long[]) x);
        else if (x instanceof double[]) Output.write((double[]) x);
        else if (x instanceof String[]) Output.write((String[]) x);
        else if (x instanceof char[]) Output.write((char[]) x);
        else if (x instanceof int[][]) Output.write((int[][]) x);
        else if (x instanceof char[][]) Output.write((char[][]) x);
        else if (x instanceof List) Output.write((List<?>) x);
        else if (x instanceof ListNode) Output.write((ListNode) x);
        else if (x instanceof TreeNode) Output.write((TreeNode) x);
        else System.out.print(x);
    }
}

{{user template}}

{{Solution Class}}

class Main {
    public static void main(String[] args) {
        int t = IO.Input.readInt();
        IO.Input.consumeNewline();
        while (t-- > 0) {
{{Input Statements}}
        }
    }
}