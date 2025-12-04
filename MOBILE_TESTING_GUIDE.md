# 📱 Mobile Testing Guide

## Quick Test Checklist

### 🔍 Chrome DevTools Testing
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Test these devices:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - Pixel 5 (393px)
   - Samsung Galaxy S20 (412px)
   - iPad (768px)
   - iPad Pro (1024px)

### ✅ What to Test

#### Mobile Menu (< 768px)
- [ ] Hamburger menu button appears in top-left
- [ ] Clicking menu button opens sidebar
- [ ] Overlay appears behind sidebar
- [ ] Clicking overlay closes menu
- [ ] Clicking any link closes menu
- [ ] Sidebar slides smoothly (0.3s animation)

#### Touch Targets
- [ ] All buttons minimum 44px height
- [ ] Easy to tap on small screens
- [ ] No accidental double-taps
- [ ] Proper spacing between elements

#### Input Fields
- [ ] Font size 16px (no iOS zoom)
- [ ] Easy to type on mobile
- [ ] Keyboard doesn't cover inputs

#### Tables
- [ ] Horizontal scroll works
- [ ] Smooth touch scrolling
- [ ] All columns visible
- [ ] No layout breaks

#### Layouts
- [ ] Cards stack in single column
- [ ] Stats display properly
- [ ] Forms are full width
- [ ] No horizontal overflow

#### Navigation
- [ ] All links work
- [ ] Dropdown menus accessible
- [ ] User profile visible
- [ ] Logout button works

### 📐 Breakpoint Tests

#### 480px (Small Mobile)
```
✓ Compact layouts
✓ Smaller text sizes
✓ Single column
✓ Touch-friendly
```

#### 768px (Tablet Portrait)
```
✓ Mobile menu active
✓ 2-column grids possible
✓ Larger touch targets
✓ Sidebar overlay
```

#### 1024px (Tablet Landscape)
```
✓ Desktop-like layout
✓ Sidebar visible
✓ Multi-column grids
✓ No mobile menu
```

### 🎯 Expected Behavior

#### On Mobile (≤ 768px)
1. **Menu button** visible in top-left corner
2. **Sidebar** hidden by default
3. **Clicking menu** shows sidebar with overlay
4. **Clicking outside** or **any link** closes menu
5. **All content** stacks vertically

#### On Desktop (> 768px)
1. **Sidebar** always visible
2. **No menu button**
3. **Collapse button** works normally
4. **Multi-column** layouts active

### 🐛 Common Issues to Check

#### If sidebar doesn't open:
- Check console for errors
- Verify `isMobileOpen` state changes
- Check CSS classes applied

#### If menu doesn't close:
- Verify `handleLinkClick` is called
- Check overlay click handler
- Inspect state updates

#### If layout breaks:
- Check for fixed widths
- Verify flexbox/grid properties
- Inspect responsive breakpoints

#### If inputs zoom on iOS:
- Confirm font-size ≥ 16px
- Check viewport meta tag
- Test on real device

### 📊 Performance Check

Open DevTools Performance tab:
- [ ] FPS stays at 60
- [ ] Animations smooth
- [ ] No layout thrashing
- [ ] Touch response < 100ms

### 🚀 Real Device Testing

#### iOS (Safari)
1. Open http://localhost:3000
2. Test menu open/close
3. Try all touch interactions
4. Check input behavior
5. Test portrait/landscape

#### Android (Chrome)
1. Open http://localhost:3000
2. Test swipe scrolling
3. Verify menu functionality
4. Check table scroll
5. Test all forms

### ✨ Success Criteria

✅ Menu opens/closes smoothly  
✅ All content accessible  
✅ No horizontal scroll (except tables)  
✅ Touch targets easy to hit  
✅ Inputs don't zoom on iOS  
✅ Animations at 60fps  
✅ Works in portrait/landscape  
✅ No console errors  

### 🎨 Visual Checks

- [ ] Consistent spacing
- [ ] Proper alignment
- [ ] Readable text sizes
- [ ] Colors match theme
- [ ] Icons display correctly
- [ ] Gradients render well

### 🔧 Developer Tools

```bash
# Test on specific viewport
# Chrome DevTools > Responsive Mode

# Common breakpoints:
# 320px - iPhone 5
# 375px - iPhone SE
# 390px - iPhone 12
# 412px - Android phones
# 768px - iPad portrait
# 1024px - iPad landscape
# 1280px - Desktop
```

### 📝 Notes

- Frontend runs on: http://localhost:3000
- Backend runs on: http://localhost:8000
- Test with both admin and student accounts
- Check all pages: Dashboard, Students, Companies, Progress, Events

---

**Quick Start Testing:**
1. Open Chrome DevTools (F12)
2. Toggle device mode (Ctrl+Shift+M)
3. Select "iPhone 12 Pro"
4. Refresh page
5. Click hamburger menu
6. Test navigation

**Expected:** Sidebar slides in from left with overlay, closes on link click.
