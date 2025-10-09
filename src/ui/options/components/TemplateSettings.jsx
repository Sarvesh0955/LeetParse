import React from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Alert
} from '@mui/material';

/**
 * User template settings component
 */
const TemplateSettings = ({ userTemplates, selectedLanguage, onUserTemplateChange }) => {
  const getDefaultTemplate = (language) => {
    const templates = {
      cpp: `// C++ Template - Add your custom code here
#define ll long long
#define vi vector<int>
#define vll vector<ll>
#define pii pair<int, int>
#define pll pair<ll, ll>
#define pb push_back
#define mp make_pair
#define F first
#define S second
#define all(x) x.begin(), x.end()

// Utility functions
int gcd(int a, int b) { return b ? gcd(b, a % b) : a; }
ll power(ll a, ll b) {
    ll res = 1;
    while (b > 0) {
        if (b & 1) res *= a;
        a *= a; b >>= 1;
    }
    return res;
}`,
      java: `// Java Template - Add your custom code here
import java.math.BigInteger;
import java.util.stream.*;

public class Utility {
    public static final int MOD = 1000000007;
    public static final int INF = Integer.MAX_VALUE;
    
    // Utility methods
    public static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
    
    public static long power(long a, long b) {
        long res = 1;
        while (b > 0) {
            if ((b & 1) == 1) res = (res * a) % MOD;
            a = (a * a) % MOD;
            b >>= 1;
        }
        return res;
    }
}`,
      python3: `# Python Template - Add your custom code here
from functools import lru_cache
from collections import defaultdict, deque, Counter
from heapq import heappush, heappop
import bisect
import math

# Utility functions
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def power(a, b, mod=10**9+7):
    res = 1
    while b > 0:
        if b & 1:
            res = (res * a) % mod
        a = (a * a) % mod
        b >>= 1
    return res

# Constants
MOD = 10**9 + 7
INF = float('inf')`,
      javascript: `// JavaScript Template - Add your custom code here
// Utility functions
function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function power(a, b, mod = 1000000007) {
    let res = 1;
    while (b > 0) {
        if (b & 1) res = (res * a) % mod;
        a = (a * a) % mod;
        b >>= 1;
    }
    return res;
}

// Constants
const MOD = 1000000007;
const INF = Number.MAX_SAFE_INTEGER;`
    };
    return templates[language] || templates.cpp;
  };

  const currentTemplate = userTemplates[selectedLanguage] || '';
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="text.primary" fontWeight="600">
        User Template ({selectedLanguage.toUpperCase()})
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add your custom code that will be inserted into the main template for {selectedLanguage}. 
        This can include imports, macros, typedefs, utility functions, etc.
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={15}
        value={currentTemplate}
        onChange={(e) => onUserTemplateChange(selectedLanguage, e.target.value)}
        placeholder={getDefaultTemplate(selectedLanguage)}
        variant="outlined"
        sx={{
          '& .MuiInputBase-input': {
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '0.875rem'
          }
        }}
      />
      
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onUserTemplateChange(selectedLanguage, getDefaultTemplate(selectedLanguage))}
        >
          Load Example Template
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onUserTemplateChange(selectedLanguage, '')}
        >
          Clear Template
        </Button>
      </Stack>
      
      <Alert severity="info" sx={{ mt: 2 }}>
        Your custom template will be inserted into the main code template for {selectedLanguage}. 
        Each language has its own separate template. Leave empty to use no additional template code.
      </Alert>
    </Paper>
  );
};

export default TemplateSettings;
