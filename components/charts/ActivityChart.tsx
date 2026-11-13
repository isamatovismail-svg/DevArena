'use client'

import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ActivityDataPoint {
  date: string
  submissions: number
  accepted: number
}

interface ActivityChartProps {
  data: ActivityDataPoint[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted text-xs">
        No submission activity recorded in this period
      </div>
    )
  }

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="submissionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="acceptedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#22222e" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6e6e8a', fontSize: 11 }} 
            tickLine={false} 
            axisLine={{ stroke: '#2a2a3a' }} 
          />
          <YAxis 
            tick={{ fill: '#6e6e8a', fontSize: 11 }} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#161622',
              border: '1px solid #2e2e42',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#e8e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          />
          <Area 
            type="monotone" 
            dataKey="submissions" 
            stroke="#8b5cf6" 
            strokeWidth={2} 
            fill="url(#submissionsGradient)" 
            name="Submissions" 
          />
          <Area 
            type="monotone" 
            dataKey="accepted" 
            stroke="#22c55e" 
            strokeWidth={2} 
            fill="url(#acceptedGradient)" 
            name="Accepted" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
