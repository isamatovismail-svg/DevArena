import { judgeSubmission, isJudge0Configured } from '@/services/judgeService'

describe('JudgeService', () => {
  it('detects when Judge0 is unconfigured', () => {
    // In test environment without external API configured
    delete process.env.JUDGE0_API_URL
    delete process.env.JUDGE0_API_KEY
    expect(isJudge0Configured()).toBe(false)
  })

  it('runs safely in demo mode without executing untrusted code when Judge0 is unconfigured', async () => {
    delete process.env.JUDGE0_API_URL
    delete process.env.JUDGE0_API_KEY

    const sampleTestCases = [
      { id: 'tc-1', input: '1 2', expected: '3', isSample: true },
      { id: 'tc-2', input: '4 5', expected: '9', isSample: false },
    ]

    const result = await judgeSubmission(
      'print("test")',
      'python',
      sampleTestCases,
      1000,
      256
    )

    expect(result.isDemo).toBe(true)
    expect(result.status).toBe('ACCEPTED')
    expect(result.output).toContain('DEMO MODE')
    expect(result.testResults?.length).toBe(2)
    expect(result.testResults?.[0].passed).toBe(true)
  })
})
