---
name: Cyberpunk Design System Migration
overview: Migrate the entire SoloSuccess AI application from the current military glassmorphic design to a new cyberpunk/sci-fi design system based on the provided index.html, including updating all 78+ pages, components, and integrating the new SVG logo.
todos:
  - id: update-tailwind-config
    content: Update tailwind.config.ts with cyberpunk color palette, fonts (Orbitron/Rajdhani), neon shadows, and custom animations
    status: completed
  - id: create-cyber-components
    content: "Create reusable cyberpunk components: NeuralNetworkCanvas, HudBorder, GlitchText, CyberNav, CyberFooter, SoloSuccessLogo, UIOverlayLines, CyberButton"
    status: completed
    dependencies:
      - update-tailwind-config
  - id: update-global-styles
    content: Create/update global CSS with HUD borders, glitch animations, neural network styles, and cyberpunk scrollbar
    status: completed
    dependencies:
      - update-tailwind-config
  - id: update-root-layout
    content: Update app/layout.tsx to include Orbitron/Rajdhani fonts and cyberpunk background theme
    status: completed
    dependencies:
      - update-global-styles
  - id: redesign-homepage
    content: Redesign app/page.tsx with neural network canvas, glitch text, HUD cards, and new navigation/footer
    status: completed
    dependencies:
      - create-cyber-components
      - update-root-layout
  - id: update-navigation-components
    content: Update all navigation components (Navbar, MobileNavigation, AppSidebar) with cyberpunk design and new logo
    status: completed
    dependencies:
      - create-cyber-components
  - id: update-footer-components
    content: Redesign footer components (AppFooter, Marketing Footer) with cyberpunk theme
    status: completed
    dependencies:
      - create-cyber-components
  - id: redesign-core-pages
    content: Redesign features, pricing, about, and contact pages with cyberpunk theme
    status: completed
    dependencies:
      - redesign-homepage
      - update-navigation-components
      - update-footer-components
  - id: redesign-auth-pages
    content: Update signin, signup, forgot-password, and reset-password pages with cyberpunk design
    status: completed
    dependencies:
      - redesign-core-pages
  - id: redesign-dashboard-layout
    content: Update dashboard layout, sidebar, and header with cyberpunk theme
    status: completed
    dependencies:
      - update-navigation-components
  - id: redesign-dashboard-pages
    content: Redesign all dashboard pages (agents, slaylist, briefcase, brand, competitors, templates, focus, burnout, analytics, settings, etc.)
    status: completed
    dependencies:
      - redesign-dashboard-layout
  - id: redesign-legal-pages
    content: Update privacy, terms, cookies, security, compliance, help, status pages with cyberpunk theme
    status: completed
    dependencies:
      - redesign-core-pages
  - id: redesign-content-pages
    content: Update blog, careers, community, templates, compare, and all remaining pages with cyberpunk theme
    status: completed
    dependencies:
      - redesign-legal-pages
  - id: update-ui-components
    content: Update button, card, input, and other UI components to support cyberpunk variants
    status: completed
    dependencies:
      - create-cyber-components
  - id: testing-and-polish
    content: Test all pages, fix any issues, ensure responsive design, accessibility, and performance
    status: completed
    dependencies:
      - redesign-content-pages
      - update-ui-components
---

# Complete App Redesign: Cyberpunk/Sci-Fi Theme Migration

## Overview

Transform the entire SoloSuccess AI application from the current military glassmorphic design to a cyberpunk/sci-fi theme based on `public/index.html`. This includes updating the design system, all pages, components, and integrating the new SVG logo.

## Design System Changes

### 1. Update Tailwind Configuration

**File**: `tailwind.config.ts`

- Add cyberpunk color palette:
- `cyber.black`: `#020005`
- `cyber.dark`: `#0a0514`
- `cyber.cyan`: `#00f3ff`
- `cyber.purple`: `#bd00ff`
- `cyber.dim`: `rgba(0, 243, 255, 0.1)`
- Add custom fonts: `sci` (Orbitron) and `tech` (Rajdhani)
- Add neon shadow utilities: `neon-cyan`, `neon-purple`
- Add custom animations: `pulse-fast`, `spin-slow`
- Remove/replace military color system

