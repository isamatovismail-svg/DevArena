import { 
  formatDuration, 
  formatMemory, 
  getRatingTitle, 
  getRatingColor, 
  getStatusLabel, 
  parseTags, 
  parseExamples 
} from '@/lib/utils'

describe('DevArena Utility Functions', () => {
  describe('formatDuration', () => {
    it('formats milliseconds below 1000ms', () => {
      expect(formatDuration(450)).toBe('450ms')
      expect(formatDuration(0)).toBe('0ms')
    })

    it('formats seconds for 1000ms and above', () => {
      expect(formatDuration(1500)).toBe('1.50s')
      expect(formatDuration(2000)).toBe('2.00s')
    })
  })

  describe('formatMemory', () => {
    it('formats kilobytes below 1024 KB', () => {
      expect(formatMemory(512)).toBe('512 KB')
    })

    it('formats megabytes above 1024 KB', () => {
      expect(formatMemory(2048)).toBe('2.0 MB')
      expect(formatMemory(1536)).toBe('1.5 MB')
    })
  })

  describe('Rating Calculation', () => {
    it('returns correct titles according to Elo rating', () => {
      expect(getRatingTitle(2500)).toBe('Grandmaster')
      expect(getRatingTitle(2150)).toBe('Master')
      expect(getRatingTitle(1950)).toBe('Candidate Master')
      expect(getRatingTitle(1650)).toBe('Expert')
      expect(getRatingTitle(1450)).toBe('Specialist')
      expect(getRatingTitle(1200)).toBe('Newbie')
    })
  })

  describe('Status Labels', () => {
    it('converts status enum values to readable human text', () => {
      expect(getStatusLabel('ACCEPTED')).toBe('Accepted')
      expect(getStatusLabel('WRONG_ANSWER')).toBe('Wrong Answer')
      expect(getStatusLabel('TIME_LIMIT_EXCEEDED')).toBe('Time Limit Exceeded')
      expect(getStatusLabel('COMPILATION_ERROR')).toBe('Compilation Error')
      expect(getStatusLabel('RUNTIME_ERROR')).toBe('Runtime Error')
    })
  })

  describe('JSON Parsers', () => {
    it('safely parses tag strings and handles bad input', () => {
      expect(parseTags('["Array", "Hash Table"]')).toEqual(['Array', 'Hash Table'])
      expect(parseTags('invalid json')).toEqual([])
      expect(parseTags('')).toEqual([])
    })

    it('safely parses problem examples', () => {
      const sample = '[{"input":"1 2","output":"3"}]'
      expect(parseExamples(sample)).toEqual([{ input: '1 2', output: '3' }])
      expect(parseExamples('invalid')).toEqual([])
    })
  })
})
