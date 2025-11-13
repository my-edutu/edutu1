# 🎨 How to View the New UI Components

## Quick Start

### Option 1: View Showcase Page (Recommended)

1. **Open in Browser**
   - The app should be running at: `http://localhost:5173`
   - In the browser console, type:
   ```javascript
   window.location.href = 'http://localhost:5173/#/showcase'
   ```
   - Or manually modify the URL to add `#showcase` at the end

2. **From Landing Page**
   - When you see the landing page, open your browser's developer console (F12)
   - Type this JavaScript:
   ```javascript
   // This will navigate to the showcase
   const event = new CustomEvent('navigate', { detail: 'showcase' });
   window.dispatchEvent(event);
   ```

### Option 2: Start Development Server

If the server isn't running, start it:

```bash
cd /home/user/edutu1

# Install dependencies (if not already installed)
npm install

# Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`

### Option 3: Access Showcase Directly

Since this is a single-page app, you can temporarily modify the initial screen:

1. Edit `src/App.tsx` line 33:
   ```typescript
   // Change this:
   const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

   // To this:
   const [currentScreen, setCurrentScreen] = useState<Screen>('showcase');
   ```

2. Save the file and the dev server will hot-reload

---

## 🎯 What You'll See on the Showcase Page

The showcase page displays all components organized by category:

### **Progress & Visualization**
- ✅ **ProgressRing** - 4 colored variants showing different progress states
- ✅ **StatCard** - 3 metric cards with trends (Active Goals, Weekly Progress, Achievements)
- ✅ **StreakCounter** - Full variant showing 7-day streak and compact widget
- ✅ **Timeline** - 3-step roadmap with completed/current/locked states

### **Cards & Content**
- ✅ **OpportunityCard** - All 3 variants:
  - Compact (for lists)
  - Featured (with image header)
  - Hero (full immersive)
- ✅ **HorizontalScroll** - Netflix-style carousel with 4 cards

### **Feedback & Notifications**
- ✅ **Badge** - 9 different variants (brand, accent, success, warning, danger, info, neutral, with dot, with icon)
- ✅ **Toast** - 4 buttons to trigger different notification types
- ✅ **EmptyState** - Example showing "No goals yet" state

### **Modals & Overlays**
- ✅ **BottomSheet** - Button to open iOS-style modal drawer (swipe down to close!)

### **Gamification**
- ✅ **AchievementBadge** - All 3 variants:
  - Compact (list view)
  - Default (detailed card)
  - Showcase (celebration view)
- Both locked and unlocked states
- Different rarities (common, epic, legendary)

### **Animations & Effects**
- ✅ **Confetti** - 4 preset buttons:
  - 🎉 Celebration
  - ✅ Goal Completed
  - 🏆 Achievement
  - 🔥 Streak Milestone

---

## 🎮 Interactive Features to Try

1. **Click "Show Success/Error/Warning/Info"** buttons to see toast notifications pop up
2. **Click "Open BottomSheet"** to see the modal drawer (swipe down or click backdrop to close)
3. **Click any confetti button** to trigger celebration animations
4. **Save an opportunity** by clicking the heart icon on opportunity cards
5. **Scroll horizontally** on the carousel section
6. **Try dark mode** if you have it enabled in your system

---

## 🌈 Color Scheme

All components use the new **Teal + Coral** palette:
- **Brand**: Teal (#14B8A6) - Primary actions, focus states
- **Accent**: Coral (#F97316) - Secondary actions, urgency
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)

---

## 📱 Mobile View

To see mobile view in your browser:
1. Open Developer Tools (F12)
2. Click the device toolbar icon (or press Ctrl+Shift+M)
3. Select a mobile device (iPhone 12 Pro, Pixel 5, etc.)
4. See how components adapt to mobile screens!

---

## 🔧 Troubleshooting

### Server won't start?
```bash
# Try clearing node_modules and reinstalling
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't see showcase page?
Edit `src/App.tsx` line 33 to start with `'showcase'` screen

### Hot reload not working?
Refresh the browser (Ctrl+R or Cmd+R)

---

## 📚 Next Steps

Once you've reviewed the showcase:

1. **Integrate into Dashboard** - Use these components in the actual Dashboard
2. **Update AllGoals** - Add ProgressRing and Timeline
3. **Enhance Opportunities** - Use new OpportunityCard variants
4. **Add Gamification** - Implement StreakCounter and Achievements
5. **Improve Feedback** - Use Toast for all user actions

---

## 🎨 Component Usage Examples

### ProgressRing
```tsx
<ProgressRing progress={75} color="brand" label="Goal Progress" />
```

### StatCard
```tsx
<StatCard
  label="Active Goals"
  value="12"
  trend="up"
  trendValue="+25%"
  icon={Target}
  color="brand"
/>
```

### Toast
```tsx
const [toasts, setToasts] = useState([]);

// Add toast
setToasts([...toasts, {
  id: Date.now().toString(),
  type: 'success',
  message: 'Goal completed!',
  duration: 5000,
}]);

// Render
<ToastContainer toasts={toasts} onClose={...} position="top-right" />
```

### Confetti
```tsx
import { confettiPresets } from '@/lib/utils/confetti';

// Trigger on goal completion
confettiPresets.goalCompleted();
```

---

Enjoy exploring the new UI! 🚀
