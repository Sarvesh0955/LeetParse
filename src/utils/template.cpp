#include<bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
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
    
    template <typename T>
    void input(vector<T>& x);
    template <typename T>
    void input(vector<vector<T>>& mat);
    template <typename F, typename S>
    void input(pair<F, S>& x);
    template <typename T>
    void input(vector<T>& x) { int n; cin >> n; x.resize(n); for(int i = 0; i < n; i++){ input(x[i]); }}
    template <typename T>
    void input(vector<vector<T>>& mat){ int n, m; cin >> n >> m; mat.resize(n); 
        for(int i = 0; i < n; i++) { mat[i].resize(m); for(int j = 0; j < m; j++){ input(mat[i][j]); }}}
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