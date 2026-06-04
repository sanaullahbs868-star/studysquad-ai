# Design Brief — StudySquad AI

## Aesthetic Direction
Bold, energetic, youth-forward academic platform. Confident, achievement-driven, community-focused. Dark mode with premium modern tech polish.

## Color Palette (Dark Mode)
| Token | OKLCH | Semantic | Usage |
|-------|-------|----------|-------|
| Primary | 0.65 0.15 195 | Teal | Navigation, active states, learning focus |
| Secondary | 0.58 0.16 280 | Purple | Creative actions, secondary CTAs, creativity |
| Accent | 0.75 0.12 60 | Gold | Achievement badges, rewards, highlights |
| Background | 0.12 0 0 | Charcoal | Page background, deep contrast |
| Card | 0.16 0 0 | Dark slate | Elevated content containers |
| Foreground | 0.95 0 0 | Off-white | Body text, primary readable content |
| Muted | 0.22 0 0 | Dark gray | Secondary text, disabled states |
| Border | 0.25 0 0 | Slate | Dividers, subtle hierarchy |
| Destructive | 0.65 0.19 22 | Red | Warnings, destructive actions |

## Typography
- **Display**: Space Grotesk (geometric, modern, confident — headings, nav, titles)
- **Body**: DM Sans (clean, friendly, readable — content, labels)
- **Mono**: System monospace (code, data labels)

## Structural Zones
| Zone | Background | Treatment | Border |
|------|------------|-----------|--------|
| Header/Nav | 0.16 0 0 (card) | Teal accent bar bottom (3px) | None |
| Content Cards | 0.16 0 0 (card) | Rounded 12px, subtle lift | 0.25 0 0 (border) |
| Interactive Buttons | 0.65 0.15 195 (primary) | Gold accent on hover/active, punchy shadows | None |
| Leaderboard | 0.16 0 0 (card) | Trophy icons, rank tiers, gold accents | Border-left 4px gold |
| Subject Voting | 0.16 0 0 (card) | Voting buttons with checkmarks, dynamic states | Visual weight on active |
| Footer | 0.12 0 0 (background) | Subtle stats, border-top 1px slate | 0.25 0 0 |

## Shape Language
- **Radii**: 12px (cards, moderate), 6px (input/buttons, tighter), 0px (sharp accents on badges)
- **Spacing**: Moderate-tight density (energetic rhythm, not spacious luxury)
- **Shadows**: Subtle elevation on cards, active state lift on buttons

## Component Patterns
- Point badges: gold background with charcoal text, rounded-full, small caps
- Leaderboard tiers: trophy icons, rank numbers in accent color, title in foreground
- Quiz cards: teal primary accents, purple secondary for answer options, gold for correct state
- Voting UI: large checkboxes, dynamic subject cards, visual feedback on selection
- Chat bubbles: card background with subtle left border accent (teal/purple alternating)

## Motion & Interaction
- Smooth transitions (0.3s cubic-bezier) on hover/focus states
- Point earn animations: gold accent pulse on badge reveal
- Leaderboard rank change: subtle slide-in from bottom
- Button focus: ring at 0.65 0.15 195 (teal primary)

## Constraints
- No raw hex, RGB, or named colors
- All colors via OKLCH CSS custom properties
- Token-only styling in components
- Maintain WCAG AA+ contrast in both light and dark modes
- No generic AI gradients or rainbow palettes

## Signature Detail
Gold accent badges on achievement moments (points earned, quiz complete, rank unlock). When paired with teal primary and purple secondary in interactive contexts, creates memorable gamification energy distinct from generic EdTech platforms.
