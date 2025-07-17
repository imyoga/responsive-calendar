'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
	const router = useRouter()

	useEffect(() => {
		const currentYear = new Date().getFullYear()
		router.replace(`/${currentYear}`)
	}, [router])

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-indigo-200 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 transition-colors duration-300 relative p-4 flex items-center justify-center'>
			<div className='text-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto'></div>
				<p className='mt-4 text-gray-600 dark:text-gray-400'>Loading...</p>
			</div>
		</div>
	)
}
