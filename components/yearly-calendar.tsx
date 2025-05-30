'use client'

import { Card } from '@/components/ui/card'
import { useCanadianHolidays } from './use-canadian-holidays'
import { HolidayTooltip } from './holiday-tooltip'
import { ProvinceSelector } from './province-selector'
import { useState } from 'react'

interface YearlyCalendarProps {
	year: number
}

export function YearlyCalendar({ year }: YearlyCalendarProps) {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]
	const [selectedProvince, setSelectedProvince] = useState('ON')
	const { holidays, getHolidayForDate, loading } = useCanadianHolidays(
		year,
		selectedProvince
	)

	const getDaysInMonth = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate()
	}

	const getFirstDayOfMonth = (year: number, month: number) => {
		return new Date(year, month, 1).getDay()
	}

	const handleMonthClick = (monthIndex: number) => {
		window.open(`/month/${monthIndex + 1}`, '_blank')
	}

	const getHolidayColor = (holiday: any) => {
		if (holiday.federal === 1) {
			return 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg shadow-red-500/40'
		}

		const isOptional =
			holiday.provinces &&
			holiday.provinces.some(
				(p: any) => p.nameEn && p.nameEn.includes('Optional')
			)
		if (isOptional) {
			return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/40'
		}

		return 'bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-lg shadow-green-500/40'
	}

	const renderMiniMonth = (monthIndex: number) => {
		const daysInMonth = getDaysInMonth(year, monthIndex)
		const firstDay = getFirstDayOfMonth(year, monthIndex)
		const today = new Date()
		const isCurrentMonth =
			today.getFullYear() === year && today.getMonth() === monthIndex
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
					className='w-6 h-6 flex items-center justify-center text-xs text-gray-300 dark:text-gray-600'
				>
					{day}
				</div>
			)
		}

		// Days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			const isToday = isCurrentMonth && day === currentDate
			const dayDate = new Date(year, monthIndex, day)
			const holiday = getHolidayForDate(dayDate)

			const dayElement = (
				<div
					key={day}
					className={`w-6 h-6 flex items-center justify-center text-xs transition-all duration-200 cursor-pointer ${
						isToday
							? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-lg shadow-purple-500/30 z-10'
							: holiday
							? `${getHolidayColor(
									holiday
							  )} rounded-full font-bold hover:scale-125 z-10`
							: 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 rounded hover:scale-110'
					}`}
				>
					{day}
				</div>
			)

			if (holiday) {
				days.push(
					<HolidayTooltip key={day} holiday={holiday} className='w-6 h-6'>
						{dayElement}
					</HolidayTooltip>
				)
			} else {
				days.push(dayElement)
			}
		}

		// Next month's leading days (greyed out) to fill the grid
		const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
		const remainingCells = totalCells - (firstDay + daysInMonth)

		for (let day = 1; day <= remainingCells; day++) {
			days.push(
				<div
					key={`next-${day}`}
					className='w-6 h-6 flex items-center justify-center text-xs text-gray-300 dark:text-gray-600'
				>
					{day}
				</div>
			)
		}

		return (
			<Card
				key={monthIndex}
				className='p-4 cursor-pointer hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-600 hover:scale-105 group relative overflow-visible'
				onClick={() => handleMonthClick(monthIndex)}
			>
				<div className='text-center mb-3'>
					<h3 className='font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300'>
						{months[monthIndex]}
					</h3>
					{loading && (
						<div className='text-xs text-gray-500 dark:text-gray-400'>
							Loading holidays...
						</div>
					)}
				</div>
				<div className='grid grid-cols-7 gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2'>
					<div className='text-center font-medium'>S</div>
					<div className='text-center font-medium'>M</div>
					<div className='text-center font-medium'>T</div>
					<div className='text-center font-medium'>W</div>
					<div className='text-center font-medium'>T</div>
					<div className='text-center font-medium'>F</div>
					<div className='text-center font-medium'>S</div>
				</div>
				<div className='grid grid-cols-7 gap-1 relative'>{days}</div>
			</Card>
		)
	}

	return (
		<div className='space-y-4'>
			{/* Consolidated Header with Year, Province Selector, and Legends */}
			<div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 rounded-lg'>
				{/* Left side: Year and subtitle */}
				<div className='flex-shrink-0'>
					<div className='relative'>
						<h1 className='text-3xl lg:text-4xl font-light bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent'>
							{year}
						</h1>
						<div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-indigo-600/20 blur-3xl -z-10'></div>
					</div>
				</div>

				{/* Center: Legend (vertical on mobile, horizontal on larger screens) */}
				<div className='flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-4'>
					<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 lg:mb-0'>
						Holidays:
					</h3>
					<div className='grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3'>
						<div className='flex items-center gap-1.5'>
							<div className='w-2.5 h-2.5 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex-shrink-0'></div>
							<span className='text-xs text-gray-700 dark:text-gray-300'>
								Federal
							</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<div className='w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex-shrink-0'></div>
							<span className='text-xs text-gray-700 dark:text-gray-300'>
								Statutory
							</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<div className='w-2.5 h-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex-shrink-0'></div>
							<span className='text-xs text-gray-700 dark:text-gray-300'>
								Optional
							</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<div className='w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex-shrink-0'></div>
							<span className='text-xs text-gray-700 dark:text-gray-300'>
								Today
							</span>
						</div>
					</div>
				</div>

				{/* Right side: Province Selector */}
				<div className='flex flex-col lg:flex-row items-start lg:items-center gap-2 flex-shrink-0'>
					<span className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
						Province:
					</span>
					<ProvinceSelector
						selectedProvince={selectedProvince}
						onProvinceChange={setSelectedProvince}
					/>
				</div>
			</div>

			{/* Calendar Grid */}
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6'>
				{Array.from({ length: 12 }, (_, i) => renderMiniMonth(i))}
			</div>
		</div>
	)
}
