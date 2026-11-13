import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'DevArena - Competitive Programming & Coding Challenges',
    template: '%s | DevArena',
  },
  description: 'Practice programming challenges, compete in rated contests, and elevate your algorithmic problem solving.',
  keywords: ['competitive programming', 'algorithms', 'data structures', 'coding challenges', 'contests'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased min-h-screen flex flex-col font-sans selection:bg-accent-600/30 selection:text-accent-300">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a24',
              color: '#e8e8f0',
              border: '1px solid #2a2a3a',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#0a0a0f' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0a0a0f' },
            },
          }}
        />
      </body>
    </html>
  )
}
