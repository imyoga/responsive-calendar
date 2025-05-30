'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCanadianHolidays } from './use-canadian-holidays'
import { HolidayTooltip } from './holiday-tooltip'
import { ProvinceSelector } from './province-selector'

interface MonthlyCalendarProps {
	year: number
	month: number
}

export function MonthlyCalendar({
	year: initialYear,
	month: initialMonth,
}: MonthlyCalendarProps) {
	const [currentYear, setCurrentYear] = useState(initialYear)
	const [currentMonth, setCurrentMonth] = useState(initialMonth)
	const [selectedProvince, setSelectedProvince] = useState('ON')
	const { holidays, getHolidayForDate, loading } = useCanadianHolidays(
		currentYear,
		selectedProvince
	)

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
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const dayNames = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	]

	const getDaysInMonth = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate()
	}

	const getFirstDayOfMonth = (year: number, month: number) => {
		return new Date(year, month, 1).getDay()
	}

	const navigateMonth = (direction: 'prev' | 'next') => {
		if (direction === 'prev') {
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

	const getHolidayColor = (holiday: any) => {
		if (holiday.federal === 1) {
			return 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 border-red-300 dark:border-red-700'
		}

		const isOptional =
			holiday.provinces &&
			holiday.provinces.some(
				(p: any) => p.nameEn && p.nameEn.includes('Optional')
			)
		if (isOptional) {
			return 'bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-900/30 dark:to-orange-800/30 border-yellow-300 dark:border-yellow-700'
		}

		return 'bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30 border-green-300 dark:border-green-700'
	}

	const getHolidayTextColor = (holiday: any) => {
		if (holiday.federal === 1) {
			return 'text-red-800 dark:text-red-200'
		}

		const isOptional =
			holiday.provinces &&
			holiday.provinces.some(
				(p: any) => p.nameEn && p.nameEn.includes('Optional')
			)
		if (isOptional) {
			return 'text-yellow-800 dark:text-yellow-200'
		}

		return 'text-green-800 dark:text-green-200'
	}

	const renderCalendar = () => {
		const daysInMonth = getDaysInMonth(currentYear, currentMonth)
		const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
		const today = new Date()
		const isCurrentMonth =
			today.getFullYear() === currentYear && today.getMonth() === currentMonth
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
					className='h-24 border border-purple-100 dark:border-purple-800/30 p-2 bg-purple-50/30 dark:bg-purple-900/10'
				>
					<div className='text-sm font-medium text-gray-300 dark:text-gray-600'>
						{day}
					</div>
				</div>
			)
		}

		// Current month days
		for (let day = 1; day <= daysInMonth; day++) {
			const isToday = isCurrentMonth && day === currentDate
			const dayDate = new Date(currentYear, currentMonth, day)
			const holiday = getHolidayForDate(dayDate)

			const baseClasses = 'h-24 border p-2 transition-all duration-200'
			let dayClasses = ''
			let borderClasses = ''

			if (isToday) {
				dayClasses =
					'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
				borderClasses = 'border-purple-300 dark:border-purple-700'
			} else if (holiday) {
				dayClasses = getHolidayColor(holiday)
				borderClasses = ''
			} else {
				dayClasses =
					'bg-white/80 dark:bg-gray-800/80 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 hover:scale-105'
				borderClasses = 'border-purple-100 dark:border-purple-800/30'
			}

			const dayElement = (
				<div
					key={day}
					className={`${baseClasses} ${dayClasses} ${borderClasses}`}
				>
					<div
						className={`text-sm font-medium ${
							isToday
								? 'text-white'
								: holiday
								? getHolidayTextColor(holiday)
								: 'text-gray-900 dark:text-gray-100'
						}`}
					>
						{day}
					</div>

					{holiday && (
						<div className='mt-1'>
							<div
								className={`text-xs font-medium ${getHolidayTextColor(
									holiday
								)} truncate`}
							>
								{holiday.nameEn}
							</div>
							<div className='flex items-center gap-1 mt-1'>
								{holiday.federal === 1 && (
									<span className='px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full font-bold'>
										F
									</span>
								)}
								{holiday.provinces &&
									holiday.provinces.some(
										(p: any) => p.nameEn && p.nameEn.includes('Optional')
									) && (
										<span className='px-1.5 py-0.5 bg-yellow-600 text-white text-xs rounded-full font-bold'>
											O
										</span>
									)}
								{!holiday.federal &&
									!(
										holiday.provinces &&
										holiday.provinces.some(
											(p: any) => p.nameEn && p.nameEn.includes('Optional')
										)
									) && (
										<span className='px-1.5 py-0.5 bg-green-600 text-white text-xs rounded-full font-bold'>
											S
										</span>
									)}
							</div>
						</div>
					)}
				</div>
			)

			// If holiday name is long, wrap in tooltip for additional details
			if (holiday && holiday.nameEn.length > 15) {
				days.push(
					<HolidayTooltip key={day} holiday={holiday}>
						{dayElement}
					</HolidayTooltip>
				)
			} else {
				days.push(dayElement)
			}
		}

		// Next month's leading days (greyed out) to complete the grid
		const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
		const remainingCells = totalCells - (firstDay + daysInMonth)

		for (let day = 1; day <= remainingCells; day++) {
			days.push(
				<div
					key={`next-${day}`}
					className='h-24 border border-purple-100 dark:border-purple-800/30 p-2 bg-purple-50/30 dark:bg-purple-900/10'
				>
					<div className='text-sm font-medium text-gray-300 dark:text-gray-600'>
						{day}
					</div>
				</div>
			)
		}

		return days
	}

	return (
		<Card className='p-2 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 shadow-xl shadow-purple-500/20'>
			{/* Consolidated Header */}
			<div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200/50 dark:border-purple-700/30'>
				{/* Left: Navigation */}
				<div className='flex items-center gap-3 flex-shrink-0'>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => navigateMonth('prev')}
						className='flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300'
					>
						<ChevronLeft className='w-4 h-4' />
						Prev
					</Button>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => navigateMonth('next')}
						className='flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300'
					>
						Next
						<ChevronRight className='w-4 h-4' />
					</Button>
					{loading && (
						<div className='text-xs text-gray-500 dark:text-gray-400 ml-3'>
							Loading holidays...
						</div>
					)}
				</div>

				{/* Center: Legend */}
				<div className='flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-6'>
					<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 lg:mb-0'>
						Holidays:
					</h3>
					<div className='flex flex-wrap items-center gap-3 lg:gap-4'>
						<div className='flex items-center gap-2'>
							<span className='px-1.5 py-0.5 bg-red-600 text-white text-xs rounded-full font-bold'>
								F
							</span>
							<span className='text-xs text-gray-700 dark:text-gray-300'>
								Federal
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<span className='px-1.5 py-0.5 bg-green-600 text-white text-xs rounded-full font-bold'>
								S
							</span>
							<span className='text-xs text-gray-700 dark:text-gray-300'>
								Statutory
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<span className='px-1.5 py-0.5 bg-yellow-600 text-white text-xs rounded-full font-bold'>
								O
							</span>
							<span className='text-xs text-gray-700 dark:text-gray-300'>
								Optional
							</span>
						</div>
					</div>
				</div>

				{/* Right: Province Selector */}
				<div className='flex flex-col lg:flex-row items-start lg:items-center gap-3 flex-shrink-0'>
					<span className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
						Province:
					</span>
					<ProvinceSelector
						selectedProvince={selectedProvince}
						onProvinceChange={setSelectedProvince}
					/>
				</div>
			</div>

			<div className='grid grid-cols-7 gap-0 mb-2'>
				{dayNames.map((day) => (
					<div
						key={day}
						className='p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-300 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/30'
					>
						{day}
					</div>
				))}
			</div>

			<div className='grid grid-cols-7 gap-0 border border-purple-200/50 dark:border-purple-700/30 rounded-lg overflow-hidden'>
				{renderCalendar()}
			</div>
		</Card>
	)
}
