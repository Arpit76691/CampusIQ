// Problem Bank Definition with real problem statements, examples, constraints & multi-language starter templates

export const PROBLEM_BANK = [
  {
    id: 1,
    title: 'Two Sum Problem',
    category: 'DSA',
    difficulty: 'Easy',
    points: 100,
    solvedCount: 1420,
    acceptance: '84.2%',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    examples: [
      {
        id: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        id: 2,
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[] {};
    }
}
`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
        return {};
    }
};
`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
    
    return [];
}
`
    }
  },
  {
    id: 2,
    title: 'Binary Tree Zigzag Level Order Traversal',
    category: 'DSA',
    difficulty: 'Medium',
    points: 150,
    solvedCount: 890,
    acceptance: '62.5%',
    description: 'Given the root of a binary tree, return the zigzag level order traversal of its nodes\' values. (i.e., from left to right, then right to left for the next level and alternate between).',
    examples: [
      {
        id: 1,
        input: 'root = [3, 9, 20, null, null, 15, 7]',
        output: '[[3], [20, 9], [15, 7]]',
        explanation: 'Level 1: [3], Level 2 (reversed): [20, 9], Level 3: [15, 7].'
      },
      {
        id: 2,
        input: 'root = [1]',
        output: '[[1]]',
        explanation: 'Single root node.'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-100 <= Node.val <= 100'
    ],
    starterCode: {
      java: `import java.util.*;

// Definition for a binary tree node:
// class TreeNode { int val; TreeNode left; TreeNode right; }

public class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        // Write your zigzag BFS / DFS solution here
        
        return new ArrayList<>();
    }
}
`,
      python: `class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        # Write your zigzag traversal here
        pass
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        // Write your solution here
        
        return {};
    }
};
`,
      javascript: `/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
function zigzagLevelOrder(root) {
    // Write your solution here
    
    return [];
}
`
    }
  },
  {
    id: 3,
    title: 'LRU Cache Design',
    category: 'DSA',
    difficulty: 'Hard',
    points: 250,
    solvedCount: 430,
    acceptance: '41.1%',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class with get(key) and put(key, value) operations, both running in O(1) average time complexity.',
    examples: [
      {
        id: 1,
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation: 'Key 2 is evicted when key 3 is added. Key 1 is evicted when key 4 is added.'
      }
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    starterCode: {
      java: `import java.util.*;

public class LRUCache {
    public LRUCache(int capacity) {
        // Initialize cache with capacity
    }
    
    public int get(int key) {
        // Return value if exists, else -1
        return -1;
    }
    
    public void put(int key, int value) {
        // Insert or update key-value pair, evict LRU item if capacity exceeded
    }
}
`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity

    def get(self, key: int) -> int:
        return -1

    def put(self, key: int, value: int) -> None:
        pass
`,
      cpp: `class LRUCache {
public:
    LRUCache(int capacity) {
        
    }
    
    int get(int key) {
        return -1;
    }
    
    void put(int key, int value) {
        
    }
};
`,
      javascript: `class LRUCache {
    /**
     * @param {number} capacity
     */
    constructor(capacity) {
        this.capacity = capacity;
    }

    /** 
     * @param {number} key
     * @return {number}
     */
    get(key) {
        return -1;
    }

    /** 
     * @param {number} key 
     * @param {number} value
     * @return {void}
     */
    put(key, value) {
        
    }
}
`
    }
  },
  {
    id: 4,
    title: 'BCNF & 3NF Normalization Checker',
    category: 'DBMS',
    difficulty: 'Medium',
    points: 120,
    solvedCount: 650,
    acceptance: '71.8%',
    description: 'Given a relational schema R, a set of Functional Dependencies (FDs) F, and Candidate Keys K, determine whether R is in Boyce-Codd Normal Form (BCNF) or Third Normal Form (3NF).\n\nReturn "BCNF", "3NF", or "VIOLATION" along with the violating functional dependency.',
    examples: [
      {
        id: 1,
        input: 'R = [A, B, C], FDs = ["A -> B", "B -> C"], CandidateKeys = ["A"]',
        output: '"VIOLATION"',
        explanation: 'FD "B -> C" violates 3NF because B is not a superkey and C is not a prime attribute.'
      },
      {
        id: 2,
        input: 'R = [StudentID, CourseID, Grade], FDs = ["StudentID, CourseID -> Grade"], CandidateKeys = ["StudentID, CourseID"]',
        output: '"BCNF"',
        explanation: 'Every determinant is a superkey.'
      }
    ],
    constraints: [
      'Attributes in R consist of uppercase letters.',
      '1 <= FDs.length <= 50',
      'Candidate keys are non-empty sets of attributes.'
    ],
    starterCode: {
      java: `import java.util.*;

public class Solution {
    public String checkNormalization(List<String> attributes, List<String> fds, List<String> candidateKeys) {
        // Return "BCNF", "3NF", or "VIOLATION"
        
        return "BCNF";
    }
}
`,
      python: `class Solution:
    def checkNormalization(self, attributes: list[str], fds: list[str], candidate_keys: list[str]) -> str:
        # Return "BCNF", "3NF", or "VIOLATION"
        return "BCNF"
`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    string checkNormalization(vector<string>& attributes, vector<string>& fds, vector<string>& candidateKeys) {
        return "BCNF";
    }
};
`,
      javascript: `/**
 * @param {string[]} attributes
 * @param {string[]} fds
 * @param {string[]} candidateKeys
 * @return {string}
 */
function checkNormalization(attributes, fds, candidateKeys) {
    return "BCNF";
}
`
    }
  },
  {
    id: 5,
    title: 'Subnet Mask & IP Routing Calculator',
    category: 'CN',
    difficulty: 'Medium',
    points: 130,
    solvedCount: 520,
    acceptance: '68.0%',
    description: 'Implement an IP longest-prefix matching algorithm for a CIDR routing table.\n\nGiven a destination IP address in dot-decimal notation and an array of CIDR routing rules (e.g., "192.168.1.0/24 -> Gateway A"), return the matching next-hop gateway address.',
    examples: [
      {
        id: 1,
        input: 'destIp = "192.168.1.45", routes = ["192.168.0.0/16 -> Gateway1", "192.168.1.0/24 -> Gateway2"]',
        output: '"Gateway2"',
        explanation: '/24 has longer prefix match than /16.'
      }
    ],
    constraints: [
      'Valid IPv4 addresses only.',
      '1 <= routes.length <= 1000'
    ],
    starterCode: {
      java: `import java.util.*;

public class Solution {
    public String findNextHop(String destIp, List<String> routingTable) {
        // Implement CIDR longest prefix match
        
        return "";
    }
}
`,
      python: `class Solution:
    def findNextHop(self, dest_ip: str, routing_table: list[str]) -> str:
        # Longest prefix matching
        return ""
`,
      cpp: `#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    string findNextHop(string destIp, vector<string>& routingTable) {
        return "";
    }
};
`,
      javascript: `/**
 * @param {string} destIp
 * @param {string[]} routingTable
 * @return {string}
 */
