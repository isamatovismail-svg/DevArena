import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const problems = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: 'EASY',
    category: 'Arrays',
    tags: JSON.stringify(['Array', 'Hash Table', 'Two Pointers']),
    constraints: `- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    inputFormat: 'First line: space-separated integers (the array). Second line: the target integer.',
    outputFormat: 'Two space-separated integers representing the indices.',
    examples: JSON.stringify([
      { input: '2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so return 0 1.' },
      { input: '3 2 4\n6', output: '1 2', explanation: 'nums[1] + nums[2] = 2 + 4 = 6, so return 1 2.' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 100,
    testCases: [
      { input: '2 7 11 15\n9', expected: '0 1', isSample: true },
      { input: '3 2 4\n6', expected: '1 2', isSample: true },
      { input: '3 3\n6', expected: '0 1', isSample: false },
      { input: '1 2 3 4 5\n9', expected: '3 4', isSample: false },
    ],
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.

An input string is valid if:
- Open brackets must be closed by the same type of brackets.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: 'EASY',
    category: 'Stack',
    tags: JSON.stringify(['String', 'Stack']),
    constraints: `- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.`,
    inputFormat: 'A single string containing bracket characters.',
    outputFormat: '"true" if the string is valid, "false" otherwise.',
    examples: JSON.stringify([
      { input: '()', output: 'true' },
      { input: '()[]{}', output: 'true' },
      { input: '(]', output: 'false', explanation: 'The bracket types do not match.' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 100,
    testCases: [
      { input: '()', expected: 'true', isSample: true },
      { input: '()[]{}', expected: 'true', isSample: true },
      { input: '(]', expected: 'false', isSample: false },
      { input: '{[]}', expected: 'true', isSample: false },
      { input: '([)]', expected: 'false', isSample: false },
    ],
  },
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    description: `Given the values of a singly linked list (as space-separated integers), reverse the list and output the reversed values.

For example, if the list is 1 -> 2 -> 3 -> 4 -> 5, the reversed list is 5 -> 4 -> 3 -> 2 -> 1.`,
    difficulty: 'EASY',
    category: 'Linked Lists',
    tags: JSON.stringify(['Linked List', 'Recursion']),
    constraints: `- The number of nodes in the list is in the range [0, 5000].
