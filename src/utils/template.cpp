#include<bits/stdc++.h>
using namespace std;

// Definition for singly-linked list
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

// Definition for binary tree
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

namespace IO {
    /**
     * Input functions for various data types
     * Each function handles reading from stdin for a specific type
     */
    namespace Input {
        // Basic types
        void read(bool& x) { cin >> x; }
        void read(char& x) { cin >> x; }
        void read(int& x) { cin >> x; }
        void read(unsigned int& x) { cin >> x; }
        void read(long int& x) { cin >> x; }
        void read(unsigned long& x) { cin >> x; }
        void read(long long int& x) { cin >> x; }
        void read(unsigned long long& x) { cin >> x; }
        void read(float& x) { cin >> x; }
        void read(double& x) { cin >> x; }
        void read(long double& x) { cin >> x; }
        
        // String with whitespace handling
        void read(string& x) { 
            cin >> ws; // Consume leading whitespace
            getline(cin, x); 
        }
        
        // Linked list
        void read(ListNode*& head) {
            int n; 
            cin >> n;
            if (n == 0) { 
                head = nullptr; 
                return; 
            }
            vector<int> values(n);
            for (int i = 0; i < n; i++) { 
                cin >> values[i]; 
            }
            head = new ListNode(values[0]);
            ListNode* current = head;
            for (int i = 1; i < n; i++) {
                current->next = new ListNode(values[i]);
                current = current->next;
            }
        }
        
        // Binary tree (level-order traversal format)
        void read(TreeNode*& root) {
            int n; 
            cin >> n;
            if (n == 0) { 
                root = nullptr; 
                return;
            }
            vector<string> values(n);
            for (int i = 0; i < n; i++) {
                cin >> values[i]; 
            }
            if (values[0] == "null") {
                root = nullptr; 
                return;
            }
            root = new TreeNode(stoi(values[0]));
            queue<TreeNode*> q;
            q.push(root);
            int i = 1;
            while (!q.empty() && i < n) {
                TreeNode* node = q.front();
                q.pop();
                if (i < n) {
                    if (values[i] != "null") {
                        node->left = new TreeNode(stoi(values[i]));
                        q.push(node->left);
                    }
                    i++;
                }
                if (i < n) {
                    if (values[i] != "null") {
                        node->right = new TreeNode(stoi(values[i]));
                        q.push(node->right);
                    }
                    i++;
                }
            }
        }
        // Forward declarations for template specializations
        template <typename T> void read(vector<T>& x);
        template <typename F, typename S> void read(pair<F, S>& x);
        template <typename K, typename V> void read(map<K, V>& x);
        template <typename K, typename V> void read(unordered_map<K, V>& x);
        template <typename T> void read(set<T>& x);
        template <typename T> void read(unordered_set<T>& x);
        
        // Vector
        template <typename T>
        void read(vector<T>& x) {
            int n;
            cin >> n;
            x.resize(n);
            for (int i = 0; i < n; i++) {
                read(x[i]);
            }
        }
        
        // Pair
        template <typename F, typename S>
        void read(pair<F, S>& x) {
            read(x.first);
            read(x.second);
        }
        
        // Map
        template <typename K, typename V>
        void read(map<K, V>& x) {
            int n;
            cin >> n;
            for (int i = 0; i < n; i++) {
                K key;
                V value;
                read(key);
                read(value);
                x[key] = value;
            }
        }
        
        // Unordered Map
        template <typename K, typename V>
        void read(unordered_map<K, V>& x) {
            int n;
            cin >> n;
            for (int i = 0; i < n; i++) {
                K key;
                V value;
                read(key);
                read(value);
                x[key] = value;
            }
        }
        
        // Set
        template <typename T>
        void read(set<T>& x) {
            int n;
            cin >> n;
            for (int i = 0; i < n; i++) {
                T value;
                read(value);
                x.insert(value);
            }
        }
        
        // Unordered Set
        template <typename T>
        void read(unordered_set<T>& x) {
            int n;
            cin >> n;
            for (int i = 0; i < n; i++) {
                T value;
                read(value);
                x.insert(value);
            }
        }
    } // namespace Input
    
