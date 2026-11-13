export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
export type SubmissionStatus = 
  | 'PENDING' 
  | 'RUNNING' 
  | 'ACCEPTED' 
  | 'WRONG_ANSWER' 
  | 'TIME_LIMIT_EXCEEDED' 
  | 'COMPILATION_ERROR' 
  | 'RUNTIME_ERROR'
export type UserRole = 'USER' | 'ADMIN'
export type Language = 'javascript' | 'python' | 'java' | 'cpp'

export interface Example {
  input: string
  output: string
  explanation?: string
}

export interface TestResult {
  testCaseId: string
  passed: boolean
  input?: string
  expected?: string
  actual?: string
  runtime?: number
}

export interface ProblemListItem {
  id: string
  slug: string
  title: string
  difficulty: string
  category: string
  tags: string[]
  points: number
  solvedCount?: number
  userStatus?: 'SOLVED' | 'ATTEMPTED' | null
}

export interface UserProfile {
  id: string
  username: string
  displayName?: string | null
  bio?: string | null
  avatarUrl?: string | null
  rating: number
  rank?: number | null
  createdAt: Date
  _count?: {
    submissions: number
  }
}
