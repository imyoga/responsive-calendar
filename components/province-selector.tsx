'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'

interface ProvinceSelectorProps {
	selectedProvince: string
	onProvinceChange: (province: string) => void
}

const provinces = [
	{ id: 'AB', name: 'Alberta' },
	{ id: 'BC', name: 'British Columbia' },
	{ id: 'MB', name: 'Manitoba' },
	{ id: 'NB', name: 'New Brunswick' },
	{ id: 'NL', name: 'Newfoundland and Labrador' },
	{ id: 'NS', name: 'Nova Scotia' },
	{ id: 'NT', name: 'Northwest Territories' },
	{ id: 'NU', name: 'Nunavut' },
	{ id: 'ON', name: 'Ontario' },
	{ id: 'PE', name: 'Prince Edward Island' },
	{ id: 'QC', name: 'Quebec' },
	{ id: 'SK', name: 'Saskatchewan' },
	{ id: 'YT', name: 'Yukon' },
]

export function ProvinceSelector({
	selectedProvince,
	onProvinceChange,
}: ProvinceSelectorProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [dropdownPosition, setDropdownPosition] = useState({
		top: 0,
		left: 0,
		width: 0,
	})
	const [mounted, setMounted] = useState(false)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const selectedProvinceName =
		provinces.find((p) => p.id === selectedProvince)?.name || 'Ontario'

	// Set mounted state to prevent SSR issues
	useEffect(() => {
		setMounted(true)
	}, [])

	// Memoized position calculation
	const calculatePosition = useCallback(() => {
		if (!buttonRef.current) return { top: 0, left: 0, width: 0 }

		const rect = buttonRef.current.getBoundingClientRect()
		return {
			top: rect.bottom + window.scrollY + 8,
			left: rect.left + window.scrollX,
			width: rect.width,
		}
	}, [])

	// Update dropdown position when opened or on resize
	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const position = calculatePosition()
			setDropdownPosition(position)
		}
	}, [isOpen, calculatePosition])

	// Handle window resize to update position
	useEffect(() => {
		if (!isOpen) return

		const handleResize = () => {
			if (buttonRef.current) {
				const position = calculatePosition()
				setDropdownPosition(position)
			}
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [isOpen, calculatePosition])

	// Close dropdown when clicking outside
	useEffect(() => {
		if (!isOpen) return

		function handleClickOutside(event: MouseEvent) {
			if (
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen])

	// Handle keyboard navigation
	useEffect(() => {
		if (!isOpen) return

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsOpen(false)
				buttonRef.current?.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen])

	// Close dropdown on scroll
	useEffect(() => {
		if (!isOpen) return

		function handleScroll(event: Event) {
			// Only close if the scroll is happening outside the dropdown
			if (dropdownRef.current && event.target instanceof Node) {
				if (
					dropdownRef.current.contains(event.target) ||
					dropdownRef.current === event.target
				) {
					// Scrolling inside the dropdown, don't close
					return
				}
			}
			// Scrolling outside the dropdown, close it
			setIsOpen(false)
		}

		window.addEventListener('scroll', handleScroll, true)
		return () => window.removeEventListener('scroll', handleScroll, true)
	}, [isOpen])

	const handleToggle = useCallback(() => {
		if (!isOpen && buttonRef.current) {
			// Pre-calculate position before opening to prevent flicker
			const position = calculatePosition()
			setDropdownPosition(position)
		}
		setIsOpen(!isOpen)
	}, [isOpen, calculatePosition])

	const handleProvinceSelect = useCallback(
		(provinceId: string) => {
			onProvinceChange(provinceId)
			setIsOpen(false)
		},
		[onProvinceChange]
	)

	// Don't render portal until component is mounted (prevents SSR issues)
	if (!mounted) {
		return (
			<Button
				ref={buttonRef}
				variant='outline'
				onClick={handleToggle}
				className='flex items-center gap-2 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300'
			>
				<span className='text-sm'>{selectedProvinceName}</span>
				<ChevronDown className='w-4 h-4 transition-transform' />
			</Button>
		)
	}

	const dropdown = isOpen
		? createPortal(
				<Card
					ref={dropdownRef}
					className='fixed w-auto min-w-[180px] max-w-[220px] max-h-64 overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 shadow-xl shadow-purple-500/20 animate-in fade-in-0 zoom-in-95 duration-200 ease-out'
					style={{
						top: dropdownPosition.top,
						left: dropdownPosition.left,
						zIndex: 9999,
						opacity: dropdownPosition.top > 0 ? 1 : 0, // Prevent flash
						transform: dropdownPosition.top > 0 ? 'scale(1)' : 'scale(0.95)',
						transformOrigin: 'top left',
					}}
					onMouseDown={(e) => e.preventDefault()}
				>
					<div className='p-2'>
						{provinces.map((province) => (
							<button
								key={province.id}
								onClick={() => handleProvinceSelect(province.id)}
								onMouseDown={(e) => e.preventDefault()}
								className={`w-full text-left px-3 py-2 text-sm rounded transition-all duration-150 ${
									selectedProvince === province.id
										? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
										: 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 text-gray-700 dark:text-gray-200'
								}`}
								title={province.name} // Show full name on hover
							>
								<span className='block truncate'>{province.name}</span>
							</button>
						))}
					</div>
				</Card>,
				document.body
		  )
		: null

	return (
		<>
			<Button
				ref={buttonRef}
				variant='outline'
				onClick={handleToggle}
				className='flex items-center gap-2 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300'
			>
				<span className='text-sm'>{selectedProvinceName}</span>
				<ChevronDown
					className={`w-4 h-4 transition-transform duration-200 ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</Button>
			{dropdown}
		</>
	)
}
