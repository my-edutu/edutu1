# Fix White Screen Issue

## The Problem
Dependencies are not installed, causing the app to not run.

## Solution - Run These Commands:

```bash
cd /home/user/edutu1

# Install all dependencies
npm install

# Start the development server
npm run dev
```

## Then in your browser:
1. Open http://localhost:5173
2. You should see the Component Showcase page

## If you still see a white screen:

### Check Browser Console
1. Open DevTools (F12)
2. Look at the Console tab for errors
3. Common issues:
   - Module not found errors
   - Import/export errors

### Try Landing Page Instead
If showcase has issues, edit `src/App.tsx` line 33:

Change:
```typescript
const [currentScreen, setCurrentScreen] = useState<Screen>('showcase');
```

To:
```typescript
const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
```

This will show the normal landing page while we debug the showcase.

## Alternative: View Components in Code

You can browse the components directly:
- `/home/user/edutu1/src/components/ui/` - All 13 components
- `/home/user/edutu1/src/pages/ComponentShowcase.tsx` - Demo page

## Next Steps After Installing

Once `npm install` completes:
1. Run `npm run dev`
2. Open browser to localhost:5173
3. See the showcase with all components!
