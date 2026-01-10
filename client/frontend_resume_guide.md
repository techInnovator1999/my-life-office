# Frontend Development Resume Guide

## 📋 Project Overview

**Project Name**: PipelineHub CRM  
**Tech Stack**: React 19.2.3, TypeScript, Vite 7.3.1, Tailwind CSS  
**Current Status**: Authentication pages completed, Dashboard and main app pending

---

## ✅ What's Been Completed

### 1. **Project Setup**
- ✅ React 19.2.3 with TypeScript
- ✅ Vite 7.3.1 configured
- ✅ Tailwind CSS with dark mode
- ✅ React Router DOM 6.20.0
- ✅ Path aliases configured (`@/` for `src/`)

### 2. **Design System**
- ✅ Complete color palette (Primary: `#7f19e6`)
- ✅ Typography (Space Grotesk + Noto Sans)
- ✅ Shadows, border radius, spacing system
- ✅ Theme system (light/dark)
- ✅ Design system documentation (`client/DESIGN_SYSTEM.md`)

### 3. **Components Created**
- ✅ `Button` component (primary, secondary, outline, ghost variants)
- ✅ `Input` component (with label, icon, error, required indicator)
- ✅ `PasswordStrength` component (with progress bar and feedback)

### 4. **Pages Created**
- ✅ **Login Page** (`/login`)
  - Email and password fields
  - Real-time validation
  - Required field indicators (*)
  - Disabled submit until valid
  - Remember me checkbox
  - Forgot password link

- ✅ **Signup Page** (`/signup`)
  - First Name and Last Name fields
  - Email field
  - Password and Confirm Password fields
  - Password strength indicator
  - Real-time validation
  - Terms checkbox
  - Required field indicators (*)

### 5. **Utilities**
- ✅ Validation utilities (`src/utils/validators.ts`)
- ✅ Theme utilities (`src/utils/theme.ts`)

### 6. **Routing**
- ✅ Basic routing setup
- ✅ `/login` → Login page
- ✅ `/signup` → Signup page
- ✅ `/` → Redirects to `/login`

---

## 🚧 What Needs to Be Done Next

### **Priority 1: Post-Login Flow**

#### 1. **Authentication Context/Store**
**Location**: `src/store/authContext.tsx`

**Requirements**:
- Store authentication state (user, token, isAuthenticated)
- Login function (store token, set user)
- Logout function (clear token, redirect)
- Check if user is authenticated
- Get current user

**Example Structure**:
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'AGENT'
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token and get user
      // fetchUser()
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Call API
    // Store token
    // Set user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

#### 2. **Protected Route Component**
**Location**: `src/routes/PrivateRoute.tsx`

**Requirements**:
- Check if user is authenticated
- Redirect to `/login` if not authenticated
- Show loading state while checking auth
- Render children if authenticated

**Example**:
```typescript
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/store/authContext'

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}
```

#### 3. **Main Layout Component**
**Location**: `src/components/layout/MainLayout/MainLayout.tsx`

**Requirements**:
- Header component (logo, user menu, notifications)
- Sidebar component (navigation menu)
- Main content area
- Footer (optional)
- Responsive (mobile sidebar toggle)

**Structure**:
```
MainLayout
  ├── Header
  │   ├── Logo
  │   ├── Search (optional)
  │   ├── Notifications
  │   └── User Menu
  ├── Sidebar
  │   ├── Navigation Links
  │   └── User Profile (bottom)
  └── Main Content
      └── {children}
```

**Example Implementation**:
```typescript
import { useState } from 'react'
import { Header } from '../Header/Header'
import { Sidebar } from '../Sidebar/Sidebar'

type MainLayoutProps = {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

#### 4. **Header Component**
**Location**: `src/components/layout/Header/Header.tsx`

**UI Requirements**:
- Logo on left (use logo-light.svg or logo-dark.svg based on theme)
- Search bar in center (optional)
- Notifications icon button
- User menu dropdown (avatar, name, logout)
- Mobile menu button (hamburger icon)
- Theme toggle button (light/dark)

**Design Pattern**:
```typescript
// Header should use:
className="h-16 bg-white dark:bg-surface-dark border-b border-neutral-200 dark:border-[#302938] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-50"
```

**Key Features**:
- Sticky header
- User dropdown menu
- Notification badge
- Responsive (mobile menu button)

#### 5. **Sidebar Component**
**Location**: `src/components/layout/Sidebar/Sidebar.tsx`

**UI Requirements**:
- Logo at top
- Navigation menu items:
  - Dashboard (icon: dashboard)
  - Leads/Contacts (icon: group)
  - Opportunities (icon: ads_click)
  - Users & Agents (icon: badge) - Admin only
  - Settings (icon: settings)
- Active state highlighting
- User profile section at bottom
- Collapsible on mobile
- Fixed width: `w-20 lg:w-72`

**Design Pattern** (from design files):
```typescript
// Sidebar container:
className="w-20 lg:w-72 flex-shrink-0 flex flex-col justify-between bg-surface-darker border-r border-[#302938] transition-all duration-300 z-20"

