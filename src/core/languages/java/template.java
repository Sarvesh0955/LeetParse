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
    
    /**
     * Input functions for various data types
     */
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
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) {
                arr[i] = readInt();
            }
            return arr;
        }
        
        public static long[] readLongArray() {
            int n = readInt();
            long[] arr = new long[n];
            for (int i = 0; i < n; i++) {
                arr[i] = readLong();
            }
            return arr;
        }
        
        public static double[] readDoubleArray() {
            int n = readInt();
            double[] arr = new double[n];
            for (int i = 0; i < n; i++) {
                arr[i] = readDouble();
            }
            return arr;
        }
        
        public static String[] readStringArray() {
            int n = readInt();
            String[] arr = new String[n];
            for (int i = 0; i < n; i++) {
                arr[i] = scanner.nextLine();
            }
            return arr;
        }
        
        public static char[] readCharArray() {
            return readWord().toCharArray();
        }
        
        // 2D Arrays
        public static int[][] readInt2DArray() {
            int m = readInt();
            int[][] arr = new int[m][];
            for (int i = 0; i < m; i++) {
                int n = readInt();
                arr[i] = new int[n];
                for (int j = 0; j < n; j++) {
                    arr[i][j] = readInt();
                }
            }
            return arr;
        }
        
        public static char[][] readChar2DArray() {
            int m = readInt();
            char[][] arr = new char[m][];
            scanner.nextLine(); 
            for (int i = 0; i < m; i++) {
                String row = scanner.nextLine();
                arr[i] = new char[row.length()];
                for (int j = 0; j < row.length(); j++) {
                    arr[i][j] = row.charAt(j);
                }
            }
            return arr;
        }
        
        // Collections
        public static List<Integer> readIntList() {
            int n = readInt();
            List<Integer> list = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                list.add(readInt());
            }
            return list;
        }
        
        public static List<String> readStringList() {
            int n = readInt();
            List<String> list = new ArrayList<>();
            scanner.nextLine(); // consume newline
            for (int i = 0; i < n; i++) {
                list.add(scanner.nextLine());
            }
            return list;
        }
        
        // 2D Lists (variable-length rows)
        public static List<List<Integer>> readIntListList() {
            int m = readInt(); 
            IO.Input.consumeNewline();
            List<List<Integer>> result = new ArrayList<>();
            for (int i = 0; i < m; i++) {
                int n = readInt(); 
                IO.Input.consumeNewline();
                List<Integer> row = new ArrayList<>();
                for (int j = 0; j < n; j++) {
                    row.add(readInt());
                }
                result.add(row);
            }
            return result;
        }
        
        public static List<List<String>> readStringListList() {
            int m = readInt(); 
            IO.Input.consumeNewline();
            List<List<String>> result = new ArrayList<>();
            for (int i = 0; i < m; i++) {
                int n = readInt();
                IO.Input.consumeNewline();
                List<String> row = new ArrayList<>();
                for (int j = 0; j < n; j++) {
                    row.add(scanner.next());
                }
                result.add(row);
            }
            return result;
        }
        
        public static Set<Integer> readIntSet() {
            int n = readInt();
            Set<Integer> set = new HashSet<>();
            for (int i = 0; i < n; i++) {
                set.add(readInt());
            }
            return set;
        }
        
        public static Map<Integer, Integer> readIntIntMap() {
            int n = readInt();
            Map<Integer, Integer> map = new HashMap<>();
            for (int i = 0; i < n; i++) {
                int key = readInt();
                int value = readInt();
                map.put(key, value);
            }
            return map;
        }
        
        // Linked List
        public static ListNode readListNode() {
            int n = readInt();
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
    
    /**
     * Output functions for various data types
     */
    public static class Output {
        // Basic types
        public static void write(boolean x) { System.out.print(x ? "true" : "false"); }
        public static void write(char x) { System.out.print(x); }
        public static void write(int x) { System.out.print(x); }
        public static void write(long x) { System.out.print(x); }
        public static void write(float x) { System.out.print(x); }
        public static void write(double x) { System.out.print(x); }
        public static void write(String x) { System.out.print("\"" + x + "\""); }
        
        // Arrays
        public static void write(int[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                System.out.print(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(long[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                System.out.print(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(double[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                System.out.print(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(String[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                System.out.print("\"" + arr[i] + "\"");
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(char[] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                System.out.print("'" + arr[i] + "'");
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        // 2D Arrays
        public static void write(int[][] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                write(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(char[][] arr) {
            System.out.print("[");
            for (int i = 0; i < arr.length; i++) {
                write(arr[i]);
                if (i < arr.length - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        // Collections
        public static void write(List<?> list) {
            System.out.print("[");
            for (int i = 0; i < list.size(); i++) {
                System.out.print(list.get(i));
                if (i < list.size() - 1) System.out.print(",");
            }
            System.out.print("]");
        }
        
        public static void write(Set<?> set) {
            System.out.print("{");
            Iterator<?> it = set.iterator();
            while (it.hasNext()) {
                System.out.print(it.next());
                if (it.hasNext()) System.out.print(",");
            }
            System.out.print("}");
        }
        
        public static void write(Map<?, ?> map) {
            System.out.print("{");
            Iterator<?> it = map.entrySet().iterator();
            while (it.hasNext()) {
                Map.Entry<?, ?> entry = (Map.Entry<?, ?>) it.next();
                System.out.print(entry.getKey() + ": " + entry.getValue());
                if (it.hasNext()) System.out.print(",");
            }
            System.out.print("}");
        }
        
        // Linked List
        public static void write(ListNode head) {
            System.out.print("[");
            boolean first = true;
            while (head != null) {
                if (!first) System.out.print(",");
                first = false;
                System.out.print(head.val);
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
                        System.out.print(node.val);
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
        else if (x instanceof Set) Output.write((Set<?>) x);
        else if (x instanceof Map) Output.write((Map<?, ?>) x);
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