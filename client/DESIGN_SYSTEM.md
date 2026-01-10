# Design System Documentation

This document serves as the single source of truth for UI consistency across the PipelineHub CRM application. **Updated to reflect solid business CRM look** based on client feedback and reference designs.

## Quick Reference

### Primary Color - FROM REFERENCE DESIGN
- **Main Blue**: `#307fef` (primary / primary-600) - MAIN BRAND COLOR
- **Primary Hover**: `#2563eb` (primary-hover / primary-700)
- Use for: Primary buttons, links, active states, highlights

### Theme Support
- **Light Theme**: `#f7f6f8` background with white surfaces
- **Dark Theme**: `#191121` background with `#231b2e` surfaces
- All components MUST support both themes

### Spacing Scale
- `xs`: 8px
- `sm`: 12px  
- `md`: 16px (default)
- `lg`: 24px
- `xl`: 32px

### Border Radius - BUSINESS CRM STYLE
- `sm`: 6px (badges, tags)
- `DEFAULT`: 6-8px (buttons, inputs, cards - use `rounded-md`)
- `lg`: 8-10px (larger cards)
- `xl`: 12px (modals, drawers)
- Avoid `rounded-xl` or `rounded-2xl` for most UI elements

## Component Patterns - BUSINESS CRM STYLE

### Buttons

**Primary Button (Standardized - Use on Contacts, Pipeline, Opportunities pages)**
```tsx
<button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200">
  <span className="flex items-center gap-1.5">
    <span className="material-symbols-outlined text-[16px]">add</span>
    <span>Button Text</span>
  </span>
</button>
```

**Secondary Button (Standardized)**
```tsx
<button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-surface-dark border border-neutral-200 dark:border-[#302938] rounded-md hover:bg-neutral-50 dark:hover:bg-[#302938] hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200">
  Button Text
</button>
```

**Button Size Rules:**
- **Standard**: `px-4 py-2` with `text-sm` - Not too large, not too short
- **Icon size**: `text-[16px]` for button icons
- **Icon gap**: `gap-1.5` between icon and text
- **Required hover effects**: `hover:shadow-md active:scale-[0.98]` for primary, `hover:shadow-sm active:scale-[0.98]` for secondary

**Icon Button**
```tsx
<button className="size-8 flex items-center justify-center rounded-md bg-white dark:bg-surface-dark border border-neutral-200 dark:border-[#302938] text-text-muted dark:text-text-muted-dark hover:text-primary hover:bg-neutral-50 dark:hover:bg-[#302938] transition-colors">
  <span className="material-symbols-outlined text-[18px]">icon_name</span>
</button>
```

### Cards

**Standard Card (Business Style)**
```tsx
<div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-[#302938] p-4 transition-colors hover:shadow-md hover:bg-neutral-50 dark:hover:bg-surface-dark-alt">
  {/* Card content */}
</div>
```

**Kanban Card**
```tsx
<div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-neutral-200 dark:border-[#302938] p-4 cursor-grab transition-colors hover:shadow-md">
  {/* Card content */}
</div>
```

### Sidebar Navigation

**Nav Item (Tight, Business Style)**
```tsx
<NavLink
  className={({ isActive }) =>
    `flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'hover:bg-neutral-100 dark:hover:bg-[#302938] text-text-muted dark:text-text-muted-dark hover:text-text-main dark:hover:text-white'
    }`
  }
>
  <span className="material-symbols-outlined text-[18px]">{icon}</span>
  <span className="font-medium">{label}</span>
</NavLink>
```

### Input Fields

**Standard Input**
```tsx
<input 
  type="text"
  className="w-full px-4 py-2.5 border border-neutral-200 dark:border-[#302938] rounded-md bg-white dark:bg-surface-dark text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors duration-200"
/>
```

**Input with Icon**
```tsx
<div className="relative group">
  <input className="w-full px-4 py-2.5 pl-10 border border-neutral-200 dark:border-[#302938] rounded-md bg-white dark:bg-surface-dark text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-text-muted-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-colors duration-200" />
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary transition-colors">
    <span className="material-symbols-outlined text-[18px]">search</span>
  </span>
</div>
```

### Badges/Tags

**Default Badge**
```tsx
<span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
  Badge
</span>
```

**Status Badges**
- Success: `bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300`
- Warning: `bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300`
- Error: `bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300`
- Info: `bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300`

## Color Palette - FROM DESIGN FILES

### Primary Blue
- `primary`: `#307fef` ⭐ Main brand color
- `primary-hover`: `#2563eb`
- `primary-50`: `#eff6ff`
- `primary-100`: `#dbeafe`
- `primary-200`: `#bfdbfe`
- `primary-300`: `#93c5fd`
- `primary-400`: `#60a5fa`
- `primary-500`: `#3b82f6`
- `primary-600`: `#307fef`
- `primary-700`: `#2563eb`
- `primary-800`: `#1e40af`
- `primary-900`: `#1e3a8a`

