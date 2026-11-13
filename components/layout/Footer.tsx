import React from 'react'
import Link from 'next/link'
import { Zap, Github, Trophy, BookOpen, BarChart2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 bg-accent-600 rounded-lg">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="font-bold text-base text-text-primary">
                Dev<span className="text-accent-400">Arena</span>
              </span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed">
              Competitive coding platform crafted for high-performance engineers, algorithmic mastery, and global contests.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Platform</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <Link href="/problems" className="hover:text-accent-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Problem Archive
                </Link>
              </li>
              <li>
                <Link href="/contests" className="hover:text-accent-400 transition-colors flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5" />
                  Active Contests
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-accent-400 transition-colors flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5" />
                  Global Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Features</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>Multi-language Monaco Editor</li>
              <li>Server-side Code Judge Integration</li>
              <li>Dynamic Rating & Progression</li>
              <li>Achievement Unlock System</li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Community</h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li>
                <span className="inline-flex items-center gap-1.5 text-text-muted">
                  <Github className="h-3.5 w-3.5" />
                  Open Source MVP
                </span>
              </li>
              <li className="text-text-muted">
                Status: <span className="text-green-400 font-mono">All Systems Operational</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} DevArena. Built with Next.js, TypeScript, Prisma & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <Link href="/problems" className="hover:text-text-secondary transition-colors">Problems</Link>
            <Link href="/contests" className="hover:text-text-secondary transition-colors">Contests</Link>
            <Link href="/leaderboard" className="hover:text-text-secondary transition-colors">Rankings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
