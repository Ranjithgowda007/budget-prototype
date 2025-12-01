# IFMIS Frontend Architecture & Layout Master Plan

**Project:** MP Government Integrated Financial Management Information System (IFMIS)
**Context:** This document serves as the Source of Truth for the AI IDE to generate the application shell, navigation logic, and dynamic dashboard engine.

---

## 1. Design System & Tech Stack Requirements

*   **Framework:** React 18+ (TypeScript)
*   **Styling:** Tailwind CSS (No custom CSS files).
*   **Icons:** `lucide-react` (Modern, clean strokes matching the Figma design).
*   **Drag & Drop:** `@dnd-kit/core` and `@dnd-kit/sortable` (For the configurable dashboard).
*   **Charts:** `recharts` (For budget visualization).
*   **Visual Theme:**
    *   **Primary Color:** Royal Blue (matching the MP Gov Header/Figma).
    *   **Background:** Light Gray (`bg-slate-50`) for the dashboard canvas.
    *   **Surface:** Pure White (`bg-white`) for cards and sidebar.
    *   **Typography:** Sans-serif (Inter or Roboto), clean and legible.

---

## 2. Core Layout Architecture (The "Shell")

The application wrapper consists of a fixed Sidebar and a Sticky Header, with a scrollable Main Content Area.

### A. The "Shiprocket-Style" Sidebar
**Behavior:**
1.  **Default State:** Collapsed (Width: `w-16` / `64px`). Shows **Icons Only**.
2.  **Hover State:** Expanded (Width: `w-64` / `256px`). Shows **Icons + Labels + Chevrons**.
3.  **Animation:** Smooth CSS transition (`transition-[width] duration-300 ease-in-out`).
4.  **Z-Index:** High z-index to float above content if screen is small, or push content on large screens (user preference, default to pushing content for IFMIS stability).

**Component Structure:**
```tsx
// SidebarItem Interface
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  subItems?: SidebarItem[]; // Recursive for nested menus like "Budget Head Configuration"
  requiredRole?: string[]; // Role-based visibility
}
```

**Interaction Logic:**
*   `onMouseEnter`: Sets state `isExpanded(true)`.
*   `onMouseLeave`: Sets state `isExpanded(false)`.
*   **Active State:** The active module must be highlighted (blue background/text) even in icon-only mode.

### B. The Navigation Bar (Header)
**Features:**
*   **Left:** Breadcrumbs (e.g., "Home > Budget > Estimate").
*   **Right:**
    *   Module Switcher (Dropdown to jump between major 18 modules).
    *   Notifications (Bell icon).
    *   Theme Toggle (Light/Dark).
    *   User Profile (Avatar + Role).
*   **Styling:** Sticky top, `border-b`, white background, `h-16`.

---

## 3. Dynamic Dashboard Engine

The dashboard is not a static page. It is a container that renders a user-configurable list of widgets.

### A. Widget Architecture
We will treat dashboard sections as "Widgets".

**Widget Registry Map:**
A mapping object connecting string IDs to React Components.
```tsx
const WIDGET_REGISTRY = {
  'budget-overview': <BudgetOverviewChart />,
  'spending-category': <SpendingCategoryChart />,
  'quick-actions': <QuickActionsCard />,
  'recent-activity': <RecentActivityFeed />,
  'notifications': <NotificationPanel />
};
```

### B. Configuration State
Each user (or role) has a configuration object defining their layout.

```tsx
interface DashboardConfig {
  layout: string[]; // Array of Widget IDs in order, e.g., ['budget-overview', 'recent-activity']
}

// Default config for 'Budget Officer' role
const BUDGET_OFFICER_DEFAULT: DashboardConfig = {
  layout: ['total-stats', 'spending-chart', 'recent-activity']
};
```