- -5000 <= Node.val <= 5000`,
    inputFormat: 'A single line of space-separated integers representing the linked list values.',
    outputFormat: 'Space-separated integers representing the reversed list.',
    examples: JSON.stringify([
      { input: '1 2 3 4 5', output: '5 4 3 2 1' },
      { input: '1 2', output: '2 1' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 100,
    testCases: [
      { input: '1 2 3 4 5', expected: '5 4 3 2 1', isSample: true },
      { input: '1 2', expected: '2 1', isSample: true },
      { input: '1', expected: '1', isSample: false },
      { input: '10 20 30 40', expected: '40 30 20 10', isSample: false },
    ],
  },
  {
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    description: `Given an integer array \`nums\`, find the contiguous subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    difficulty: 'MEDIUM',
    category: 'Dynamic Programming',
    tags: JSON.stringify(['Array', 'Divide and Conquer', 'Dynamic Programming', "Kadane's Algorithm"]),
    constraints: `- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4`,
    inputFormat: 'A single line of space-separated integers.',
    outputFormat: 'A single integer representing the maximum subarray sum.',
    examples: JSON.stringify([
      { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: '1', output: '1' },
      { input: '5 4 -1 7 8', output: '23' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 200,
    testCases: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', expected: '6', isSample: true },
      { input: '1', expected: '1', isSample: true },
      { input: '5 4 -1 7 8', expected: '23', isSample: false },
      { input: '-1 -2 -3', expected: '-1', isSample: false },
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, return its 0-based index. Otherwise, return \`-1\`.

You must write an algorithm with O(log n) runtime complexity.`,
    difficulty: 'EASY',
    category: 'Binary Search',
    tags: JSON.stringify(['Array', 'Binary Search']),
    constraints: `- 1 <= nums.length <= 10^4
- -10^4 < nums[i], target < 10^4
- All the integers in nums are unique.
- nums is sorted in ascending order.`,
    inputFormat: 'First line: space-separated sorted integers. Second line: target integer.',
    outputFormat: 'The index of the target, or -1 if not found.',
    examples: JSON.stringify([
      { input: '-1 0 3 5 9 12\n9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: '-1 0 3 5 9 12\n2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 100,
    testCases: [
      { input: '-1 0 3 5 9 12\n9', expected: '4', isSample: true },
      { input: '-1 0 3 5 9 12\n2', expected: '-1', isSample: true },
      { input: '1\n1', expected: '0', isSample: false },
      { input: '1 3 5 7 9\n5', expected: '2', isSample: false },
    ],
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    description: `Given an array of intervals where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return the non-overlapping intervals sorted by start time.

Each interval is represented by two space-separated integers on its own line.`,
    difficulty: 'MEDIUM',
    category: 'Arrays',
    tags: JSON.stringify(['Array', 'Sorting']),
    constraints: `- 1 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= start_i <= end_i <= 10^4`,
    inputFormat: 'First line: integer n (number of intervals). Next n lines: two space-separated integers.',
    outputFormat: 'Merged intervals, one per line, formatted as two space-separated integers.',
    examples: JSON.stringify([
      { input: '4\n1 3\n2 6\n8 10\n15 18', output: '1 6\n8 10\n15 18', explanation: 'Intervals [1,3] and [2,6] overlap, merged into [1,6].' },
      { input: '2\n1 4\n4 5', output: '1 5', explanation: 'Intervals [1,4] and [4,5] touch, merged into [1,5].' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 200,
    testCases: [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expected: '1 6\n8 10\n15 18', isSample: true },
      { input: '2\n1 4\n4 5', expected: '1 5', isSample: true },
      { input: '1\n1 1', expected: '1 1', isSample: false },
    ],
  },
  {
    slug: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    description: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence. If there is no common subsequence, return \`0\`.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.`,
    difficulty: 'MEDIUM',
    category: 'Dynamic Programming',
    tags: JSON.stringify(['String', 'Dynamic Programming']),
    constraints: `- 1 <= text1.length, text2.length <= 1000
- text1 and text2 consist of only lowercase English letters.`,
    inputFormat: 'Two lines, each containing a string.',
    outputFormat: 'A single integer: the length of the longest common subsequence.',
    examples: JSON.stringify([
      { input: 'abcde\nace', output: '3', explanation: 'The longest common subsequence is "ace" and its length is 3.' },
      { input: 'abc\nabc', output: '3', explanation: 'The longest common subsequence is "abc" and its length is 3.' },
      { input: 'abc\ndef', output: '0', explanation: 'There is no common subsequence, so the result is 0.' },
    ]),
    timeLimit: 2000,
    memoryLimit: 256,
    points: 200,
    testCases: [
      { input: 'abcde\nace', expected: '3', isSample: true },
      { input: 'abc\nabc', expected: '3', isSample: true },
      { input: 'abc\ndef', expected: '0', isSample: false },
      { input: 'ezupkr\nubmrapg', expected: '2', isSample: false },
    ],
  },
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are completely surrounded by water.`,
    difficulty: 'MEDIUM',
    category: 'Graphs',
    tags: JSON.stringify(['Array', 'DFS', 'BFS', 'Graph', 'Matrix']),
    constraints: `- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'.`,
    inputFormat: 'First line: m n (grid dimensions). Next m lines: n space-separated characters (0 or 1).',
    outputFormat: 'A single integer: total count of islands.',
    examples: JSON.stringify([
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 200,
    testCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', expected: '1', isSample: true },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expected: '3', isSample: true },
      { input: '1 1\n1', expected: '1', isSample: false },
      { input: '2 2\n0 0\n0 0', expected: '0', isSample: false },
    ],
  },
  {
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    difficulty: 'HARD',
    category: 'Arrays',
    tags: JSON.stringify(['Array', 'Two Pointers', 'Stack', 'Dynamic Programming']),
    constraints: `- n == height.length
- 1 <= n <= 2 * 10^4
- 0 <= height[i] <= 10^5`,
    inputFormat: 'A single line of space-separated non-negative integers representing bar heights.',
    outputFormat: 'A single integer representing total units of trapped rain water.',
    examples: JSON.stringify([
      { input: '0 1 0 2 1 0 1 3 2 1 2 1', output: '6', explanation: '6 units of rain water are trapped between peaks.' },
      { input: '4 2 0 3 2 5', output: '9' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 300,
    testCases: [
      { input: '0 1 0 2 1 0 1 3 2 1 2 1', expected: '6', isSample: true },
      { input: '4 2 0 3 2 5', expected: '9', isSample: true },
      { input: '1 0 1', expected: '1', isSample: false },
      { input: '3 0 2 0 4', expected: '7', isSample: false },
    ],
  },
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    difficulty: 'EASY',
    category: 'Dynamic Programming',
    tags: JSON.stringify(['Math', 'Dynamic Programming', 'Memoization']),
    constraints: `- 1 <= n <= 45`,
    inputFormat: 'A single integer n.',
    outputFormat: 'A single integer: number of distinct ways to climb to the top.',
    examples: JSON.stringify([
      { input: '2', output: '2', explanation: 'Two ways: 1+1 or 2.' },
      { input: '3', output: '3', explanation: 'Three ways: 1+1+1, 1+2, or 2+1.' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 100,
    testCases: [
      { input: '2', expected: '2', isSample: true },
      { input: '3', expected: '3', isSample: true },
      { input: '1', expected: '1', isSample: false },
      { input: '10', expected: '89', isSample: false },
      { input: '45', expected: '1836311903', isSample: false },
    ],
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    description: `Given a string \`s\`, return the longest palindromic substring in \`s\`.

A palindrome is a string that reads the same forward and backward. If there are multiple substrings of the same maximum length, return any one of them.`,
    difficulty: 'MEDIUM',
    category: 'Strings',
    tags: JSON.stringify(['String', 'Dynamic Programming', 'Two Pointers']),
    constraints: `- 1 <= s.length <= 1000
- s consists of digits and English letters only.`,
    inputFormat: 'A single line containing the string s.',
    outputFormat: 'The longest palindromic substring.',
    examples: JSON.stringify([
      { input: 'babad', output: 'bab', explanation: '"aba" is also valid.' },
      { input: 'cbbd', output: 'bb' },
    ]),
    timeLimit: 2000,
    memoryLimit: 256,
    points: 200,
    testCases: [
      { input: 'cbbd', expected: 'bb', isSample: true },
      { input: 'a', expected: 'a', isSample: false },
      { input: 'racecar', expected: 'racecar', isSample: false },
    ],
  },
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a_i, b_i]\` indicates that you must take course \`b_i\` first before course \`a_i\`.

Return "true" if you can finish all courses. Otherwise, return "false".`,
    difficulty: 'MEDIUM',
    category: 'Graphs',
    tags: JSON.stringify(['DFS', 'BFS', 'Graph', 'Topological Sort']),
    constraints: `- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000
- prerequisites[i].length == 2
- 0 <= a_i, b_i < numCourses
- All prerequisite pairs are unique.`,
    inputFormat: 'First line: numCourses. Second line: integer p (number of prerequisite pairs). Next p lines: two space-separated integers a and b (a depends on b).',
    outputFormat: '"true" or "false".',
    examples: JSON.stringify([
      { input: '2\n1\n1 0', output: 'true', explanation: 'Take course 0 then course 1.' },
      { input: '2\n2\n1 0\n0 1', output: 'false', explanation: 'Circular dependency exists.' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 200,
    testCases: [
      { input: '2\n1\n1 0', expected: 'true', isSample: true },
      { input: '2\n2\n1 0\n0 1', expected: 'false', isSample: true },
      { input: '1\n0', expected: 'true', isSample: false },
    ],
  },
  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)). Output formatted as a floating point number to 1 decimal place.`,
    difficulty: 'HARD',
    category: 'Binary Search',
    tags: JSON.stringify(['Array', 'Binary Search', 'Divide and Conquer']),
    constraints: `- nums1.length == m
- nums2.length == n
- 0 <= m, n <= 1000
- 1 <= m + n <= 2000
- -10^6 <= nums1[i], nums2[i] <= 10^6`,
    inputFormat: 'First line: space-separated integers of nums1. Second line: space-separated integers of nums2.',
    outputFormat: 'Float representation of the median with one decimal place (e.g. 2.0 or 2.5).',
    examples: JSON.stringify([
      { input: '1 3\n2', output: '2.0', explanation: 'Merged array [1,2,3], median = 2.0.' },
      { input: '1 2\n3 4', output: '2.5', explanation: 'Merged array [1,2,3,4], median = (2+3)/2 = 2.5.' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 300,
    testCases: [
      { input: '1 3\n2', expected: '2.0', isSample: true },
      { input: '1 2\n3 4', expected: '2.5', isSample: true },
      { input: '0 0\n0 0', expected: '0.0', isSample: false },
    ],
  },
  {
    slug: 'word-search',
    title: 'Word Search',
    description: `Given an m x n grid of characters board and a string word, return "true" if word exists in the grid, or "false" otherwise.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    difficulty: 'MEDIUM',
    category: 'Backtracking',
    tags: JSON.stringify(['Array', 'Backtracking', 'Matrix']),
    constraints: `- m == board.length
- n == board[i].length
- 1 <= m, n <= 6
- 1 <= word.length <= 15
- board and word consist of only uppercase and lowercase English letters.`,
    inputFormat: 'First line: m n. Next m lines: space-separated characters. Last line: target word.',
    outputFormat: '"true" or "false".',
    examples: JSON.stringify([
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', output: 'true' },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nSEE', output: 'true' },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCB', output: 'false' },
    ]),
    timeLimit: 2000,
    memoryLimit: 256,
    points: 200,
    testCases: [
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', expected: 'true', isSample: true },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nSEE', expected: 'true', isSample: false },
      { input: '3 4\nA B C E\nS F C S\nA D E E\nABCB', expected: 'false', isSample: false },
    ],
  },
  {
    slug: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for '.' and '*' where:

- '.' Matches any single character.
- '*' Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).`,
    difficulty: 'HARD',
    category: 'Dynamic Programming',
    tags: JSON.stringify(['String', 'Dynamic Programming', 'Recursion']),
    constraints: `- 1 <= s.length <= 20
- 1 <= p.length <= 30
- s contains only lowercase English letters.
- p contains lowercase English letters, '.', and '*'.`,
    inputFormat: 'First line: string s. Second line: pattern p.',
    outputFormat: '"true" or "false".',
    examples: JSON.stringify([
      { input: 'aa\na', output: 'false' },
      { input: 'aa\na*', output: 'true', explanation: '\'*\' means zero or more \'a\', matches \'aa\'.' },
      { input: 'ab\n.*', output: 'true' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 300,
    testCases: [
      { input: 'aa\na', expected: 'false', isSample: true },
      { input: 'aa\na*', expected: 'true', isSample: true },
      { input: 'ab\n.*', expected: 'true', isSample: false },
      { input: 'aab\nc*a*b', expected: 'true', isSample: false },
    ],
  },
  {
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    description: `Given the root of a binary tree represented as level-order space-separated integers (with 'null' representing missing children), invert the tree, and return its level-order values.

Inverting a tree means swapping every left and right child recursively.`,
    difficulty: 'EASY',
    category: 'Trees',
    tags: JSON.stringify(['Tree', 'DFS', 'BFS', 'Binary Tree']),
    constraints: `- The number of nodes in the tree is in the range [0, 100].
- -100 <= Node.val <= 100`,
    inputFormat: 'A single line of space-separated values representing the binary tree in level order.',
    outputFormat: 'Space-separated level order values of the inverted tree.',
    examples: JSON.stringify([
      { input: '4 2 7 1 3 6 9', output: '4 7 2 9 6 3 1' },
      { input: '2 1 3', output: '2 3 1' },
    ]),
    timeLimit: 1000,
    memoryLimit: 256,
    points: 100,
    testCases: [
      { input: '4 2 7 1 3 6 9', expected: '4 7 2 9 6 3 1', isSample: true },
      { input: '2 1 3', expected: '2 3 1', isSample: true },
      { input: '1', expected: '1', isSample: false },
    ],
  },
]

const achievements = [
  { slug: 'first-solve', title: 'First Blood', description: 'Solve your first problem on DevArena', icon: '🎯', points: 10 },
  { slug: 'ten-solves', title: 'Getting Warmed Up', description: 'Solve 10 programming problems', icon: '🔥', points: 25 },
  { slug: 'fifty-solves', title: 'Master Problem Solver', description: 'Solve 50 programming challenges', icon: '⚡', points: 100 },
  { slug: 'hundred-solves', title: 'Century Club', description: 'Solve 100 programming challenges', icon: '💯', points: 250 },
  { slug: 'contest-participant', title: 'Arena Warrior', description: 'Participate in your first official contest', icon: '🏆', points: 15 },
  { slug: 'perfect-week', title: 'Streak Master', description: 'Solve at least one problem every day for 7 days', icon: '📅', points: 50 },
  { slug: 'hard-solver', title: 'Hardcore Coder', description: 'Successfully solve a Hard difficulty problem', icon: '💪', points: 50 },
  { slug: 'speed-demon', title: 'Speed Demon', description: 'Submit an accepted solution with lightning execution time', icon: '⚡', points: 30 },
  { slug: 'precision-strike', title: 'Precision Strike', description: 'Solve 5 problems on your very first submission', icon: '🎯', points: 40 },
  { slug: 'contest-winner', title: 'Arena Champion', description: 'Rank in top 3 in any official contest', icon: '🥇', points: 200 },
]

async function main() {
  console.log('🌱 Starting DevArena database seed...')

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_SEED !== 'true') {
    console.error('❌ Refusing to seed default demo accounts in production environment.')
    console.error('   To override for staging, set ALLOW_DEMO_SEED=true in environment.')
    process.exit(1)
  }

  // 1. Create Admin
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@devarena.dev' },
    update: {},
    create: {
      email: 'admin@devarena.dev',
      username: 'admin',
      passwordHash: adminPassword,
      displayName: 'DevArena Administrator',
      role: 'ADMIN',
      rating: 2500,
      bio: 'Platform administrator & grandmaster competitive programmer.',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // 2. Create Demo Users
  const demoPassword = await bcrypt.hash('demo123', 12)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        username: 'alice_codes',
        passwordHash: demoPassword,
        displayName: 'Alice Chen',
        rating: 1850,
        bio: 'Competitive programmer from MIT. Algorithms enthusiast & graph lover.',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        username: 'bob_dev',
        passwordHash: demoPassword,
        displayName: 'Bob Smith',
        rating: 1620,
        bio: 'Software engineer building web apps and climbing the DevArena ladder.',
      },
    }),
    prisma.user.upsert({
      where: { email: 'carol@example.com' },
      update: {},
      create: {
        email: 'carol@example.com',
        username: 'carol_algo',
        passwordHash: demoPassword,
        displayName: 'Carol Johnson',
        rating: 2120,
        bio: 'Candidate Master. 3x regional ICPC medalist.',
      },
    }),
  ])
  console.log('✅ Demo users created:', users.map(u => u.username).join(', '))

  // 3. Create Achievements
  const achievementRecords = await Promise.all(
    achievements.map(a =>
      prisma.achievement.upsert({
        where: { slug: a.slug },
        update: {},
        create: a,
      })
    )
  )
  console.log(`✅ ${achievementRecords.length} achievements created`)

  // 4. Create Problems & TestCases
  const problemRecords: any[] = []
  for (const p of problems) {
    const { testCases, ...problemData } = p
    const problem = await prisma.problem.upsert({
      where: { slug: p.slug },
      update: problemData,
      create: problemData,
    })

    // Upsert test cases
    for (let i = 0; i < testCases.length; i++) {
      await prisma.testCase.create({
        data: {
          problemId: problem.id,
          input: testCases[i].input,
          expected: testCases[i].expected,
          isSample: testCases[i].isSample,
          orderIndex: i,
        },
      }).catch(() => {})
    }
    problemRecords.push(problem)
  }
  console.log(`✅ ${problemRecords.length} problems created`)

  // 5. Create Submissions
  const submissionsData = [
    { user: users[0], problemSlug: 'two-sum', status: 'ACCEPTED', language: 'python', runtime: 42, memory: 14200 },
    { user: users[0], problemSlug: 'valid-parentheses', status: 'ACCEPTED', language: 'python', runtime: 28, memory: 13900 },
    { user: users[0], problemSlug: 'binary-search', status: 'ACCEPTED', language: 'javascript', runtime: 55, memory: 18400 },
    { user: users[0], problemSlug: 'climbing-stairs', status: 'ACCEPTED', language: 'python', runtime: 19, memory: 13800 },
    { user: users[0], problemSlug: 'maximum-subarray', status: 'ACCEPTED', language: 'python', runtime: 85, memory: 24100 },
    { user: users[0], problemSlug: 'trapping-rain-water', status: 'WRONG_ANSWER', language: 'python', runtime: 110, memory: 28000 },
    { user: users[1], problemSlug: 'two-sum', status: 'ACCEPTED', language: 'javascript', runtime: 68, memory: 19200 },
    { user: users[1], problemSlug: 'climbing-stairs', status: 'ACCEPTED', language: 'javascript', runtime: 48, memory: 17500 },
    { user: users[1], problemSlug: 'binary-search', status: 'WRONG_ANSWER', language: 'javascript', runtime: 75, memory: 18100 },
    { user: users[2], problemSlug: 'two-sum', status: 'ACCEPTED', language: 'cpp', runtime: 4, memory: 8200 },
    { user: users[2], problemSlug: 'valid-parentheses', status: 'ACCEPTED', language: 'cpp', runtime: 2, memory: 7800 },
    { user: users[2], problemSlug: 'maximum-subarray', status: 'ACCEPTED', language: 'cpp', runtime: 8, memory: 9100 },
    { user: users[2], problemSlug: 'trapping-rain-water', status: 'ACCEPTED', language: 'cpp', runtime: 12, memory: 10400 },
    { user: users[2], problemSlug: 'median-of-two-sorted-arrays', status: 'ACCEPTED', language: 'cpp', runtime: 15, memory: 11200 },
    { user: users[2], problemSlug: 'regular-expression-matching', status: 'ACCEPTED', language: 'cpp', runtime: 18, memory: 11800 },
  ]

  for (const s of submissionsData) {
    const prob = problemRecords.find(p => p.slug === s.problemSlug)
    if (!prob) continue
    await prisma.submission.create({
      data: {
        userId: s.user.id,
        problemId: prob.id,
        code: `// DevArena sample submission for ${prob.title}\nfunction solve() { return true; }`,
        language: s.language,
        status: s.status,
        runtime: s.runtime,
        memory: s.memory,
        output: s.status === 'ACCEPTED' ? 'All tests passed' : 'Mismatch at test 2',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 20 * 86400000)),
      },
    })
  }
  console.log('✅ Sample submissions created')

  // 6. Create Contests
  const now = new Date()
  const contests = [
    {
      slug: 'devarena-weekly-1',
      title: 'DevArena Weekly Round #1',
      description: 'The inaugural DevArena round! Compete against top developers worldwide with classic dynamic programming, array manipulation, and graph problems.',
      startTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      isPublished: true,
    },
    {
      slug: 'devarena-weekly-2',
      title: 'DevArena Weekly Round #2',
      description: 'Round 2 features advanced graph traversals and interval scheduling problems. Sharpen your competitive edge!',
      startTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      isPublished: true,
    },
    {
      slug: 'devarena-grand-prix-1',
      title: 'DevArena Grand Prix 2024',
      description: 'Major championship event with five challenging algorithmic problems and rating multiplier. Open to all divisions.',
      startTime: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      isPublished: true,
    },
  ]

  for (const c of contests) {
    const contest = await prisma.contest.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })

    // Attach problems
    const contestProblems = problemRecords.slice(0, 4)
    for (let i = 0; i < contestProblems.length; i++) {
      await prisma.contestProblem.upsert({
        where: { contestId_problemId: { contestId: contest.id, problemId: contestProblems[i].id } },
        update: {},
        create: {
          contestId: contest.id,
          problemId: contestProblems[i].id,
          orderIndex: i,
          points: (i + 1) * 100,
        },
      })
    }

    // Add participants to past contest
    if (c.startTime < now) {
      await prisma.contestParticipant.upsert({
        where: { contestId_userId: { contestId: contest.id, userId: users[2].id } },
        update: {},
        create: { contestId: contest.id, userId: users[2].id, score: 300, rank: 1 },
      })
      await prisma.contestParticipant.upsert({
        where: { contestId_userId: { contestId: contest.id, userId: users[0].id } },
        update: {},
        create: { contestId: contest.id, userId: users[0].id, score: 200, rank: 2 },
      })
      await prisma.contestParticipant.upsert({
        where: { contestId_userId: { contestId: contest.id, userId: users[1].id } },
        update: {},
        create: { contestId: contest.id, userId: users[1].id, score: 100, rank: 3 },
      })
    }
  }
  console.log('✅ Contests and participants created')

  // 7. Award Achievements
  const firstSolve = achievementRecords.find(a => a.slug === 'first-solve')!
  const tenSolves = achievementRecords.find(a => a.slug === 'ten-solves')!
  const hardSolver = achievementRecords.find(a => a.slug === 'hard-solver')!
  const contestParticipant = achievementRecords.find(a => a.slug === 'contest-participant')!

  const userAchievementsData = [
    { userId: users[0].id, achievementId: firstSolve.id },
    { userId: users[0].id, achievementId: contestParticipant.id },
    { userId: users[1].id, achievementId: firstSolve.id },
    { userId: users[2].id, achievementId: firstSolve.id },
    { userId: users[2].id, achievementId: tenSolves.id },
    { userId: users[2].id, achievementId: hardSolver.id },
    { userId: users[2].id, achievementId: contestParticipant.id },
  ]

  for (const ua of userAchievementsData) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: ua.userId, achievementId: ua.achievementId } },
      update: {},
      create: ua,
    })
  }
  console.log('✅ User achievements assigned')

  console.log('\n🎉 Seed completed successfully!')
  console.log('==============================================')
  console.log('Demo Credentials:')
  console.log('  Admin: admin@devarena.dev / admin123')
  console.log('  Alice: alice@example.com / demo123')
  console.log('  Bob:   bob@example.com / demo123')
  console.log('  Carol: carol@example.com / demo123')
  console.log('==============================================')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
