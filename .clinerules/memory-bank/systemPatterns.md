# System Patterns

## Architecture Overview
Single-page React application with component-based architecture, using Vite as the build tool.

## Component Structure
```
src/
├── App.jsx                    # Main app with routing
├── components/
│   ├── v3/                    # Current UI (Duolingo-style)
│   │   ├── ProfileGatewayV3.jsx
│   │   ├── MenuScreenV3.jsx
│   │   ├── MealCardV3.jsx
│   │   ├── OrderFooterV3.jsx
│   │   └── SuccessModalV3.jsx
│   ├── ParentDashboard/
│   │   ├── Dashboard.jsx
│   │   ├── OrderQueue.jsx
│   │   ├── MenuEditor.jsx
│   │   └── PINDialog.jsx
│   └── v2/                    # Legacy backup
├── hooks/
│   ├── useMenu.js             # Menu data fetching
│   └── useOrders.js           # Order management
├── lib/
│   └── supabase.js            # Supabase client
└── data/
    └── menuData.js            # Static menu configuration
```

## Key Design Patterns
1. **State Lifting**: Order state managed in App.jsx, passed down as props
2. **Progressive Disclosure**: Guided flow (mains → sides → drinks) with auto-advance
3. **Optimistic UI**: Selections update immediately, order sent async
4. **Theme Toggle**: CSS custom properties swapped via class on root element

## Data Flow
1. Menu data loaded from `menuData.js` (static) or Supabase (dynamic)
2. User selections stored in local state
3. Order submitted to both Google Sheets (backup) and Supabase (primary)
4. Parent dashboard reads from Supabase for order management

## Routing
- `/` - Main kid ordering interface
- `/admin` - Parent dashboard (PIN-protected)

## Theme System
- Dark mode default
- Light mode via `.v3-light-mode` class on `<html>`
- CSS custom properties for all colors
- Theme preference saved to localStorage