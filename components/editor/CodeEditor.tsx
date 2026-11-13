'use client'

import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Language, SubmissionStatus, TestResult } from '@/types'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/problems/StatusBadge'
import { Play, Send, RotateCcw, AlertTriangle, CheckCircle2, XCircle, Clock, Cpu, Info } from 'lucide-react'
import toast from 'react-hot-toast'

interface TestCaseItem {
  id: string
  input: string
  expected: string
  isSample: boolean
}

interface CodeEditorProps {
  problemId: string
  slug: string
  testCases: TestCaseItem[]
  contestId?: string
  initialCodeTemplates?: Partial<Record<Language, string>>
}

const DEFAULT_TEMPLATES: Record<Language, string> = {
  python: `def solve():
    # Read input from standard input
    import sys
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    # Write your solution here
    print("result")

if __name__ == '__main__':
    solve()
`,
  javascript: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');
    if (!input || input.length === 0 || input[0] === '') return;
    // Write your solution here
    console.log("result");
}

solve();
`,
  cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Write your solution here
    
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
        sc.close();
    }
}
`,
}

export function CodeEditor({ problemId, slug, testCases, contestId, initialCodeTemplates }: CodeEditorProps) {
  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState<string>(initialCodeTemplates?.python || DEFAULT_TEMPLATES.python)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'tests' | 'result' | 'demo'>('tests')
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0)

  // Results state
  const [lastSubmission, setLastSubmission] = useState<{
    status: SubmissionStatus
    runtime?: number
    memory?: number
    output?: string
    errorMessage?: string
    testResults?: TestResult[]
    isDemo?: boolean
  } | null>(null)

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
    if (initialCodeTemplates?.[newLang]) {
      setCode(initialCodeTemplates[newLang]!)
    } else {
      setCode(DEFAULT_TEMPLATES[newLang])
    }
  }

  const handleReset = () => {
    setCode(DEFAULT_TEMPLATES[language])
    toast('Code reset to template', { icon: '🔄' })
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setActiveTab('result')

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          code,
          language,
          contestId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Please sign in to submit code')
          return
        }
        throw new Error(data.error || 'Submission failed')
      }

      setLastSubmission(data.submission)
      if (data.submission.status === 'ACCEPTED') {
        toast.success(data.submission.isDemo ? 'Accepted in Demo Mode!' : 'Accepted! All tests passed!')
      } else {
        toast.error(`Result: ${data.submission.status.replace('_', ' ')}`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Submission error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden shadow-lg">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-surface-2 border-b border-border">
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="bg-surface text-text-primary text-xs font-mono font-medium rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-accent-500"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="cpp">C++ (GCC 9.2)</option>
            <option value="java">Java (OpenJDK 13)</option>
          </select>

          <Button
            variant="ghost"
            size="xs"
            onClick={handleReset}
            className="text-text-muted hover:text-text-primary"
            title="Reset code template"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<Send className="h-3.5 w-3.5" />}
          >
            Submit Solution
          </Button>
        </div>
      </div>

      {/* Monaco Code Editor Area */}
      <div className="flex-1 min-h-[380px] w-full bg-[#1e1e2e]">
        <Editor
          height="100%"
          language={language === 'cpp' ? 'cpp' : language === 'javascript' ? 'javascript' : language === 'java' ? 'java' : 'python'}
          value={code}
          onChange={(val) => setCode(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Bottom Panel: Test Cases & Execution Results */}
      <div className="h-60 border-t border-border flex flex-col bg-surface">
        {/* Panel Tabs */}
        <div className="flex items-center justify-between border-b border-border px-4 bg-surface-2/40">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'tests'
                  ? 'border-accent-500 text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Test Cases ({testCases.length})
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'result'
                  ? 'border-accent-500 text-text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Execution Result
              {lastSubmission && (
                <span className={`w-2 h-2 rounded-full ${lastSubmission.status === 'ACCEPTED' ? 'bg-green-400' : 'bg-red-400'}`} />
              )}
            </button>
          </div>

          {lastSubmission?.isDemo && (
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <Info className="h-3.5 w-3.5" />
              <span>Demo Mode</span>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 text-xs font-mono">
          {activeTab === 'tests' && (
            <div className="space-y-3">
              <div className="flex gap-2 pb-1 overflow-x-auto">
                {testCases.map((tc, idx) => (
                  <button
                    key={tc.id}
                    onClick={() => setSelectedTestCaseIndex(idx)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      selectedTestCaseIndex === idx
                        ? 'bg-accent-600/20 text-accent-400 border border-accent-500/30'
                        : 'bg-surface-2 text-text-muted hover:text-text-primary'
                    }`}
                  >
                    Case {idx + 1} {tc.isSample && '(Sample)'}
                  </button>
                ))}
              </div>

              {testCases[selectedTestCaseIndex] && (
                <div className="space-y-2">
                  <div>
                    <span className="text-text-muted uppercase text-[10px] tracking-wider block mb-1">Input</span>
                    <pre className="p-2.5 bg-surface-2 rounded-lg border border-border text-text-primary whitespace-pre-wrap">
                      {testCases[selectedTestCaseIndex].input || '(empty)'}
                    </pre>
                  </div>
                  <div>
                    <span className="text-text-muted uppercase text-[10px] tracking-wider block mb-1">Expected Output</span>
                    <pre className="p-2.5 bg-surface-2 rounded-lg border border-border text-text-primary whitespace-pre-wrap">
                      {testCases[selectedTestCaseIndex].expected}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'result' && (
            <div>
              {!lastSubmission ? (
                <div className="flex flex-col items-center justify-center h-40 text-text-muted text-center space-y-2">
                  <Play className="h-5 w-5 opacity-40" />
                  <p>Click &quot;Submit Solution&quot; to run your code against test cases.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lastSubmission.isDemo && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-lg text-amber-300 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold block mb-0.5">Demo Simulation Mode Active</strong>
                        <p className="text-amber-200/80 leading-relaxed">
                          Judge0 API credentials are not set. The platform safely runs in demo mode without executing untrusted code on the server process. To enable live sandbox execution, supply <code className="bg-amber-500/20 px-1 rounded">JUDGE0_API_URL</code> and <code className="bg-amber-500/20 px-1 rounded">JUDGE0_API_KEY</code>.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={lastSubmission.status} />
                      {lastSubmission.runtime !== undefined && (
                        <span className="flex items-center gap-1 text-text-secondary">
                          <Clock className="h-3.5 w-3.5 text-text-muted" />
                          {lastSubmission.runtime} ms
                        </span>
                      )}
                      {lastSubmission.memory !== undefined && (
                        <span className="flex items-center gap-1 text-text-secondary">
                          <Cpu className="h-3.5 w-3.5 text-text-muted" />
                          {(lastSubmission.memory / 1024).toFixed(1)} MB
                        </span>
                      )}
                    </div>
                  </div>

                  {lastSubmission.errorMessage && (
                    <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-lg text-red-300 whitespace-pre-wrap">
                      <span className="font-semibold block mb-1">Execution Error:</span>
                      {lastSubmission.errorMessage}
                    </div>
                  )}

                  {lastSubmission.testResults && lastSubmission.testResults.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-text-muted uppercase text-[10px] tracking-wider block">Test Results</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {lastSubmission.testResults.map((tr, idx) => (
                          <div
                            key={tr.testCaseId || idx}
                            className={`p-2 rounded-lg border flex items-center justify-between ${
                              tr.passed
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}
                          >
                            <span>Test {idx + 1}</span>
                            {tr.passed ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
