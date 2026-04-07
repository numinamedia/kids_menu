# Tech Context

## Technologies Used
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animations
- **Supabase** - Primary database and order storage
- **Google Sheets API** - Backup order storage
- **canvas-confetti** - Celebration animations
- **CSS Custom Properties** - Theme system (dark/light mode)

## Development Setup
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Key Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "framer-motion": "^11.x",
  "@supabase/supabase-js": "^2.x",
  "canvas-confetti": "^1.x"
}
```

## Deployment
- Deployed on Vercel
- Auto-deploys on push to `main` branch
- PWA support via `manifest.json`

## File Structure Notes
- `src/components/v3/` - Current active UI
- `src/components/v2/` - Legacy backup (not used)
- `src/components/` - Original v1 components (backup)
- `src/data/menuData.js` - Static menu configuration
- `src/hooks/` - Custom React hooks for data fetching