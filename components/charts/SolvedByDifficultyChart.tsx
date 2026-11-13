'use client'

import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface SolvedByDifficultyProps {
  easy: number
  medium: number
  hard: number
}

export function SolvedByDifficultyChart({ easy, medium, hard }: SolvedByDifficultyProps) {
  const total = easy + medium + hard
  const data = [
    { name: 'Easy', value: easy, color: '#22c55e' },
    { name: 'Medium', value: medium, color: '#eab308' },
    { name: 'Hard', value: hard, color: '#ef4444' },
  ].filter((d) => d.value > 0)

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-44 text-text-muted text-xs space-y-1">
        <span>0 problems solved</span>
        <span className="text-[11px] text-text-muted/60">Solve problems to see distribution</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-36 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={56}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#111118" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#161622',
                border: '1px solid #2e2e42',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#e8e8f0',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-text-primary leading-none">{total}</span>
          <span className="text-[10px] text-text-muted uppercase tracking-wider">Solved</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-text-secondary">Easy ({easy})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="text-text-secondary">Med ({medium})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-text-secondary">Hard ({hard})</span>
        </div>
      </div>
    </div>
  )
}