    /**
     * Output functions for various data types
     * Each function handles printing to stdout for a specific type
     */
    namespace Output {
        // Basic types
        void write(bool x) { cout << (x ? "True" : "False"); }
        void write(char x) { cout << x; }
        void write(int x) { cout << x; }
        void write(unsigned int x) { cout << x; }
        void write(long int x) { cout << x; }
        void write(unsigned long x) { cout << x; }
        void write(long long int x) { cout << x; }
        void write(unsigned long long x) { cout << x; }
        void write(float x) { cout << x; }
        void write(double x) { cout << x; }
        void write(long double x) { cout << x; }
        void write(string x) { cout << x; }
        void write(const char* x) { cout << x; }
        
        // Linked list
        void write(ListNode* head) {
            while (head) {
                cout << head->val;
                if (head->next) cout << " -> ";
                head = head->next;
            }
        }
        
        // Binary tree (level-order output)
        void write(TreeNode* root) {
            if (!root) {
                cout << "[]";
                return;
            }
            cout << "[";
            queue<TreeNode*> q;
            q.push(root);
            bool first = true;
            while (!q.empty()) {
                int levelSize = q.size();
                bool hasNextLevel = false;
                for (int i = 0; i < levelSize; i++) {
                    TreeNode* node = q.front();
                    q.pop();
                    if (!first) cout << ", ";
                    first = false;
                    if (node) {
                        cout << node->val;
                        q.push(node->left);
                        q.push(node->right);
                        if (node->left || node->right) hasNextLevel = true;
                    } else {
                        cout << "null";
                    }
                }
                if (!hasNextLevel) break;
            }
            cout << "]";
        }
        
        // Forward declarations for template specializations
        template <typename T> void write(const vector<T>& x);
        template <typename F, typename S> void write(const pair<F, S>& x);
        template <typename K, typename V> void write(const map<K, V>& x);
        template <typename K, typename V> void write(const unordered_map<K, V>& x);
        template <typename T> void write(const set<T>& x);
        template <typename T> void write(const unordered_set<T>& x);
        
        // Vector
        template <typename T>
        void write(const vector<T>& x) {
            cout << "[";
            int n = x.size();
            for (int i = 0; i < n; i++) {
                write(x[i]);
                if (i < n - 1) cout << ", ";
            }
            cout << "]";
        }
        
        // Pair
        template <typename F, typename S>
        void write(const pair<F, S>& x) {
            cout << "(";
            write(x.first);
            cout << ", ";
            write(x.second);
            cout << ")";
        }
        
        // Map
        template <typename K, typename V>
        void write(const map<K, V>& x) {
            cout << "{";
            bool first = true;
            for (const auto& [k, v] : x) {
                if (!first) cout << ", ";
                first = false;
                write(k);
                cout << ": ";
                write(v);
            }
            cout << "}";
        }
        
        // Unordered map
        template <typename K, typename V>
        void write(const unordered_map<K, V>& x) {
            cout << "{";
            bool first = true;
            for (const auto& [k, v] : x) {
                if (!first) cout << ", ";
                first = false;
                write(k);
                cout << ": ";
                write(v);
            }
            cout << "}";
        }
        
        // Set
        template <typename T>
        void write(const set<T>& x) {
            cout << "{";
            bool first = true;
            for (const auto& elem : x) {
                if (!first) cout << ", ";
                first = false;
                write(elem);
            }
            cout << "}";
        }
        
        // Unordered set
        template <typename T>
        void write(const unordered_set<T>& x) {
            cout << "{";
            bool first = true;
            for (const auto& elem : x) {
                if (!first) cout << ", ";
                first = false;
                write(elem);
            }
            cout << "}";
        }
    } // namespace Output
    
    // Convenience wrapper functions to match the original interface
    template <typename T>
    void input(T& x) {
        Input::read(x);
    }
    
    template <typename T>
    void output(T x) {
        Output::write(x);
        cout << " ";
    }
} 

using namespace IO;

{{Solution Class}}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int t;
    input(t);
    while (t--) {
{{Input Statements}}
    }
    
    return 0;
}