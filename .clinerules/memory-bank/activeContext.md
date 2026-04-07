# Active Context

## Current Work Focus
V3 Duolingo-style redesign is the default UI. Recent fixes applied to improve stability and user experience.

## Recent Changes
1. **V3 as Default UI**: Removed version toggle, V3 loads automatically
2. **Background Fix**: Changed z-index from 0 to -1 to prevent background from covering content
3. **Category Display**: All categories (mains, sides, drinks, desserts, snacks) now visible in scrollable layout
4. **Progress Bar**: Shows numbers 1-2-3 for mains-sides-drinks flow
5. **Light Mode**: Warmer, muted cream colors instead of bright white
6. **Category Titles**: Clean, uppercase text without emoji, with subtle border separator
7. **Ordering Flow**: Only mains → sides → drinks are in the sequential flow; desserts/snacks are optional

## Active Decisions
- Dark mode is the default theme
- Light mode available via toggle (sun/moon button)
- Snacks and desserts are NOT part of the ordering flow but remain accessible
- Auto-scroll to next category after selection in flow categories
- Google Sheets as backup, Supabase as primary order storage

## Important Patterns
- Framer Motion for animations
- CSS custom properties for theming (dark/light mode)
- Static gradient background with subtle radial accents
- Progress tracking with numbered step badges

## Learnings
- z-index conflicts can cause content to be hidden behind backgrounds
- Light mode needs careful color selection to avoid harsh whites
- Category titles should be clean and readable without decorative elements