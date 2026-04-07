# Progress

## What Works
- [x] V3 Duolingo-style UI as default
- [x] Profile selection with avatars
- [x] Guided ordering flow (mains → sides → drinks)
- [x] Optional categories (desserts, snacks) visible but not in flow
- [x] Progress bar with numbered steps (1-2-3)
- [x] Order submission to Google Sheets and Supabase
- [x] Parent Dashboard with PIN protection
- [x] Dark mode (default) and light mode toggle
- [x] Confetti celebration on order completion
- [x] Auto-scroll to next category after selection
- [x] Clean category titles without emoji
- [x] Static gradient background (no animation issues)

## What's Left to Build
- [ ] Order status updates in real-time
- [ ] Push notifications for order ready
- [ ] Menu item images from Supabase
- [ ] Offline support for PWA
- [ ] Order history view for parents

## Current Status
**Stable** - Core functionality working. V3 UI is the default with dark mode. Light mode uses warm cream colors.

## Known Issues
- None currently identified

## Evolution of Project Decisions
1. **v1**: Original design with glass-morphism style
2. **v2**: Intermediate redesign (backup only)
3. **v3**: Duolingo-style gamified UI (current default)
4. **Theme**: Switched from light-mode default to dark-mode default
5. **Background**: Removed animated mesh gradient due to z-index conflicts, replaced with static gradient
6. **Flow**: Restricted to mains → sides → drinks only; desserts/snacks marked as optional