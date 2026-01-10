import { NavLink } from 'react-router-dom'
import { useAuth } from '@/store/authContext'
import { getInitialTheme } from '@/utils/theme'
import { useState, useEffect } from 'react'
import logoMain from '@/assets/images/logo-main.png'
import logoMainLight from '@/assets/images/logo-main-light.png'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

type NavItem = {
  path?: string
  label: string
  icon: string
  adminOnly?: boolean
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/contacts', label: 'Contacts', icon: 'group' },
  { path: '/pipeline', label: 'Pipeline', icon: 'ads_click' },
  {
    label: 'Opportunities',
    icon: 'chat_bubble',
    children: [
      { path: '/opportunities/individuals', label: 'Individuals', icon: 'group' },
      { path: '/opportunities/businesses', label: 'Businesses', icon: 'chat_bubble' },
      { path: '/opportunities/employees', label: 'Employees', icon: 'campaign' },
    ],
  },
  { path: '/admin/users', label: 'Users & Agents', icon: 'badge', adminOnly: true },
  { path: '/settings', label: 'Settings', icon: 'settings' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme() === 'dark')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    // Check on mount
    checkTheme()
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    
    return () => observer.disconnect()
  }, [])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(label)) {
        newSet.delete(label)
      } else {
        newSet.add(label)
      }
      return newSet
    })
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (item.adminOnly && user?.role !== 'ADMIN') {
      return false
    }
    return true
  })

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-10 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          w-20 lg:w-64 flex-shrink-0 flex flex-col justify-between
          bg-white dark:bg-surface-darker border-r border-neutral-200 dark:border-slate-700 
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Section: Logo */}
        <div className="px-3 py-4 border-b border-neutral-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <img
              src={isDarkMode ? logoMainLight : logoMain}
              alt="CRM Nexus"
              className="h-7 w-auto"
            />
          </div>
        </div>

        {/* Middle Section: Navigation */}
        <nav className="flex-1 overflow-y-auto auto-scrollbar px-2 py-3 space-y-1">
          {filteredNavItems.map((item) => {
            const isExpanded = expandedItems.has(item.label)
            const hasChildren = item.children && item.children.length > 0

            if (hasChildren) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md transition-colors ${
                      isExpanded
                        ? 'bg-primary text-white shadow-sm'
                        : 'hover:bg-neutral-100 dark:hover:bg-slate-700 text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span className="hidden lg:block font-medium text-sm">{item.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] hidden lg:block">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children?.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path!}
                          onClick={() => {
                            if (window.innerWidth < 1024) {
                              onClose()
                            }
                          }}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                              isActive
                                ? 'bg-primary/20 text-primary border-l-2 border-primary'
                                : 'hover:bg-neutral-100 dark:hover:bg-slate-700 text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white'
                            }`
                          }
                        >
                          <span className="material-symbols-outlined text-[16px]">{child.icon}</span>
                          <span className="hidden lg:block font-medium text-sm">{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <NavLink
                key={item.path}
                to={item.path!}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'hover:bg-neutral-100 dark:hover:bg-slate-700 text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="hidden lg:block font-medium text-sm">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom Section: User Profile */}
        <div className="px-2 py-3 border-t border-neutral-200 dark:border-slate-700">
          <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-neutral-100 dark:bg-slate-700/50">
            {/* Avatar */}
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-xs flex-shrink-0">
              {user
                ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                : 'U'}
            </div>
            {/* User Info - Hidden on mobile */}
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="text-xs font-medium text-text-main dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark truncate">{user?.email}</p>
              <span className="inline-block mt-0.5 px-1.5 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/20">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

