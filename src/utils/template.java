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
    public static boolean readBoolean() {
        String input = scanner.next().toLowerCase();
        return input.equals("true") || input.equals("1");
    }
    
    public static int readInt() {
        return scanner.nextInt();
    }
    
    public static long readLong() {
        return scanner.nextLong();
    }
    
    public static float readFloat() {
        return scanner.nextFloat();
    }
    
    public static double readDouble() {
        return scanner.nextDouble();
    }
    
    public static String readString() {
        return scanner.next();
    }
    
    public static String readLine() {
        scanner.nextLine(); // consume newline
        return scanner.nextLine();
    }
    
    public static int[] readIntArray() {
        String line = scanner.nextLine().trim();
        if (line.equals("[]") || line.isEmpty()) {
            return new int[0];
        }
        
        line = line.substring(1, line.length() - 1); // remove brackets
        if (line.isEmpty()) {
            return new int[0];
        }
        
        String[] parts = line.split(",");
        int[] result = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            result[i] = Integer.parseInt(parts[i].trim());
        }
        return result;
    }
    
    public static String[] readStringArray() {
        String line = scanner.nextLine().trim();
        if (line.equals("[]") || line.isEmpty()) {
            return new String[0];
        }
        
        line = line.substring(1, line.length() - 1); // remove brackets
        if (line.isEmpty()) {
            return new String[0];
        }
        
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        
        for (char c : line.toCharArray()) {
            if (c == '"' && !inQuotes) {
                inQuotes = true;
            } else if (c == '"' && inQuotes) {
                inQuotes = false;
                result.add(current.toString());
                current = new StringBuilder();
            } else if (c == ',' && !inQuotes) {
                if (current.length() > 0) {
                    result.add(current.toString().trim());
                    current = new StringBuilder();
                }
            } else if (!(c == ' ' && !inQuotes && current.length() == 0)) {
                current.append(c);
            }
        }
        
        if (current.length() > 0) {
            result.add(current.toString().trim());
        }
        
        return result.toArray(new String[0]);
    }
    
    public static int[][] readInt2DArray() {
        String line = scanner.nextLine().trim();
        if (line.equals("[]") || line.isEmpty()) {
            return new int[0][0];
        }
        
        List<int[]> result = new ArrayList<>();
        line = line.substring(1, line.length() - 1); // remove outer brackets
        
        int i = 0;
        while (i < line.length()) {
            if (line.charAt(i) == '[') {
                int j = i + 1;
                int bracketCount = 1;
                while (j < line.length() && bracketCount > 0) {
                    if (line.charAt(j) == '[') {
                        bracketCount++;
                    } else if (line.charAt(j) == ']') {
                        bracketCount--;
                    }
                    j++;
                }
                
                String subArrayStr = line.substring(i + 1, j - 1);
                if (!subArrayStr.isEmpty()) {
                    String[] parts = subArrayStr.split(",");
                    int[] subArray = new int[parts.length];
                    for (int k = 0; k < parts.length; k++) {
                        subArray[k] = Integer.parseInt(parts[k].trim());
                    }
                    result.add(subArray);
                } else {
                    result.add(new int[0]);
                }
                
                i = j;
                while (i < line.length() && (line.charAt(i) == ',' || line.charAt(i) == ' ')) {
                    i++;
                }
            } else {
                i++;
            }
        }
        
        return result.toArray(new int[0][]);
    }
    
    public static ListNode readLinkedList() {
        int[] values = readIntArray();
        if (values.length == 0) {
            return null;
        }
        
        ListNode head = new ListNode(values[0]);
        ListNode current = head;
        for (int i = 1; i < values.length; i++) {
            current.next = new ListNode(values[i]);
            current = current.next;
        }
        return head;
    }
    
    public static TreeNode readBinaryTree() {
        String line = scanner.nextLine().trim();
        if (line.equals("[]") || line.equals("null") || line.isEmpty()) {
            return null;
        }
        
        line = line.substring(1, line.length() - 1); // remove brackets
        if (line.isEmpty()) {
            return null;
        }
        
        String[] values = line.split(",");
        List<Integer> nodeValues = new ArrayList<>();
        
        for (String value : values) {
            String trimmed = value.trim();
            if (trimmed.equals("null")) {
                nodeValues.add(null);
            } else {
                nodeValues.add(Integer.parseInt(trimmed));
            }
        }
        
        if (nodeValues.isEmpty() || nodeValues.get(0) == null) {
            return null;
        }
        
        TreeNode root = new TreeNode(nodeValues.get(0));
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        int i = 1;
        while (!queue.isEmpty() && i < nodeValues.size()) {
            TreeNode node = queue.poll();
            
            // Left child
            if (i < nodeValues.size()) {
                if (nodeValues.get(i) != null) {
                    node.left = new TreeNode(nodeValues.get(i));
                    queue.offer(node.left);
                }
                i++;
            }
            
            // Right child
            if (i < nodeValues.size()) {
                if (nodeValues.get(i) != null) {
                    node.right = new TreeNode(nodeValues.get(i));
                    queue.offer(node.right);
                }
                i++;
            }
        }
        
        return root;
    }
    
    /**
     * Output functions for various data types
     */
    public static void writeBoolean(boolean x) {
        System.out.print(x ? "True" : "False");
    }
    
    public static void writeInt(int x) {
        System.out.print(x);
    }
    
    public static void writeLong(long x) {
        System.out.print(x);
    }
    
    public static void writeFloat(float x) {
        System.out.print(x);
    }
    
    public static void writeDouble(double x) {
        System.out.print(x);
    }
    
    public static void writeString(String x) {
        System.out.print(x);
    }
    
    public static void writeIntArray(int[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) System.out.print(",");
            System.out.print(arr[i]);
        }
        System.out.print("]");
    }
    
    public static void writeStringArray(String[] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) System.out.print(",");
            System.out.print("\"" + arr[i] + "\"");
        }
        System.out.print("]");
    }
    
    public static void writeInt2DArray(int[][] arr) {
        System.out.print("[");
        for (int i = 0; i < arr.length; i++) {
            if (i > 0) System.out.print(",");
            writeIntArray(arr[i]);
        }
        System.out.print("]");
    }
    
    public static void writeLinkedList(ListNode head) {
        List<Integer> values = new ArrayList<>();
        ListNode current = head;
        while (current != null) {
            values.add(current.val);
            current = current.next;
        }
        
        System.out.print("[");
        for (int i = 0; i < values.size(); i++) {
            if (i > 0) System.out.print(",");
            System.out.print(values.get(i));
        }
        System.out.print("]");
    }
    
    public static void writeBinaryTree(TreeNode root) {
        if (root == null) {
            System.out.print("[]");
            return;
        }
        
        List<Integer> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node != null) {
                result.add(node.val);
                queue.offer(node.left);
                queue.offer(node.right);
            } else {
                result.add(null);
            }
        }
        
        // Remove trailing nulls
        while (!result.isEmpty() && result.get(result.size() - 1) == null) {
            result.remove(result.size() - 1);
        }
        
        System.out.print("[");
        for (int i = 0; i < result.size(); i++) {
            if (i > 0) System.out.print(",");
            if (result.get(i) == null) {
                System.out.print("null");
            } else {
                System.out.print(result.get(i));
            }
        }
        System.out.print("]");
    }
    
    // Generic output method
    public static void output(Object obj) {
        if (obj instanceof Boolean) {
            writeBoolean((Boolean) obj);
        } else if (obj instanceof Integer) {
            writeInt((Integer) obj);
        } else if (obj instanceof Long) {
            writeLong((Long) obj);
        } else if (obj instanceof Float) {
            writeFloat((Float) obj);
        } else if (obj instanceof Double) {
            writeDouble((Double) obj);
        } else if (obj instanceof String) {
            writeString((String) obj);
        } else if (obj instanceof int[]) {
            writeIntArray((int[]) obj);
        } else if (obj instanceof String[]) {
            writeStringArray((String[]) obj);
        } else if (obj instanceof int[][]) {
            writeInt2DArray((int[][]) obj);
        } else if (obj instanceof ListNode) {
            writeLinkedList((ListNode) obj);
        } else if (obj instanceof TreeNode) {
            writeBinaryTree((TreeNode) obj);
        } else {
            System.out.print(obj);
        }
        System.out.print(" ");
    }
}

{{user template}}

{{Solution Class}}

public class Main {
    public static void main(String[] args) {
        int t = IO.readInt();
        for (int i = 0; i < t; i++) {
{{Input Statements}}
        }
    }
}