### 2. Create Reusable Cyberpunk Components

**New Component Files to Create**:

- `components/cyber/NeuralNetworkCanvas.tsx` - Canvas animation background
- `components/cyber/HudBorder.tsx` - HUD-style bordered containers
- `components/cyber/GlitchText.tsx` - Glitch effect text component
- `components/cyber/CyberNav.tsx` - Navigation with new design
- `components/cyber/CyberFooter.tsx` - Footer with new design
- `components/cyber/SoloSuccessLogo.tsx` - Reusable SVG logo component
- `components/cyber/UIOverlayLines.tsx` - Background UI lines
- `components/cyber/CyberButton.tsx` - Button with cyberpunk styling

### 3. Update Root Layout

**File**: `app/layout.tsx`

- Update global styles to use cyberpunk theme
- Add Orbitron and Rajdhani fonts via Next.js font optimization
- Update background color to `#020005`
- Ensure neural network canvas is available globally

### 4. Logo Integration

**Create**: `components/cyber/SoloSuccessLogo.tsx`

- Extract SVG logo from `public/index.html` (lines 182-211)
- Make it reusable with props for size, variant, animation
- Update all logo references:
- `app/page.tsx` (line 44-50)
- `components/shared/shared-landing-page.tsx` (line 162-175)
- `components/app-sidebar.tsx` (if logo is used)
- `components/mobile/mobile-navigation.tsx` (line 249-251)
- Any other navigation components

## Page Updates

### Priority 1: Core Pages (High Traffic)

1. **Homepage** - `app/page.tsx`

- Replace military theme with cyberpunk design
- Add neural network canvas background
- Update hero section with glitch text effect
- Replace feature cards with HUD-border cards
- Update navigation and footer

2. **Features Page** - `app/features/page.tsx`

- Apply cyberpunk styling
- Update feature cards with HUD borders
- Add neural network background

3. **Pricing Page** - `app/pricing/page.tsx`

- Update pricing cards with cyberpunk design
- Apply HUD-border styling
- Update CTA buttons

4. **About Page** - `app/about/page.tsx`

- Apply cyberpunk theme
- Update layout and styling

5. **Contact Page** - `app/contact/page.tsx`

- Apply cyberpunk theme
- Update form styling

### Priority 2: Authentication Pages

6. **Sign In** - `app/signin/page.tsx`
7. **Sign Up** - `app/signup/page.tsx`
8. **Forgot Password** - `app/forgot-password/page.tsx`
9. **Reset Password** - `app/reset-password/page.tsx`

### Priority 3: Dashboard Pages

10. **Dashboard Home** - `app/dashboard/page.tsx`
11. **AI Agents** - `app/dashboard/agents/page.tsx`
12. **SlayList** - `app/dashboard/slaylist/page.tsx`
13. **Briefcase** - `app/dashboard/briefcase/page.tsx`
14. **Brand Builder** - `app/dashboard/brand/page.tsx`
15. **Competitors** - `app/dashboard/competitors/page.tsx`
16. **Templates** - `app/dashboard/templates/page.tsx`
17. **Focus Mode** - `app/dashboard/focus/page.tsx`
18. **Burnout Shield** - `app/dashboard/burnout/page.tsx`
19. **Analytics** - `app/dashboard/analytics/page.tsx`
20. **Settings** - `app/dashboard/settings/page.tsx`
21. **All other dashboard sub-pages** (workspace, learning, notifications, integrations, etc.)

### Priority 4: Legal/Info Pages

