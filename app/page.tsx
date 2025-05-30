"use client"

import { YearlyCalendar } from "@/components/yearly-calendar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    // Update year automatically when it changes
    const interval = setInterval(() => {
      const newYear = new Date().getFullYear()
      if (newYear !== currentYear) {
        setCurrentYear(newYear)
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [currentYear])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-indigo-200 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 transition-colors duration-300 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzM0ZWEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtMTJ2Nmg2di02aC02em0xMiA2djZoNnYtNmgtNnptLTYgMTJ2Nmg2di02aC02em0tMTIgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-70 dark:opacity-20 pointer-events-none"></div>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto p-4 pt-16">
        <header className="text-center mb-8">
          <div className="relative">
            <h1 className="text-6xl font-light bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
              {currentYear}
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-indigo-600/20 blur-3xl -z-10"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Click any month to view details</p>
        </header>
        <YearlyCalendar year={currentYear} />
      </div>
    </div>
  )
}