### Background Colors - Blue-tinted Dark Theme
- `background-light`: `#f7f6f8`
- `background-dark`: `#0f172a` (slate-900 - dark blue-gray background)
- `surface-dark`: `#1e293b` (slate-800 - blue-gray surface)
- `surface-darker`: `#0f172a` (slate-900 - darker for sidebars)
- `surface-dark-alt`: `#1e293b` (slate-800 - alternate surface)

### Text Colors - Updated for Blue Theme

**CRITICAL: Client prefers dark gray/black over soft gray for better readability.**

- **Primary Text**: `text-gray-800 dark:text-gray-200` or `text-gray-900 dark:text-gray-100` - Use for main content, names, labels
- **Secondary Text**: `text-gray-700 dark:text-gray-300` - Use for descriptions, subtitles, table data
- **Icon Colors**: `text-gray-600 dark:text-gray-400` - Use for icons
- **Legacy (Avoid)**: 
  - ~~`text-text-muted`~~ - Too soft, hard to read
  - ~~`text-neutral-400`~~ - Too soft, hard to read
  - ~~`text-gray-400`~~ - Too soft, hard to read

**Always use dark gray/black for better readability:**
- Contact names, opportunity names: `text-gray-800 dark:text-gray-200 font-medium`
- Service types, descriptions: `text-gray-800 dark:text-gray-200 font-medium`
- Table headers: `text-gray-700 dark:text-gray-300`
- Subtitles: `text-gray-700 dark:text-gray-300`

### Border Colors
- Light: `#e5e7eb` (neutral-200)
- Dark: `#334155` (slate-700 - blue-gray border)

### Semantic Colors
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3b82f6`

## Typography - BUSINESS CRM STYLE

- **Display Font**: `Inter` - For headings, titles, brand text
- **Body Font**: `Inter` - For body text, descriptions
- **Icons**: `Material Symbols Outlined` - Google Material Icons
- Font Sizes: Use Tailwind defaults (text-xs, text-sm, text-base, text-lg, etc.)
- Font Weights: 
  - Normal: `font-normal` (400)
  - Medium: `font-medium` (500) - **Use for buttons**
  - Semibold: `font-semibold` (600)
  - Bold: `font-bold` (700) - For headings only

## Shadows - BUSINESS CRM STYLE

**Use Only These:**
- `shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.05)` - Default card shadow
- `shadow-md`: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` - Hover state
- `shadow-lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` - Modals/drawers only
- `shadow-xl`: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` - Large modals

**Deprecated (Do Not Use):**
- ~~`shadow-glow`~~ - Too artistic, use `shadow-sm` instead
- ~~`shadow-glow-hover`~~ - Too artistic, use `shadow-md` instead
- ~~`shadow-soft`~~ - Too artistic, use `shadow-sm` instead

## Transitions & Hover Effects - BUSINESS CRM STYLE

**Use Simple Transitions:**
- **Duration**: 200ms for colors
- **Type**: `transition-colors` for most elements (not `transition-all`)
- **Card Hover**: Simple shadow change (`hover:shadow-md`) and background color (`hover:bg-neutral-50`)
- **Button Hover**: Background color change only (`hover:bg-primary-hover`)
- **Button Active**: Darker background (`active:bg-primary-800`)

**Avoid:**
- ~~`hover:scale-[1.005]`~~ - No scale transforms
- ~~`hover:-translate-y-0.5`~~ - No translate transforms
- ~~`transition-all`~~ - Use `transition-colors` instead

## Business CRM Style Rules

1. ✅ **No Glow Effects** - Use `shadow-sm` and `shadow-md` only
2. ✅ **Button Hover Effects** - Required: `hover:shadow-md active:scale-[0.98]` for primary buttons
3. ✅ **Tighter Spacing** - Use `gap-2`, `px-2 py-1.5` for navigation
4. ✅ **Standardized Button Size** - `px-4 py-2` with `text-sm` for all primary/secondary buttons (not too large, not too short)
5. ✅ **Button Transitions** - Use `transition-all duration-200` for buttons (includes hover shadow and active scale)
6. ✅ **Clean Borders** - Always include `border border-neutral-200`
7. ✅ **Moderate Border Radius** - `rounded-md` (6-8px) for most elements
8. ✅ **Font Weight** - Use `font-medium` for buttons, not `font-bold`
9. ✅ **Icon Sizes** - Use `text-[18px]` for navigation icons, `text-[16px]` for button icons
10. ✅ **Text Colors** - Use dark gray/black (`text-gray-700`, `text-gray-800`, `text-gray-900`) instead of soft gray for better readability
11. ✅ Always include dark mode variants

## Examples

See `src/config/theme.ts` for common class patterns and `src/components/common/Button/` for example implementations.
