# Inventory Management System - Design Guidelines

## Design Approach

**Selected Approach:** Design System - Material Design 3  
**Justification:** This is a utility-focused, information-dense productivity application requiring efficient data management, clear hierarchy, and responsive layouts. Material Design 3 provides robust patterns for tables, forms, dashboards, and mobile-first experiences ideal for inventory management.

**Core Principles:**
- Clarity and efficiency over visual decoration
- Information density balanced with scannability
- Immediate access to critical functions
- Consistent, predictable interactions

---

## Typography System

**Font Family:** Roboto (via Google Fonts CDN)

**Type Scale:**
- Page Headers: 32px/2rem, Medium (500)
- Section Headers: 24px/1.5rem, Medium (500)
- Card Titles: 18px/1.125rem, Medium (500)
- Body Text: 16px/1rem, Regular (400)
- Labels/Metadata: 14px/0.875rem, Regular (400)
- Buttons/Actions: 14px/0.875rem, Medium (500)
- Table Headers: 14px/0.875rem, Medium (500)
- Table Data: 14px/0.875rem, Regular (400)

**Mobile Adjustments:**
- Page Headers: 24px/1.5rem
- Section Headers: 20px/1.25rem
- Maintain other sizes for consistency

---

## Layout System

**Spacing Primitives:** Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12 (desktop), py-6 to py-8 (mobile)
- Card gaps: gap-4 to gap-6
- Form field spacing: space-y-4
- Table cell padding: px-4 py-3

**Grid Structure:**
- Desktop: 12-column grid with max-w-7xl container
- Tablet: 8-column grid, 2-column layouts collapse to stacked
- Mobile: Single column, full-width cards with px-4 container

**Dashboard Layout:**
- Persistent sidebar navigation (desktop): w-64, collapses to hamburger menu (mobile)
- Main content area: flex-1 with p-6 (desktop), p-4 (mobile)
- Top bar: Fixed header with search and notifications, h-16

---

## Component Library

### Navigation
**Sidebar (Desktop):**
- Fixed left sidebar with primary navigation items
- Active state: Filled background with medium emphasis
- Icons from Material Icons CDN paired with labels
- Sections: Dashboard, Products, Borrowed Items, Low Stock, Reminders

**Mobile Navigation:**
- Bottom tab bar with 4-5 primary actions
- Hamburger menu for additional options
- Material Icons for all navigation items

### Data Display Components

**Product Cards (Mobile Priority):**
- Elevated card with rounded corners (rounded-lg)
- Product name as card header
- Grid layout for metadata: Quantity, Shelf No., Expiration
- Status badges for expiration warnings and low stock
- Quick action button (3-dot menu) for edit/delete

**Data Table (Desktop):**
- Striped rows for scannability
- Sortable column headers with up/down indicators
- Fixed header on scroll
- Columns: Product Name, Quantity, Shelf No., Expiration Date, Status, Actions
- Sticky column for actions on horizontal scroll
- Row hover state for interaction feedback

**Status Indicators:**
- Expiring Soon (7 days): Warning badge with amber treatment
- Expired: Critical badge with red treatment
- Low Stock: Alert badge with orange treatment
- Normal: Neutral subtle badge

### Forms & Inputs

**Search Bar:**
- Prominent placement in top bar (desktop) or sticky top (mobile)
- Search icon (Material Icons: search) prefix
- Placeholder: "Search by product name or shelf number..."
- Live filtering with debounce
- Clear button when text is present

**Input Fields:**
- Outlined style with floating labels
- Helper text below for guidance
- Error states with inline validation
- Consistent height: h-12
- Full-width on mobile, appropriate width on desktop

**Action Buttons:**
- Primary: Filled button for main actions (Add Product, Save)
- Secondary: Outlined button for cancel/secondary actions
- Icon buttons: Circular for contextual actions (edit, delete)
- FAB (Floating Action Button): Mobile only, bottom-right for "Add Product"

### Alerts & Notifications

**Notification Banner:**
- Top-positioned, dismissible alerts
- Expiration warnings: Amber background
- Low stock alerts: Orange background
- Success messages: Green background
- Appears below header, above content

**Badge Counts:**
- Notification dots on navigation items
- Red badge for urgent items (expired, critically low stock)
- Numbered badges for counts

### Modals & Dialogs

**Add/Edit Product Modal:**
- Centered modal with backdrop overlay
- Form layout with clear sections
- Action buttons at bottom right
- Mobile: Full-screen slide-up sheet

**Confirmation Dialogs:**
- Simple dialog for delete confirmations
- Title, description, and action buttons
- Dismissible by clicking outside or cancel

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, bottom nav, card-based)
- Tablet: 768px - 1024px (2-column grids, sidebar starts collapsing)
- Desktop: > 1024px (multi-column, persistent sidebar, tables)

**Mobile Optimizations:**
- Card-based layouts replace tables
- Bottom navigation replaces sidebar
- FAB for primary actions
- Swipe gestures for card actions
- Full-screen modals instead of centered dialogs

**Desktop Optimizations:**
- Data tables with full columns
- Sidebar navigation always visible
- Multi-column dashboard widgets
- Hover states for interactive elements

---

## Key Screens Structure

**Dashboard:**
- Metrics cards row: Total Products, Low Stock Count, Expiring Soon, Borrowed Items
- Recent activity feed
- Quick actions section

**Products List:**
- Search bar + filter buttons (All, Low Stock, Expiring)
- Product table (desktop) / Product cards (mobile)
- Pagination or infinite scroll

**Borrowed Items:**
- List of borrowed products with borrower info
- Return date tracking
- Overdue highlighting

**Reminders:**
- Note cards with product name, reminder text, date
- Add new reminder button
- Edit/delete actions per reminder

---

## Animations

Use sparingly and purposefully:
- Page transitions: Subtle fade (150ms)
- Card hover lift: Slight shadow increase
- Modal entry: Fade + scale (200ms)
- No scroll-based animations
- Loading states: Simple spinner or skeleton screens