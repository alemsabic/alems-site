# Design System Guidelines

Comprehensive guide for maintaining visual consistency across all platforms.

## Color Palette

#design-system #branding

### Primary Colors
- **Brand Blue**: `#0066cc`
- **Secondary Blue**: `#4d94ff`
- **Dark Blue**: `#004499`

### Neutral Colors
- **Charcoal**: `#333333`
- **Medium Gray**: `#666666`
- **Light Gray**: `#f5f5f5`
- **White**: `#ffffff`

## Typography

### Font Hierarchy

1. **Headlines (H1)**: 2.5rem, Bold
2. **Subheadings (H2)**: 2rem, Semi-bold
3. **Section Headers (H3)**: 1.5rem, Medium
4. **Body Text**: 1rem, Regular
5. **Small Text**: 0.875rem, Regular

### Font Families

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs | 0.25rem | Fine details |
| sm | 0.5rem | Small gaps |
| md | 1rem | Standard spacing |
| lg | 1.5rem | Section spacing |
| xl | 2rem | Large gaps |
| 2xl | 3rem | Page sections |

## Component Library

### Buttons

- **Primary**: Blue background, white text
- **Secondary**: Outlined style with blue border
- **Tertiary**: Text-only style

### Cards

Standard card component with:
- 8px border radius
- Subtle shadow: `0 2px 8px rgba(0,0,0,0.1)`
- 16px padding

## Implementation

#development #css

```scss
// Design tokens
$colors: (
  'primary': #0066cc,
  'secondary': #4d94ff,
  'neutral-100': #f5f5f5,
  'neutral-900': #333333
);

$spacing: (
  'xs': 0.25rem,
  'sm': 0.5rem,
  'md': 1rem,
  'lg': 1.5rem,
  'xl': 2rem
);
```

---

This design system ensures consistency across all touchpoints and simplifies the development process.