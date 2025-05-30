"use client"

import { Card } from "@/components/ui/card"

interface YearlyCalendarProps {
  year: number
}

export function YearlyCalendar({ year }: YearlyCalendarProps) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handleMonthClick = (monthIndex: number) => {
    window.open(`/month/${monthIndex + 1}`, "_blank")
  }

  const renderMiniMonth = (monthIndex: number) => {
    const daysInMonth = getDaysInMonth(year, monthIndex)
    const firstDay = getFirstDayOfMonth(year, monthIndex)
    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === monthIndex
    const currentDate = today.getDate()

    // Get previous month info
    const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1
    const prevYear = monthIndex === 0 ? year - 1 : year
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

    const days = []

    // Previous month's trailing days (greyed out)
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      days.push(
        <div
          key={`prev-${day}`}
          className="w-6 h-6 flex items-center justify-center text-xs text-gray-300 dark:text-gray-600"
        >
          {day}
        </div>,
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === currentDate
      days.push(
        <div
          key={day}
          className={`w-6 h-6 flex items-center justify-center text-xs transition-all duration-200 ${
            isToday
              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg shadow-purple-500/30"
              : "text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 rounded hover:scale-110"
          }`}
        >
          {day}
        </div>,
      )
    }

    // Next month's leading days (greyed out) to fill the grid
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const remainingCells = totalCells - (firstDay + daysInMonth)

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="w-6 h-6 flex items-center justify-center text-xs text-gray-300 dark:text-gray-600"
        >
          {day}
        </div>,
      )
    }

    return (
      <Card
        key={monthIndex}
        className="p-4 cursor-pointer hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-600 hover:scale-105 group"
        onClick={() => handleMonthClick(monthIndex)}
      >
        <div className="text-center mb-3">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {months[monthIndex]}
          </h3>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <div className="text-center font-medium">S</div>
          <div className="text-center font-medium">M</div>
          <div className="text-center font-medium">T</div>
          <div className="text-center font-medium">W</div>
          <div className="text-center font-medium">T</div>
          <div className="text-center font-medium">F</div>
          <div className="text-center font-medium">S</div>
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
      {Array.from({ length: 12 }, (_, i) => renderMiniMonth(i))}
    </div>
  )
}
