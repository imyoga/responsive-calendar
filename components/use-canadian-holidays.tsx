"use client"

import { useState, useEffect, useCallback } from "react"

export interface Holiday {
  id: number
  date: string
  nameEn: string
  nameFr: string
  federal: number
  observedDate: string
  provinces: Array<{
    id: string
    nameEn: string
    nameFr: string
    sourceLink: string
    sourceEn: string
  }>
}

export interface Province {
  id: string
  nameEn: string
  nameFr: string
  sourceLink: string
  sourceEn: string
  holidays: Holiday[]
  nextHoliday: Holiday
}

export interface ProvincesData {
  provinces: Province[]
}

export interface HolidayData {
  holidays: Holiday[]
}

const CACHE_DURATION = 1000 * 60 * 60 * 24 // 24 hours
const CACHE_KEY_PREFIX = "canadian_holidays_"

export function useCanadianHolidays(year: number, province: string = "ON") {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCacheKey = useCallback((year: number, province: string) => {
    return `${CACHE_KEY_PREFIX}${year}_${province}`
  }, [])

  const getCachedData = useCallback((cacheKey: string) => {
    if (typeof window === "undefined") return null
    
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data
        }
      }
    } catch (error) {
      console.warn("Failed to read cache:", error)
    }
    return null
  }, [])

  const setCachedData = useCallback((cacheKey: string, data: Holiday[]) => {
    if (typeof window === "undefined") return
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.warn("Failed to cache data:", error)
    }
  }, [])

  const fetchHolidays = useCallback(async (year: number, province: string) => {
    const cacheKey = getCacheKey(year, province)
    
    // Check cache first
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      setHolidays(cachedData)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch federal holidays for the specific year and all provinces data
      const [federalResponse, provincesResponse] = await Promise.all([
        fetch(`https://canada-holidays.ca/api/v1/holidays?year=${year}&federal=1`),
        fetch(`https://canada-holidays.ca/api/v1/provinces`)
      ])

      if (!federalResponse.ok || !provincesResponse.ok) {
        throw new Error("Failed to fetch holidays")
      }

      const [federalData, provincesData]: [HolidayData, ProvincesData] = await Promise.all([
        federalResponse.json(),
        provincesResponse.json()
      ])

      // Find the specific province
      const provinceData = provincesData.provinces.find(p => p.id === province)
      
      let allHolidays: Holiday[] = []

      // Add federal holidays for the year
      const federalHolidays = federalData.holidays.filter(holiday => {
        const holidayYear = new Date(holiday.date).getFullYear()
        return holidayYear === year
      })

      // Add provincial holidays for the year (if province found)
      let provincialHolidays: Holiday[] = []
      if (provinceData) {
        provincialHolidays = provinceData.holidays.filter(holiday => {
          const holidayYear = new Date(holiday.date).getFullYear()
          return holidayYear === year
        })
      }

      // Combine federal and provincial holidays
      allHolidays = [...federalHolidays, ...provincialHolidays]

      // Remove duplicates (holidays that appear in both federal and provincial lists)
      const uniqueHolidays = allHolidays.filter((holiday, index, self) => 
        index === self.findIndex(h => h.date === holiday.date && h.nameEn === holiday.nameEn)
      )

      // Sort by date
      uniqueHolidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setHolidays(uniqueHolidays)
      setCachedData(cacheKey, uniqueHolidays)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch holidays")
      console.error("Error fetching holidays:", err)
    } finally {
      setLoading(false)
    }
  }, [getCacheKey, getCachedData, setCachedData])

  useEffect(() => {
    fetchHolidays(year, province)
  }, [year, province, fetchHolidays])

  // Helper function to get holiday for a specific date
  const getHolidayForDate = useCallback((date: Date): Holiday | null => {
    const dateString = date.toISOString().split('T')[0]
    return holidays.find(holiday => 
      holiday.date === dateString || holiday.observedDate === dateString
    ) || null
  }, [holidays])

  // Helper function to check if a date is a holiday
  const isHoliday = useCallback((date: Date): boolean => {
    return getHolidayForDate(date) !== null
  }, [getHolidayForDate])

  return {
    holidays,
    loading,
    error,
    getHolidayForDate,
    isHoliday,
    refetch: () => fetchHolidays(year, province)
  }
} 