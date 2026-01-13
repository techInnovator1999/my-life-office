import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/store/authContext'
import { toggleTheme, getInitialTheme } from '@/utils/theme'
import { useNavigate } from 'react-router-dom'

type HeaderProps = {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme() === 'dark')
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleThemeToggle = () => {
    const newTheme = toggleTheme()
    setIsDarkMode(newTheme === 'dark')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userInitials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'U'

  return (
    <header className="h-16 bg-white dark:bg-surface-dark border-b border-neutral-200 dark:border-slate-700 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Left Section: Mobile Menu Button */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden size-9 flex items-center justify-center rounded-md bg-white dark:bg-surface-dark border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-text-muted-dark hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
      </div>

      {/* Center Section: Search Bar (optional - hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <input
            type="search"
            placeholder="Search..."
            className="w-full px-4 py-2.5 pl-10 border border-neutral-200 dark:border-slate-700 rounded-md bg-white dark:bg-surface-dark text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors duration-200"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </span>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className="size-9 flex items-center justify-center rounded-md bg-white dark:bg-surface-dark border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-text-muted-dark hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative size-10 flex items-center justify-center rounded-md bg-white dark:bg-surface-dark border border-neutral-200 dark:border-slate-700 text-neutral-600 dark:text-text-muted-dark hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-surface-dark rounded-lg shadow-md border border-neutral-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-4 border-b border-neutral-200 dark:border-slate-700">
                <h3 className="font-semibold text-text-main dark:text-white">Notifications</h3>
              </div>
              <div className="p-4 text-center text-sm text-text-muted dark:text-text-muted-dark">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors"
          >
            {/* Avatar */}
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
              {userInitials}
            </div>
            {/* User Name - Hidden on mobile */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-text-main dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <span className="material-symbols-outlined text-[20px] text-text-muted dark:text-text-muted-dark">
              expand_more
            </span>
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-dark rounded-lg shadow-md border border-neutral-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-2">
                <div className="px-3 py-2 border-b border-neutral-200 dark:border-slate-700 mb-2">
                  <p className="text-sm font-semibold text-text-main dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 dark:hover:bg-slate-700 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[20px] text-text-muted dark:text-text-muted-dark">
                    settings
                  </span>
                  <span className="text-sm text-text-main dark:text-white">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[20px] text-red-500">logout</span>
                  <span className="text-sm text-red-600 dark:text-red-400">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