function findNextHop(destIp, routingTable) {
    return "";
}
`
    }
  },
  {
    id: 6,
    title: 'Virtual Memory Page Replacement (FIFO vs LRU)',
    category: 'OS',
    difficulty: 'Hard',
    points: 200,
    solvedCount: 380,
    acceptance: '48.9%',
    description: 'Simulate virtual memory page frame allocation and count page faults under either "FIFO" or "LRU" page replacement algorithms.\n\nGiven a reference string of page requests and physical frame capacity, return the total count of page faults occurred.',
    examples: [
      {
        id: 1,
        input: 'pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], frames = 3, algorithm = "LRU"',
        output: '12',
        explanation: 'LRU incurs 12 page faults on this reference string with 3 memory frames.'
      }
    ],
    constraints: [
      '1 <= pages.length <= 10^4',
      '1 <= frames <= 100',
      'algorithm in ["FIFO", "LRU"]'
    ],
    starterCode: {
      java: `import java.util.*;

public class Solution {
    public int countPageFaults(int[] pages, int frames, String algorithm) {
        // Simulate page replacement and count faults
        
        return 0;
    }
}
`,
      python: `class Solution:
    def countPageFaults(self, pages: list[int], frames: int, algorithm: str) -> int:
        return 0
`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    int countPageFaults(vector<int>& pages, int frames, string algorithm) {
        return 0;
    }
};
`,
      javascript: `/**
 * @param {number[]} pages
 * @param {number} frames
 * @param {string} algorithm
 * @return {number}
 */
function countPageFaults(pages, frames, algorithm) {
    return 0;
}
`
    }
  },
  {
    id: 7,
    title: 'Debounce & Throttle Implementation',
    category: 'FSD',
    difficulty: 'Medium',
    points: 110,
    solvedCount: 980,
    acceptance: '79.4%',
    description: 'Implement higher-order utility functions for debounce and throttle in JavaScript/TypeScript.\n\n`debounce(fn, delay)` delays invoking fn until after `delay` ms have elapsed since the last time it was invoked.\n`throttle(fn, interval)` ensures fn is invoked at most once per `interval` ms.',
    examples: [
      {
        id: 1,
        input: 'calls at t = [0, 50, 150] ms with debounce delay = 100 ms',
        output: 'invoked once at t = 250 ms',
        explanation: 'The call at 50ms resets the timer; timer finishes at 50 + 100 = 150? No, call at 150 resets to 250ms.'
      }
    ],
    constraints: [
      'delay >= 0',
      'Functions must preserve `this` context and pass all arguments.'
    ],
    starterCode: {
      javascript: `/**
 * @param {Function} fn
 * @param {number} delay
 * @return {Function}
 */
function debounce(fn, delay) {
    let timerId;
    return function(...args) {
        // Implement debounce
    };
}

/**
 * @param {Function} fn
 * @param {number} interval
 * @return {Function}
 */
function throttle(fn, interval) {
    let lastTime = 0;
    return function(...args) {
        // Implement throttle
    };
}
`,
      python: `import time

def debounce(fn, delay):
    # Implement debounce in Python
    pass

def throttle(fn, interval):
    # Implement throttle in Python
    pass
`,
      java: `// Concurrency / Throttling RateLimiter utility
public class Solution {
    // Implement token bucket or debounce utility
}
`,
      cpp: `// Event loop rate limiter
class Solution {
    
};
`
    }
  }
];

export const getProblemById = (id) => {
  const numericId = parseInt(id, 10);
  return PROBLEM_BANK.find(p => p.id === numericId) || PROBLEM_BANK[0];
};
