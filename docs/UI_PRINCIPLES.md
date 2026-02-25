# CSPS UI Principles

> Design system and UI guidelines for the CSPS Frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [Interactions & Animation](#interactions--animation)
8. [Responsiveness](#responsiveness)
9. [Accessibility](#accessibility)
10. [Code Organization](#code-organization)

---

## Overview

The CSPS frontend uses a modern, dark-themed UI with a gradient backdrop, purple accent colors, and Tailwind CSS for styling. The design focuses on clarity, accessibility, and smooth interactions across all device sizes.

| Property | Value |
|----------|-------|
| **CSS Framework** | Tailwind CSS v4 |
| **Primary Font** | Poppins (Google Fonts) |
| **Color Scheme** | Dark theme with purple accents |
| **Breakpoints** | Mobile-first responsive design |

---

## Design Philosophy

### Core Principles

1. **Dark Theme First** - All UIs default to dark backgrounds (`zinc-900`, `zinc-950`, `slate-900`)
2. **Purple Accent** - Primary actions and highlights use purple (`purple-500`, `purple-600`)
3. **Minimal & Focused** - Remove unnecessary elements; emphasize content
4. **Smooth Interactions** - Transitions and animations enhance, not distract
5. **Accessibility Ready** - Proper contrast ratios and semantic HTML
6. **Mobile-Responsive** - Design scales gracefully from mobile to desktop

---

## Color Palette

### Background Colors

| Color | Usage | Tailwind Class |
|-------|-------|-----------------|
| **Zinc 950** | Primary page background | `bg-zinc-950` |
| **Zinc 900** | Card backgrounds, modals | `bg-zinc-900` |
| **Zinc 800** | Hover states, input fields | `bg-zinc-800` |
| **Zinc 700** | Border colors | `border-zinc-700` |
| **Slate 900** | Alternative dark background | `bg-slate-900` |

### Gradient Backgrounds

```css
/* Main page gradient (Light to Dark) */
bg-gradient-to-b from-[rgb(65,22,156)] via-[#20113F] to-black

/* Subtle accent gradients */
bg-gradient-to-r from-transparent via-purple-500/30 to-transparent
bg-gradient-to-br from-purple-600 to-indigo-700
```

### Text Colors

| Color | Usage | Tailwind Class |
|-------|-------|-----------------|
| **White** | Primary text, headings | `text-white` |
| **Zinc 200** | Secondary text | `text-zinc-200` |
| **Zinc 500** | Labels, captions | `text-zinc-500` |
| **Zinc 600** | Disabled/muted text | `text-zinc-600` |
| **Gray 400** | Placeholder text | `placeholder-gray-600` |

### Accent Colors

| Color | Usage | Tailwind Class |
|-------|-------|-----------------|
| **Purple 600** | Primary buttons | `bg-purple-600 hover:bg-purple-500` |
| **Purple 500** | Hover states | `text-purple-500` |
| **Purple 400** | Icons, highlights | `text-purple-400` |
| **Red 400** | Error/alert text | `text-red-400` |
| **Red 500** | Error backgrounds | `bg-red-500/10` |

### Transparency & Opacity

- **Borders**: `border-white/5`, `border-white/10`, `border-zinc-800`
- **Backgrounds**: `bg-black/50`, `bg-white/5`, `bg-purple-500/10`
- **Overlays**: `backdrop-blur-sm`, `backdrop-blur-lg`

---

## Typography

### Font Configuration

```typescript
// src/index.css
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}
```

### Font Sizes & Weights

| Use Case | Size | Weight | Tailwind Class |
|----------|------|--------|-----------------|
| **Page Heading** | 32px | 600-700 | `text-2xl font-bold` |
| **Section Title** | 20px | 600 | `text-lg font-semibold` |
| **Card Header** | 16px | 500 | `text-base font-medium` |
| **Body Text** | 14px | 400 | `text-sm` |
| **Small Text** | 12px | 400 | `text-xs` |
| **Label Text** | 12px | 500 | `text-xs font-medium tracking-wide uppercase` |

### Text Styling Patterns

```typescript
// Main Heading
className="text-2xl font-bold text-white"

// Section Label (Small caps)
className="text-xs font-semibold text-zinc-500 tracking-widest uppercase"

// Body Copy
className="text-sm text-zinc-200 font-medium"

// Disabled/Muted
className="text-xs text-zinc-600"

// Interactive
className="text-sm font-medium text-purple-400 hover:text-purple-300"
```

---

## Spacing & Layout

### Padding & Margins

| Purpose | Values | Examples |
|---------|--------|----------|
| **Page Padding** | 6 (24px), 10 (40px) | `p-6`, `px-6 py-10` |
| **Card Padding** | 4 (16px), 5 (20px), 8 (32px) | `p-5`, `p-8` |
| **Component Gap** | 2-6 (8-24px) | `gap-3`, `gap-4`, `gap-5` |
| **Section Margin** | 8-12 (32-48px) | `mb-8`, `mt-12` |

### Grid & Flex Layouts

```typescript
// Two-column responsive layout (desktop: 2 cols, mobile: 1 col)
className="grid grid-cols-1 lg:grid-cols-2 gap-8"

// Horizontal flex with centering
className="flex items-center justify-between gap-4"

// Vertical flex spacing
className="flex flex-col gap-3"

// Space-around distribution
className="flex items-center justify-around"
```

### Container Constraints

```typescript
// Max width container
className="max-w-4xl mx-auto"

// Full width constrained
className="w-full max-w-[90rem]"

// Modal width
className="max-w-md w-full mx-4"
```

---

## Components

### Cards & Containers

All cards follow this pattern: dark background, subtle border, rounded corners.

```typescript
// Standard Card
<div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
  {children}
</div>

// Card with Padding
<div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 p-5">
  {children}
</div>

// Card with Hover Effect
<div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 hover:border-purple-500/50 transition-colors">
  {children}
</div>
```

### Buttons

#### Primary Button (Call-to-Action)

```typescript
className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
```

**States:**
- Default: `bg-purple-600`
- Hover: `bg-purple-500`
- Active: `bg-purple-700`
- Disabled: `opacity-50 cursor-not-allowed`

#### Secondary Button

```typescript
className="border border-zinc-700 text-zinc-400 hover:text-zinc-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
```

#### Destructive Button

```typescript
className="border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 px-3 py-1 rounded-full text-xs font-medium transition-all"
```

### Input Fields

```typescript
// Text Input
<input
  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
  placeholder="Enter text..."
/>

// Date Input
<input
  type="date"
  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 px-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
/>

// Select Dropdown
<select
  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 px-3 py-1.5 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none"
>
  <option>Option 1</option>
</select>
```

**Input Focus States:**
- Border: `border-purple-500` (changes from `border-zinc-700`)
- Ring: Optional `focus:ring-1 focus:ring-purple-500/30`

### Modals & Overlays

```typescript
// Modal Backdrop
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
  {/* Modal Content */}
</div>

// Modal Card
<div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-8 max-w-md w-full mx-4">
  {children}
</div>
```

### Icons (Inline SVG)

Prefer inline SVG icons instead of external icon libraries. Standard stroke patterns:

```typescript
// Standard Icon
<svg
  fill="none"
  stroke="currentColor"
  strokeWidth={1.75}
  strokeLinecap="round"
  strokeLinejoin="round"
  viewBox="0 0 24 24"
  className="w-4 h-4 text-zinc-400"
>
  {/* paths */}
</svg>

// Larger Icon (e.g., 8x8)
className="w-8 h-8 text-purple-400"

// In hover states
className="group-hover:text-purple-400 transition-colors"
```

---

## Interactions & Animation

### Transitions

All interactive elements use smooth transitions:

```typescript
// Color transitions (default 200ms)
className="transition-colors"

// All properties (borders, shadows, etc.)
className="transition-all"

// Specific durations
className="transition-all duration-300"
className="transition-opacity duration-200"
```

### Hover States

```typescript
// Button hover
className="hover:bg-purple-500"

// Border hover
className="hover:border-purple-500/50"

// Text hover
className="hover:text-zinc-200"

// Combined
className="hover:bg-zinc-800 hover:border-purple-500 transition-all"
```

### Focus States

```typescript
// Input focus
className="focus:outline-none focus:border-purple-500"

// Ring focus
className="focus:outline-none focus:ring-2 focus:ring-purple-500/30"
```

### Animation with Framer Motion

```typescript
// Fade in
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

// Slide in
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
/>

// Scale animation
<motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} />
```

### Opacity Patterns

```typescript
// Modal dismiss animation
{isClosing ? "opacity-0" : "opacity-100"}

// Fade out
className="opacity-50 hover:opacity-100"

// Subtle indicators
className="bg-purple-500/10 border border-purple-500/20"
```

---

## Responsiveness

### Breakpoints (Tailwind Default)

| Breakpoint | Min Width | Usage |
|-----------|-----------|-------|
| **sm** | 640px | Larger phones, tablets |
| **md** | 768px | Tablets, small desktops |
| **lg** | 1024px | Desktops |
| **xl** | 1280px | Large desktops |

### Mobile-First Pattern

Always design mobile-first, then add breakpoint overrides:

```typescript
// Mobile: 1 column, Desktop: 2 columns
className="grid grid-cols-1 lg:grid-cols-2 gap-8"

// Mobile: stacked, Desktop: flex row
className="flex flex-col md:flex-row gap-4"

// Mobile: hidden, Desktop: visible
className="hidden md:flex"

// Mobile: smaller, Desktop: larger
className="w-full md:w-56"

// Mobile: centered, Desktop: left-aligned
className="text-center md:text-left"
```

### Responsive Padding

```typescript
// Mobile: p-6, Desktop: p-10
className="p-6 md:p-10"

// Mobile: px-4, Desktop: px-8
className="px-4 md:px-8"
```

### Responsive Font Sizes

```typescript
// Mobile: text-lg, Desktop: text-2xl
className="text-lg md:text-2xl"

// Mobile: text-sm, Desktop: text-base
className="text-sm md:text-base"
```

---

## Accessibility

### Color Contrast

- **Text on Background**: Minimum WCAG AA contrast ratio (4.5:1)
- **Interactive Elements**: Minimum 3:1 contrast ratio
- **Examples**:
  - `text-white` on `bg-zinc-900`: ✅ High contrast
  - `text-zinc-500` on `bg-zinc-800`: ⚠️ Check contrast
  - `text-zinc-400` on `bg-zinc-950`: ✅ Acceptable

### Semantic HTML

```typescript
// Proper semantic elements
<button>Action</button>        // Not <div onClick>
<nav>Navigation</nav>          // Not <div>
<main>Page Content</main>      // Primary content
<aside>Sidebar</aside>         // Supplementary content
<section>Section</section>     // Thematic grouping
```

### ARIA Attributes

```typescript
// Modal accessibility
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
>
  <h2 id="modal-title">Dialog Title</h2>
</div>

// Disabled states
<button aria-disabled="true">Disabled</button>

// Loading states
<button aria-busy="true">Loading...</button>
```

### Focus Management

```typescript
// Visible focus indicator
className="focus:outline-none focus:ring-2 focus:ring-purple-500"

// Focus order maintained in modals
// Use ref forwarding for focus management
```

### Keyboard Navigation

- Tab key cycles through interactive elements
- Enter/Space activates buttons
- Escape closes modals
- Arrow keys navigate carousels

---

## Code Organization

### Component Structure

```typescript
import React from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";

// Types
interface ComponentProps {
  title: string;
  onClose?: () => void;
}

// Icons (inline SVG)
const IconComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props}>
    {/* SVG paths */}
  </svg>
);

// Sub-components
const SubComponent: React.FC = () => (
  <div className="...">Content</div>
);

// Main component
const MainComponent: React.FC<ComponentProps> = ({ title, onClose }) => {
  // Hooks
  const state = useStore();
  const navigate = useNavigate();

  // Event handlers
  const handleAction = () => { };

  // Render
  return (
    <div className="...">
      {title}
    </div>
  );
};

export default MainComponent;
```

### Class Organization in JSX

Order of Tailwind classes:

1. **Layout** - `flex`, `grid`, `flex-col`
2. **Size** - `w-full`, `h-screen`, `max-w-md`
3. **Spacing** - `p-4`, `mb-8`, `gap-3`
4. **Background** - `bg-zinc-900`, `bg-gradient-to-b`
5. **Border** - `border`, `border-zinc-800`, `rounded-lg`
6. **Text** - `text-white`, `text-sm`, `font-bold`
7. **Effects** - `shadow-lg`, `opacity-50`
8. **Interactions** - `hover:bg-zinc-800`, `transition-colors`
9. **Responsive** - `md:flex`, `lg:w-full`

**Example:**

```typescript
className="flex flex-col max-w-lg mx-auto gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-white shadow-lg hover:shadow-xl transition-shadow md:max-w-2xl"
```

### Type Safety

```typescript
// Use interfaces for props
interface Props {
  label: string;
  value: React.ReactNode;
  isEditing?: boolean;
  editInput?: React.ReactNode;
}

// Type component props
const Component: React.FC<Props> = ({ label, value, isEditing, editInput }) => (
  {/* ... */}
);

// Use enums for state
type TabId = "credentials" | "password";
const [activeTab, setActiveTab] = React.useState<TabId>("credentials");
```

---

## Common Patterns

### Form Row with Label

```typescript
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 px-5 py-3.5 border-b border-zinc-800">
  <span className="text-xs font-medium text-zinc-500 tracking-wide uppercase">
    Label
  </span>
  <div className="flex-1 sm:text-right">
    <input className={inputBase} placeholder="Value" />
  </div>
</div>
```

### Section Header

```typescript
<div className="flex items-center justify-between mb-3">
  <h3 className="text-xs font-semibold text-zinc-500 tracking-widest uppercase">
    Section Title
  </h3>
  {actionButton}
</div>
```

### Empty State

```typescript
<div className="flex flex-col items-center justify-center py-12">
  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
    <IconEmpty className="w-8 h-8 text-zinc-600" />
  </div>
  <h3 className="text-lg font-semibold text-white mb-2">No items</h3>
  <p className="text-sm text-zinc-500 text-center">
    No data available at this time.
  </p>
</div>
```

### Loading State

```typescript
<div className="flex items-center justify-center py-8">
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
  <span className="ml-3 text-zinc-400">Loading...</span>
</div>
```

---

## Best Practices

1. **Use Zinc color scale** - Prefer `zinc-*` over `gray-*` for consistency
2. **Maintain spacing rhythm** - Use multiples of 4px (Tailwind default)
3. **Reuse Tailwind patterns** - Define common patterns as strings or components
4. **Test responsiveness** - Always check mobile, tablet, and desktop views
5. **Prioritize performance** - Use inline SVG icons instead of icon fonts
6. **Keep contrasts high** - Use darker backgrounds with lighter text
7. **Group related controls** - Use `gap-3` or `gap-4` for visual grouping
8. **Add transition classes** - Make interactions feel smooth and polished
9. **Document custom styles** - Comment on any non-standard styling
10. **Validate with accessibility tools** - Use WAVE, axe, or Lighthouse regularly

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Poppins Font](https://fonts.google.com/specimen/Poppins)
- [Framer Motion](https://www.framer.com/motion)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker)

