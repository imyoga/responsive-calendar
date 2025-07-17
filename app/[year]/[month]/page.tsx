import { MonthlyCalendar } from '@/components/monthly-calendar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface MonthPageProps {
	params: Promise<{ year: string; month: string }>
}

export default async function MonthPage({ params }: MonthPageProps) {
	const { year, month } = await params
	const yearNumber = Number.parseInt(year)
	const monthIndex = Number.parseInt(month) - 1

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

	if (
		isNaN(yearNumber) ||
		yearNumber < 1900 ||
		yearNumber > 2100 ||
		monthIndex < 0 ||
		monthIndex > 11
	) {
		return <div>Invalid year or month</div>
	}

	const isCurrentMonth = () => {
		const today = new Date()
		return yearNumber === today.getFullYear() && monthIndex === today.getMonth()
	}

	const currentYear = new Date().getFullYear()

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-indigo-200 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 transition-colors duration-300 relative'>
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzM0ZWEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtMTJ2Nmg2di02aC02em0xMiA2djZoNnYtNmgtNnptLTYgMTJ2Nmg2di02aC02em0tMTIgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-70 dark:opacity-20 pointer-events-none"></div>
			<div className='absolute top-4 right-4 z-10'>
				<ThemeToggle />
			</div>
			<div className='max-w-4xl mx-auto p-4 pt-4'>
				<header className='flex items-center justify-between mb-4'>
					<Link href={`/${yearNumber}`}>
						<Button
							variant='ghost'
							className='flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors'
						>
							<ArrowLeft className='w-4 h-4' />
							Back to Year View
						</Button>
					</Link>
					<div className='flex items-center gap-4'>
						<h1 className='text-3xl font-light bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 bg-clip-text text-transparent'>
							{monthNames[monthIndex]} {yearNumber}
						</h1>
						{!isCurrentMonth() && (
							<Link href={`/${currentYear}/${new Date().getMonth() + 1}`}>
								<Button
									variant='outline'
									size='sm'
									className='h-8 px-3 text-sm bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300'
								>
									Today
								</Button>
							</Link>
						)}
					</div>
				</header>
				<MonthlyCalendar year={yearNumber} month={monthIndex} />
			</div>
		</div>
	)
}