// Nav link active state:
className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-glow transition-all group"

// Nav link inactive:
className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#302938] text-[#ab9db8] hover:text-white transition-colors group"
```

**Navigation Items**:
```typescript
const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/contacts', label: 'Leads', icon: 'group' },
  { path: '/pipeline', label: 'Opportunities', icon: 'ads_click' },
  { path: '/admin/users', label: 'Users & Agents', icon: 'badge', adminOnly: true },
  { path: '/settings', label: 'Settings', icon: 'settings' },
]
```

#### 6. **Dashboard Page**
**Location**: `src/pages/dashboard/Dashboard.tsx`

**UI Requirements**:
- Stats cards grid (4 columns on desktop, 2 on tablet, 1 on mobile)
- Recent activity feed
- Quick actions section
- Charts/graphs (optional for MVP)

**Stats Cards Pattern**:
```typescript
// Stat Card:
<div className="bg-white dark:bg-surface-dark rounded-xl shadow-card border border-neutral-200 dark:border-[#302938]/50 p-6 transition-all hover:scale-[1.005] hover:shadow-lg">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark">Total Contacts</h3>
    <span className="material-symbols-outlined text-primary">group</span>
  </div>
  <p className="text-3xl font-bold text-text-main dark:text-white">1,234</p>
  <p className="text-sm text-green-600 dark:text-green-400 mt-2">+12.5% from last month</p>
</div>
```

**Layout Structure**:
```typescript
export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-main dark:text-white">Dashboard</h1>
        <p className="text-text-muted dark:text-text-muted-dark mt-1">Welcome back!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat cards */}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity feed */}
        {/* Quick actions */}
      </div>
    </div>
  )
}
```

#### 7. **Update Login Handler**
**Location**: `src/pages/auth/Login.tsx`

**Requirements**:
- Call authentication service/API
- Store token in localStorage
- Update auth context
- Redirect to `/dashboard` on success
- Show error messages on failure

**Example**:
```typescript
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/authContext'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // ... validation ...
  
  setIsLoading(true)
  try {
    await login(formData.email, formData.password)
    navigate('/dashboard')
  } catch (error) {
    setErrors({ 
      email: 'Invalid email or password',
      password: 'Invalid email or password'
    })
  } finally {
    setIsLoading(false)
  }
}
```

#### 8. **Update App.tsx Routing**
**Location**: `src/App.tsx`

**Requirements**:
- Wrap app with AuthProvider
- Add protected routes
- Wrap dashboard and other pages with PrivateRoute and MainLayout
- Keep login/signup public

**Example**:
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './store/authContext'
import { PrivateRoute } from './routes/PrivateRoute'
import { MainLayout } from './components/layout/MainLayout'
import { Login } from './pages/auth/Login'
import { Signup } from './pages/auth/Signup'
import { Dashboard } from './pages/dashboard/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/pipeline" element={
            <PrivateRoute>
              <MainLayout>
                <Pipeline />
              </MainLayout>
            </PrivateRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

---

## 🎨 UI Consistency Guidelines

### **CRITICAL: Follow These Rules**

#### 1. **Color System** (MUST USE EXACT VALUES)
```typescript
// Primary Color
primary: '#7f19e6'        // Main brand color
primary-hover: '#6814bd'  // Hover state

// Backgrounds
background-light: '#f7f6f8'
background-dark: '#191121'
surface-dark: '#231b2e'
surface-darker: '#130d1a'

// Text
text-main: '#141118'
text-muted: '#756388'
text-muted-dark: '#ab9db8'

// Borders
border-dark: '#302938'
```

#### 2. **Component Patterns**

**Buttons**:
```tsx
// Primary Button
className="px-6 py-3.5 bg-primary text-white rounded-lg font-bold shadow-glow hover:shadow-glow-hover hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"

