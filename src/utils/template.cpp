#include<bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

namespace {
    void input(bool& x) { cin >> x; }
    void input(char& x) { cin >> x; }
    void input(int& x) { cin >> x; }
    void input(unsigned int& x) { cin >> x; }
    void input(long int& x) { cin >> x; }
    void input(unsigned long& x) { cin >> x; }
    void input(long long int& x) { cin >> x; }
    void input(unsigned long long& x) { cin >> x; }
    void input(float& x) { cin >> x; }
    void input(double& x) { cin >> x; }
    void input(long double& x) { cin >> x; }
    void input(string& x) { cin >> ws;getline(cin, x); }
    void input(ListNode*& head) { int n; cin >> n; if (n == 0) { head = nullptr; return; }
        vector<int> values(n);for (int i = 0; i < n; i++) { cin >> values[i]; }
        head = new ListNode(values[0]); ListNode* current = head;
        for (int i = 1; i < n; i++) { current->next = new ListNode(values[i]); current = current->next;}}
    void input(TreeNode*& root) {
        int n; cin >> n; if (n == 0) { root = nullptr; return;}
        vector<string> values(n); for (int i = 0; i < n; i++) { cin >> values[i]; }
        if (values[0] == "null") { root = nullptr; return;}
        root = new TreeNode(stoi(values[0])); queue<TreeNode*> q; q.push(root);
        int i = 1; while (!q.empty() && i < n) { TreeNode* node = q.front(); q.pop();
        if(i < n){if(values[i] != "null") { node->left = new TreeNode(stoi(values[i])); q.push(node->left); } i++;}
        if(i < n){if (values[i] != "null") {node->right = new TreeNode(stoi(values[i]));q.push(node->right);}i++;}}}
    template <typename T>
    void input(vector<T>& x);
    template <typename F, typename S>
    void input(pair<F, S>& x);
    template <typename T>
    void input(vector<T>& x) { int n; cin >> n; x.resize(n); for(int i = 0; i < n; i++){ input(x[i]); }}
    template <typename F, typename S>
    void input(pair<F, S>& x) { input(x.first); input(x.second); }
}

namespace {
    void output(bool x) { cout << (x ? "True" : "False"); }
    void output(char x) { cout << x; }
    void output(int x) { cout << x; }
    void output(unsigned int x) { cout << x; }
    void output(long int x) { cout << x; }
    void output(unsigned long x) { cout << x; }
    void output(long long int x) { cout << x; }
    void output(unsigned long long x) { cout << x; }
    void output(float x) { cout << x; }
    void output(double x) { cout << x; }
    void output(long double x) { cout << x; }
    void output(string x) { cout << x; }
    void output(ListNode* head) { while (head) { cout << head->val; if (head->next) cout << " -> "; head = head->next; }}
    void output(TreeNode* root) {
        if (!root) { cout << "[]"; return; }cout << "["; queue<TreeNode*> q; q.push(root); bool first = true;
        while (!q.empty()) { int levelSize = q.size(); bool hasNextLevel = false;
        for (int i = 0; i < levelSize; i++) { TreeNode* node = q.front(); q.pop(); if (!first) cout << ", "; first = false;
        if (node) { cout << node->val; q.push(node->left); q.push(node->right);if (node->left || node->right) hasNextLevel = true;
        } else { cout << "null";}}if (!hasNextLevel) break;}cout << "]";}
    
    template <typename T>
    void output(vector<T> x);
    template <typename F, typename S>
    void output(pair<F, S> x);
    template <typename T>
    void output(vector<T> x) { int n = x.size(); for(int i = 0; i < n; i++){ output(x[i]); cout<<" "; }}
    template <typename F, typename S>
    void output(pair<F, S> x) { output(x.first); output(x.second); }
}

{{Solution Class}}

int main() {
    int t;
    cin >> t;
    while (t--) {
{{Input Statements}}
    }
    return 0;
}