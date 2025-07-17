import { YearlyCalendar } from '@/components/yearly-calendar'
import { ThemeToggle } from '@/components/theme-toggle'

interface YearPageProps {
	params: Promise<{ year: string }>
}

export default async function YearPage({ params }: YearPageProps) {
	const { year } = await params
	const yearNumber = Number.parseInt(year)

	if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > 2100) {
		return <div>Invalid year</div>
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-indigo-200 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 transition-colors duration-300 relative p-4'>
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzM0ZWEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoLTZ2LTZoNnptLTYtMTJ2Nmg2di02aC02em0xMiA2djZoNnYtNmgtNnptLTYgMTJ2Nmg2di02aC02em0tMTIgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-70 dark:opacity-20 pointer-events-none"></div>
			<div className='absolute top-4 right-4 z-10'>
				<ThemeToggle />
			</div>
			<div className='max-w-[95vw] 2xl:max-w-[90vw] mx-auto'>
				<YearlyCalendar year={yearNumber} />
			</div>
		</div>
	)
}