// Secondary Button
className="px-4 py-2.5 bg-white dark:bg-surface-dark text-primary border border-neutral-200 dark:border-[#302938] rounded-lg hover:bg-neutral-50 dark:hover:bg-[#302938] transition-all duration-200 font-semibold"
```

**Cards**:
```tsx
className="bg-white dark:bg-surface-dark rounded-xl shadow-card border border-neutral-200 dark:border-[#302938]/50 p-6 transition-all hover:scale-[1.005] hover:shadow-lg"
```

**Inputs**:
```tsx
className="w-full px-4 py-3.5 border border-neutral-200 dark:border-[#302938] rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-text-muted-dark focus:border-primary focus:bg-white dark:focus:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all duration-200"
```

#### 3. **Required Patterns**
- ✅ **Dark mode support**: Always include `dark:` variants
- ✅ **Hover states**: All interactive elements must have hover effects
- ✅ **Focus states**: Visible focus rings (`focus:ring-4 focus:ring-primary/20`)
- ✅ **Transitions**: Use `transition-all duration-200`
- ✅ **Spacing**: Use Tailwind scale (gap-4, gap-6, p-4, p-6)
- ✅ **Border radius**: `rounded-lg` (8px) for most elements
- ✅ **Shadows**: Use `shadow-card`, `shadow-glow` from design system

#### 4. **Typography**
- **Display Font**: `font-display` (Space Grotesk) - for headings
- **Body Font**: `font-body` (Noto Sans) - for text
- **Icons**: Material Symbols Outlined

#### 5. **Spacing Scale**
- `xs`: 8px (gap-2)
- `sm`: 12px (gap-3)
- `md`: 16px (gap-4, p-4)
- `lg`: 24px (gap-6, p-6)
- `xl`: 32px (gap-8, p-8)

---

## 📁 File Structure Reference

```
client/
├── src/
│   ├── components/
│   │   ├── common/          # ✅ Button, Input, PasswordStrength
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── PasswordStrength/
│   │   │   ├── Card/        # ⚠️ Empty - needs implementation
│   │   │   ├── Modal/        # ⚠️ Empty - needs implementation
│   │   │   ├── Drawer/      # ⚠️ Empty - needs implementation
│   │   │   └── Dropdown/    # ⚠️ Empty - needs implementation
│   │   │
│   │   ├── layout/          # ⚠️ Empty - NEEDS IMPLEMENTATION
│   │   │   ├── Header/      # Create header component
│   │   │   ├── Sidebar/      # Create sidebar component
│   │   │   ├── Footer/      # Create footer component (optional)
│   │   │   └── MainLayout/  # Create main layout wrapper
│   │   │
│   │   └── features/        # Feature-specific components
│   │       ├── auth/
│   │       ├── contacts/
│   │       ├── pipeline/
│   │       └── opportunity/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx    # ✅ Completed
│   │   │   └── Signup.tsx   # ✅ Completed
│   │   │
│   │   ├── dashboard/       # ⚠️ Empty - NEEDS IMPLEMENTATION
│   │   │   └── Dashboard.tsx # Create dashboard page
│   │   │
│   │   ├── pipeline/        # ⚠️ Empty - needs implementation
│   │   ├── contacts/        # ⚠️ Empty - needs implementation
│   │   └── admin/           # ⚠️ Empty - needs implementation
│   │
│   ├── store/               # ⚠️ Empty - NEEDS IMPLEMENTATION
│   │   └── authContext.tsx  # Create auth context/store
│   │
│   ├── routes/              # ⚠️ Empty - NEEDS IMPLEMENTATION
│   │   └── PrivateRoute.tsx # Create protected route component
│   │
│   ├── services/            # ⚠️ Empty - needs implementation
│   │   └── authService.ts   # Create auth API service
│   │
│   ├── utils/
│   │   ├── validators.ts    # ✅ Completed
│   │   └── theme.ts         # ✅ Completed
│   │
│   ├── config/
│   │   └── theme.ts         # ✅ Completed
│   │
│   ├── styles/
│   │   ├── globals.css      # ✅ Completed
│   │   └── themes.css       # ✅ Completed
│   │
│   ├── App.tsx              # ⚠️ Needs update for protected routes
│   └── main.tsx             # ✅ Completed
│
├── public/                  # ⚠️ Empty - add favicon files here
│   └── favicon.ico          # Add favicon files
│
├── DESIGN_SYSTEM.md         # ✅ Complete design system docs
├── package.json             # ✅ Dependencies configured
└── tailwind.config.js       # ✅ Design system configured
```

---

## 🔑 Key Files to Reference

### **For UI Consistency**:
1. `client/DESIGN_SYSTEM.md` - Complete design system documentation
2. `.cursorrules` - Project rules and patterns (lines 1400-1473 for UI rules)
3. `client/src/components/common/Button/Button.tsx` - Button component example
4. `client/src/components/common/Input/Input.tsx` - Input component example
5. `client/src/pages/auth/Login.tsx` - Example page with validation
6. `client/tailwind.config.js` - Tailwind configuration with custom colors

### **For Patterns**:
1. `client/src/utils/validators.ts` - Validation utilities
2. `client/src/pages/auth/Signup.tsx` - Form validation example
3. `client/src/components/common/PasswordStrength/PasswordStrength.tsx` - Component example

---

## 📝 Implementation Checklist

### **Phase 1: Authentication Flow** (Priority)
- [ ] Create `src/store/authContext.tsx` (Context API)
- [ ] Create `src/services/authService.ts` (API calls - placeholder for now)
- [ ] Create `src/routes/PrivateRoute.tsx`
- [ ] Update `src/pages/auth/Login.tsx` to call auth context and redirect
- [ ] Update `src/App.tsx` with AuthProvider and protected routes

### **Phase 2: Main Layout** (Priority)
- [ ] Create `src/components/layout/MainLayout/MainLayout.tsx`
- [ ] Create `src/components/layout/Header/Header.tsx`
  - [ ] Logo (use logo files from assets/images)
  - [ ] User menu dropdown
  - [ ] Notifications icon
  - [ ] Theme toggle
  - [ ] Mobile menu button
- [ ] Create `src/components/layout/Sidebar/Sidebar.tsx`
  - [ ] Logo at top
  - [ ] Navigation menu items
  - [ ] Active state highlighting
  - [ ] User profile section at bottom
  - [ ] Mobile responsive (collapsible)
- [ ] Make responsive (mobile sidebar toggle)

### **Phase 3: Dashboard Page** (Priority)
- [ ] Create `src/pages/dashboard/Dashboard.tsx`
- [ ] Add stats cards (contacts, opportunities, revenue)
- [ ] Add recent activity section
- [ ] Add quick actions
- [ ] Wrap with MainLayout in App.tsx

### **Phase 4: Additional Pages** (Next)
- [ ] Pipeline/Kanban page
- [ ] Contacts page
- [ ] Admin page (if needed)

---

## 🚀 Quick Start Instructions

### **1. Start Development Server**
```bash
cd client
npm install  # If not already done
npm run dev
```

### **2. Build for Production**
```bash
cd client
npm run build
```

### **3. Check Design System**
- Read `client/DESIGN_SYSTEM.md` before creating any UI
- Reference `.cursorrules` for coding patterns
- Check existing components for patterns

---

## 💡 Important Notes

### **UI Consistency is CRITICAL**
- **ALWAYS** check `DESIGN_SYSTEM.md` before creating components
- **ALWAYS** use exact color values from design system
- **ALWAYS** include dark mode variants
- **ALWAYS** add hover and focus states
- **ALWAYS** use transitions

### **Code Quality**
- Follow `.cursorrules` patterns
- Keep components small and focused
- Use TypeScript strictly
- No `any` types
- Real-time validation (no HTML `required` attribute)

### **Authentication Flow**
- Store token in localStorage
- Check auth on app load
- Redirect to login if not authenticated
- Redirect to dashboard after login
- Clear token on logout

### **Component Structure**
```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/common/Button'