22. **Privacy Policy** - `app/privacy/page.tsx`
23. **Terms of Service** - `app/terms/page.tsx`
24. **Cookies Policy** - `app/cookies/page.tsx`
25. **Security** - `app/security/page.tsx`
26. **Compliance** - `app/compliance/page.tsx`
27. **Help** - `app/help/page.tsx`
28. **Status** - `app/status/page.tsx`
29. **Blog** - `app/blog/page.tsx` and blog post pages
30. **Careers** - `app/careers/page.tsx`
31. **Community** - `app/community/page.tsx`

### Priority 5: Additional Pages

32. **Pricing Sub-pages** - `app/pricing/launch/page.tsx`, `app/pricing/accelerator/page.tsx`, `app/pricing/dominator/page.tsx`
33. **Compare Pages** - `app/compare/page.tsx` and sub-pages
34. **Template Pages** - `app/templates/page.tsx` and `app/templates/[templateSlug]/page.tsx`
35. **Team Page** - `app/team/page.tsx`
36. **Profile Page** - `app/profile/page.tsx`
37. **User Page** - `app/user/page.tsx`
38. **All other remaining pages** (60+ additional pages)

## Component Updates

### Shared Components

1. **Navigation Components**

- `components/marketing/layout/Navbar.tsx` - Update to cyberpunk design
- `components/mobile/mobile-navigation.tsx` - Apply cyberpunk theme
- `components/app-sidebar.tsx` - Update sidebar styling

2. **Footer Components**

- `components/footer/app-footer.tsx` - Complete redesign with cyberpunk theme
- `components/marketing/layout/Footer.tsx` - Update if exists

3. **Layout Components**

- `components/marketing/layout/MarketingLayout.tsx` - Update background and styling
- `components/shared/shared-landing-page.tsx` - Major redesign

4. **Dashboard Components**

- `components/DashboardHeader.tsx` - Update header styling
- `components/app-sidebar.tsx` - Update sidebar with cyberpunk theme

5. **UI Components**

- Update button components to support cyberpunk variants
- Update card components with HUD-border styling
- Update form inputs with cyberpunk styling

## Global Styles

**File**: `app/globals.css` or create `styles/cyberpunk.css`

- Add HUD border styles
- Add glitch text animations
- Add neural network canvas styles
- Update scrollbar styling (cyan theme)
- Add UI overlay line styles

## Implementation Strategy

### Phase 1: Foundation (Week 1)

1. Update Tailwind config with cyberpunk colors
2. Create reusable cyberpunk components
3. Create SoloSuccessLogo component
4. Update root layout and global styles

### Phase 2: Core Pages (Week 1-2)

1. Redesign homepage
2. Update navigation and footer components
3. Redesign features, pricing, about, contact pages
4. Update authentication pages

### Phase 3: Dashboard (Week 2-3)

1. Update dashboard layout
2. Redesign all dashboard pages
3. Update sidebar and header
4. Apply theme to dashboard components

### Phase 4: Remaining Pages (Week 3-4)

1. Update all legal/info pages
2. Update blog and content pages
3. Update remaining utility pages
4. Final polish and testing

## Key Design Elements to Implement

1. **Neural Network Canvas**: Animated particle network background
2. **HUD Borders**: Clipped polygon borders with corner accents
3. **Glitch Text**: Animated glitch effect for headings
4. **Neon Colors**: Cyan (#00f3ff) and Purple (#bd00ff) with glow effects
5. **Typography**: Orbitron for headings, Rajdhani for body text
6. **Dark Background**: #020005 with subtle gradients
7. **UI Overlay Lines**: Subtle vertical/horizontal guide lines
8. **Logo Animation**: Rotating ring around SS logo

## Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Logo displays properly everywhere
- [ ] Neural network animation performs well
- [ ] Responsive design works on mobile
- [ ] Dark theme is consistent
- [ ] All interactive elements work
- [ ] No console errors
- [ ] Accessibility maintained
- [ ] Performance is acceptable

## Notes

- Maintain all existing functionality
- Keep accessibility features
- Ensure responsive design
- Preserve SEO metadata
- Maintain existing routes and nav