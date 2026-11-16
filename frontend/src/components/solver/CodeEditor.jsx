import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

export const STARTER_CODE = {
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
`,
};

const CodeEditor = ({ language, setLanguage, code, setCode, problem }) => {
  const editorRef = useRef(null);

  const getTemplate = (lang) => {
    return problem?.starterCode?.[lang] || STARTER_CODE[lang] || '';
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getTemplate(newLang));
  };

  const handleResetCode = () => {
    setCode(getTemplate(language));
  };

  return (
    <div className="code-editor-wrapper">
      <div className="editor-toolbar">
        <div className="editor-toolbar-left">
          <label className="toolbar-label">Language:</label>
          <select
            className="select-language"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="java">Java 21</option>
            <option value="python">Python 3.12</option>
            <option value="cpp">C++ 20 (GCC)</option>
            <option value="javascript">JavaScript (Node.js)</option>
          </select>
        </div>

        <div className="editor-toolbar-right">
          <button
            type="button"
            className="btn-editor-action"
            onClick={handleResetCode}
            title="Reset to starter boilerplate"
          >
            ↺ Reset
          </button>
        </div>
      </div>

      <div className="monaco-container">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={(val) => setCode(val || '')}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            lineNumbers: 'on',
            suggestOnTriggerCharacters: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
