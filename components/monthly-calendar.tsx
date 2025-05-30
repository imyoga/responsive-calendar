"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

interface MonthlyCalendarProps {
  year: number
  month: number
}

export function MonthlyCalendar({ year: initialYear, month: initialMonth }: MonthlyCalendarProps) {
  const [currentYear, setCurrentYear] = useState(initialYear)
  const [currentMonth, setCurrentMonth] = useState(initialMonth)

  // Auto-update when year changes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const newYear = now.getFullYear()
      if (newYear !== currentYear) {
        setCurrentYear(newYear)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [currentYear])

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth
    const currentDate = today.getDate()

    // Get previous month info
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

    const days = []

    // Previous month's trailing days (greyed out)
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      days.push(
        <div
          key={`prev-${day}`}
          className="h-24 border border-purple-100 dark:border-purple-800/30 p-2 bg-purple-50/30 dark:bg-purple-900/10"
        >
          <div className="text-sm font-medium text-gray-300 dark:text-gray-600">{day}</div>
        </div>,
      )
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === currentDate
      days.push(
        <div
          key={day}
          className={`h-24 border border-purple-100 dark:border-purple-800/30 p-2 transition-all duration-200 ${
            isToday
              ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
              : "bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 hover:scale-105"
          }`}
        >
          <div className={`text-sm font-medium ${isToday ? "text-white" : "text-gray-900 dark:text-gray-100"}`}>
            {day}
          </div>
        </div>,
      )
    }

    // Next month's leading days (greyed out) to complete the grid
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const remainingCells = totalCells - (firstDay + daysInMonth)

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="h-24 border border-purple-100 dark:border-purple-800/30 p-2 bg-purple-50/30 dark:bg-purple-900/10"
        >
          <div className="text-sm font-medium text-gray-300 dark:text-gray-600">{day}</div>
        </div>,
      )
    }

    return days
  }

  return (
    <Card className="p-6 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 shadow-xl shadow-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth("prev")}
          className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <h2 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateMonth("next")}
          className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0 mb-4">
        {dayNames.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/30"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0 border border-purple-200/50 dark:border-purple-700/30 rounded-lg overflow-hidden">
        {renderCalendar()}
      </div>
    </Card>
  )
}
