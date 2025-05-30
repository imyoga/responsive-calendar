'use client'

import { useState, useRef, useEffect } from 'react'
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
	const buttonRef = useRef<HTMLButtonElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const selectedProvinceName =
		provinces.find((p) => p.id === selectedProvince)?.name || 'Ontario'

	// Update dropdown position when opened
	useEffect(() => {
		if (isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			setDropdownPosition({
				top: rect.bottom + window.scrollY + 8,
				left: rect.left + window.scrollX,
				width: rect.width,
			})
		}
	}, [isOpen])

	// Close dropdown when clicking outside
	useEffect(() => {
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
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// Handle keyboard navigation
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setIsOpen(false)
				buttonRef.current?.focus()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
			return () => {
				document.removeEventListener('keydown', handleKeyDown)
			}
		}
	}, [isOpen])

	// Close dropdown on scroll
	useEffect(() => {
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

		if (isOpen) {
			window.addEventListener('scroll', handleScroll, true)
			return () => {
				window.removeEventListener('scroll', handleScroll, true)
			}
		}
	}, [isOpen])

	const dropdown = isOpen
		? createPortal(
				<Card
					ref={dropdownRef}
					className='fixed min-w-[200px] max-h-64 overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 shadow-xl shadow-purple-500/20'
					style={{
						top: dropdownPosition.top,
						left: dropdownPosition.left,
						minWidth: Math.max(dropdownPosition.width, 200),
						zIndex: 9999,
					}}
					onMouseDown={(e) => e.preventDefault()}
				>
					<div className='p-2'>
						{provinces.map((province) => (
							<button
								key={province.id}
								onClick={() => {
									onProvinceChange(province.id)
									setIsOpen(false)
								}}
								onMouseDown={(e) => e.preventDefault()}
								className={`w-full text-left px-3 py-2 text-sm rounded transition-all duration-200 ${
									selectedProvince === province.id
										? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
										: 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 text-gray-700 dark:text-gray-200'
								}`}
							>
								{province.name}
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
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-300/70 dark:border-purple-700/50 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 transition-all duration-300'
			>
				<span className='text-sm'>{selectedProvinceName}</span>
				<ChevronDown
					className={`w-4 h-4 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</Button>
			{dropdown}
		</>
	)
}