// 2. Types
type ComponentProps = {
  // props
}

// 3. Component
export function Component({ ...props }: ComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState()
  
  // 3b. Handlers
  const handleClick = () => {}
  
  // 3c. Render
  return <div>...</div>
}
```

### **Layout Structure**
- Use MainLayout wrapper for all authenticated pages
- Header: Fixed/sticky at top
- Sidebar: Fixed on left, collapsible on mobile
- Main content: Scrollable area
- Footer: Optional, at bottom

---

## 🎯 Next Steps Summary

1. **Create authentication context/store** → Store user state
2. **Create ProtectedRoute component** → Guard routes
3. **Create MainLayout** → Header + Sidebar wrapper
4. **Create Header component** → Logo, user menu, notifications
5. **Create Sidebar component** → Navigation menu
6. **Create Dashboard page** → Main landing page after login
7. **Update Login handler** → Redirect to dashboard
8. **Update App.tsx** → Add AuthProvider and protected routes

**Remember**: Always maintain UI consistency by following the design system!

---

## 📚 Resources

- **Design System**: `client/DESIGN_SYSTEM.md`
- **Project Rules**: `.cursorrules`
- **Tailwind Config**: `client/tailwind.config.js`
- **Example Components**: `client/src/components/common/`

---

**Last Updated**: Current session  
**Status**: Authentication pages complete, Dashboard and main app pending