### C. Drag-and-Drop Implementation
*   **Wrapper:** Wrap the dashboard grid in `<DndContext>`.
*   **Sortable Container:** Use `<SortableContext>` with the list of widget IDs.
*   **Items:** Wrap each Widget Component in a `<SortableItem>` wrapper that handles the listeners and transform styles.
*   **Persistence:** On `onDragEnd`, reorder the `layout` array in state (and mock saving to backend).

---

## 4. Role-Based Access Control (RBAC) Simulation

Since backend integration is future work, frontend must simulate permissions.

**User Mock:**
```tsx
const CURRENT_USER = {
  name: "Rajeshwar Dongre",
  role: "budget_admin", // or 'view_only', 'approver'
  permissions: ['view_budget', 'edit_budget', 'configure_dashboard']
};
```

**Logic:**
1.  **Sidebar Filtering:** Filter `SidebarItems` where `item.requiredRole` includes `CURRENT_USER.role`.
2.  **Dashboard Filtering:** Only allow dragging/dropping widgets permitted for that role.

---

## 5. Directory Structure for AI Generation

Adhere to this structure to ensure modularity for the 18+ modules.

```text
/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx       // The expandable sidebar
│   │   ├── Navbar.tsx        // The top header
│   │   └── Layout.tsx        // Main wrapper
│   ├── dashboard/
│   │   ├── WidgetWrapper.tsx // Draggable container
│   │   ├── DashboardGrid.tsx // The drop zone
│   │   └── widgets/          // Actual UI cards
│   │       ├── StatsCard.tsx
│   │       ├── ChartCard.tsx
│   │       └── ActivityList.tsx
│   └── ui/                   // Atomic components (Buttons, Cards)
├── context/
│   ├── LayoutContext.tsx     // Handles sidebar expansion state
│   └── ConfigContext.tsx     // Handles dashboard widget order
├── data/
│   ├── navigation.ts         // Sidebar menu structure
│   └── mockData.ts           // Widget data
├── hooks/
│   └── useDashboardConfig.ts // Logic for reordering
├── types/
│   └── index.ts              // Global interfaces
└── App.tsx
```

## 6. Visual Guidelines (Tailwind)

*   **Sidebar Hover:** `hover:w-64 w-16 bg-white border-r border-gray-200`
*   **Active Item:** `bg-blue-50 text-blue-600 border-r-4 border-blue-600`
*   **Cards:** `bg-white rounded-xl shadow-sm border border-gray-100 p-6`
*   **Headings:** `text-gray-900 font-semibold text-lg`
*   **Subtext:** `text-gray-500 text-sm`

---

## 7. GIGW & Accessibility Compliance (Mandatory)

To ensure compliance with Guidelines for Indian Government Websites (GIGW):

*   **Color Contrast:** All text content must maintain a contrast ratio of at least **4.5:1** against the background.
    *   **Primary Action Blue:** Use `bg-blue-700` or `bg-blue-800` instead of lighter blues for buttons/headers.
    *   **Text Colors:** Use `text-slate-900` for primary text and `text-slate-700` for secondary text. Avoid light gray text (`text-gray-400` is prohibited for essential reading).
*   **Eye-Smoothing Palette:**
    *   Avoid pure black (`#000000`) on pure white (`#FFFFFF`) for long reading sessions to reduce eye strain. Use `bg-slate-50` for app backgrounds and `text-slate-900` for text.
    *   Avoid oversaturated colors (Neon Green/Red). Use "Safety" variants: `text-red-700`, `bg-green-100 text-green-800`.
*   **Responsiveness:** The layout must be fully functional at 200% browser zoom without horizontal scrolling.
*   **Focus States:** All interactive elements must have a clearly visible focus ring (e.g., `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`).

---

**Instruction to AI:**
When generating code based on this plan, prioritize the smooth transition of the sidebar and the functionality of the drag-and-drop dashboard first. Ensure the layout is responsive and collapses gracefully on mobile devices. Strictly adhere to the GIGW color contrast rules defined in Section 7.
