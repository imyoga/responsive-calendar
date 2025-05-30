"use client"

import { Holiday } from "./use-canadian-holidays"
import { useState } from "react"

interface HolidayTooltipProps {
  holiday: Holiday
  children: React.ReactNode
  className?: string
}

export function HolidayTooltip({ holiday, children, className = "" }: HolidayTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const isFederal = holiday.federal === 1
  const isOptional = holiday.provinces && holiday.provinces.some(p => p.nameEn && p.nameEn.includes("Optional"))

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className="absolute z-50 p-3 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg shadow-xl shadow-purple-500/20 min-w-[200px] max-w-[300px] bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-200 dark:border-t-purple-700"></div>
          
          {/* Content */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {holiday.nameEn}
            </h4>
            
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {new Date(holiday.date).toLocaleDateString('en-CA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {holiday.observedDate !== holiday.date && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Observed:</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {new Date(holiday.observedDate).toLocaleDateString('en-CA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <div className="flex items-center gap-1">
                  {isFederal && (
                    <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-300 text-xs rounded-full border border-red-200 dark:border-red-700">
                      Federal
                    </span>
                  )}
                  {isOptional && (
                    <span className="px-2 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full border border-yellow-200 dark:border-yellow-700">
                      Optional
                    </span>
                  )}
                  {!isFederal && !isOptional && (
                    <span className="px-2 py-1 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300 text-xs rounded-full border border-green-200 dark:border-green-700">
                      Statutory
                    </span>
                  )}
                </div>
              </div>
              
              {holiday.provinces && holiday.provinces.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 dark:text-gray-400 mt-0.5">Provinces:</span>
                  <div className="flex flex-wrap gap-1">
                    {holiday.provinces.map((province, index) => (
                      <span 
                        key={index}
                        className="px-1.5 py-0.5 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 text-xs rounded border border-purple-200 dark:border-purple-700"
                      >
                        {province.id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 