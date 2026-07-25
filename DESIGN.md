# Design Direction

This storefront should feel like a contemporary luxury maison: quiet, editorial, precise, and emotionally expressive. The interface should recede so that the products, materials, photography, and story carry the visual weight.

Use this document as the source of truth for all customer-facing design work. Extend the established system instead of introducing a new aesthetic per page or component.

## Core Principles

### Quiet Luxury

- Prefer restraint over decoration.
- Create value through typography, proportion, imagery, material detail, and generous negative space.
- Every element should feel intentional. Remove anything that does not improve comprehension, atmosphere, or conversion.
- Avoid visual tropes associated with mass-market ecommerce: promotional clutter, loud badges, bright sale colors, crowded cards, excessive shadows, and attention-seeking effects.

### Editorial Storytelling

- Treat pages as composed narratives, not collections of interchangeable sections.
- Lead with one strong visual or message, then reveal details progressively.
- Alternate product-focused sections with human, material, craft, or atmospheric imagery.
- Use asymmetry and varied image scale to create rhythm while keeping the underlying grid disciplined.
- Let collection and product stories communicate emotion, inspiration, craft, and form before relying on specifications.

### Product as the Focus

- Give product imagery ample space and clean surroundings.
- Keep product cards visually quiet. Names, category, material, and price should support the image rather than compete with it.
- Use detail photography, macro crops, worn scale, and multiple angles where they improve confidence.
- Preserve consistent image ratios within a product grid. Editorial modules may intentionally break the grid.

### Consistency

- Reuse theme tokens, shadcn/ui primitives, spacing patterns, typography roles, interaction behavior, and image treatments.
- A new element should look native to the existing experience.
- Do not hardcode one-off colors, radii, shadows, or spacing when an appropriate theme token or shared variant exists.
- Do not imitate another brand literally. Apply these principles in an original system appropriate to this storefront.

## Visual Language

### Color

- Build the primary experience from warm white, soft stone, charcoal, ink black, and restrained neutral greys.
- Use black and near-black sections selectively for cinematic story moments, evening imagery, or strong transitions.
- Let products, gemstones, metals, skin tones, and photography provide most of the color.
- If an accent color is required, it should be muted, material-inspired, and used sparingly.
- Reserve semantic colors for status, validation, warnings, and destructive actions.
- Avoid saturated brand blocks, playful multicolor palettes, gradients, and color used only to create excitement.

All colors must come from semantic theme variables such as `background`, `foreground`, `muted`, `border`, `primary`, and purpose-specific tokens added to the theme.

### Typography

- Typography should feel refined, composed, and highly legible.
- Use a distinctive editorial display face for major campaign or collection statements when the project font system supports it.
- Use a clean, restrained sans-serif for navigation, product data, controls, and body copy.
- Create hierarchy through scale, weight, case, tracking, and whitespace rather than multiple decorative fonts.
- Use uppercase with generous letter spacing for navigation, eyebrow labels, section labels, and short calls to action.
- Keep long body copy in sentence case with comfortable line height and a controlled measure.
- Avoid oversized startup-style headlines, excessively bold weights, compressed tracking, and tiny low-contrast text.

Suggested roles:

- Display: emotional campaign or collection statement.
- Page title: clear product, category, or editorial title.
- Section title: concise and restrained.
- Eyebrow: small uppercase label with wide tracking.
- Body: readable supporting narrative.
- Utility: compact product metadata and controls.

### Spacing and Layout

- Negative space is a primary design material.
- Use a consistent responsive container and grid across the storefront.
- Favor fewer, larger sections over many tightly stacked modules.
- Allow hero and editorial media to reach the viewport edge when it strengthens immersion.
- Use balanced whitespace around headings, controls, and product information.
- Keep commercial actions easy to find even when the surrounding composition is spacious.
- On small screens, preserve hierarchy and breathing room without forcing desktop-scale gaps or excessive scrolling.

### Shape, Borders, and Depth

- Prefer square or subtly softened geometry.
- Use pill shapes only where they have a clear role, such as compact primary actions, filters, or status controls.
- Avoid large playful corner radii and bubble-like cards.
- Use thin, low-contrast borders to establish structure.
- Avoid heavy drop shadows. Use tonal separation, hairlines, layering, and imagery for depth.
- Dividers should be sparse and purposeful.

### Imagery

- Photography should feel art-directed, tactile, and premium.
- Favor soft natural light, controlled studio light, strong shadow, macro material detail, and composed human crops.
- Combine clean product still life with atmospheric lifestyle imagery.
- Avoid generic stock imagery, artificial-looking renders, busy backgrounds, and inconsistent color grading.
- Use intentional focal points and provide safe areas for overlaid text.
- Do not place text over imagery unless contrast remains excellent at every breakpoint.

## Components

### Header and Navigation

- Keep the header visually light with a clear wordmark, concise navigation, and restrained utility icons.
- Appointment or concierge access may receive quiet prominence for high-consideration purchases.
- Announcement bars should contain one useful message at a time and must not dominate the page.
- Mega menus should be spacious, organized, and image-led without becoming dense.

### Buttons and Links

- Primary actions should use decisive monochrome contrast.
- Secondary actions should use borders, text, or subtle tonal fills.
- Keep labels short and specific: `Explore the collection`, `View details`, `Add to bag`, or `Book an appointment`.
- Avoid multiple equally prominent calls to action in one area.
- Hover and pressed states should feel controlled through subtle color, opacity, underline, or motion changes.

### Product Cards and Grids

- Use clean, consistent product imagery with minimal surrounding chrome.
- Keep metadata concise and aligned.
- Show promotional labels only when genuinely useful.
- Favor two to four columns depending on viewport and image needs; do not compress luxury products into dense grids.
- Filters and sorting should be easy to locate but visually quiet.
- Editorial imagery or collection stories may interrupt long grids to restore rhythm.

### Product Detail Pages

- On desktop, balance a generous media gallery with a calm, clearly structured purchase panel.
- Keep name, price, variation, size, personalization, availability, and primary action immediately understandable.
- Make the purchase action visually strong without turning the page into a generic conversion template.
- Organize specifications, certification, sizing, care, delivery, and returns using progressive disclosure.
- Follow commerce information with inspiration, craftsmanship, responsibility, gifting, and concierge content where relevant.
- Use sticky purchase controls only when they improve usability and do not obscure content.

### Forms, Dialogs, and Overlays

- Forms should be sparse, clearly labeled, and generous enough to feel considered.
- Dialogs should be proportionate to their task and should not overwhelm the brand experience.
- Consent and promotional overlays must not obscure the entire first impression when a less intrusive compliant treatment is possible.
- Validation and error states must remain direct and accessible.

### Footer

- Use a dark, quiet footer with clearly grouped customer care, brand, and legal navigation.
- Keep newsletter signup concise.
- Certification and responsibility marks should appear as supporting proof, not decoration.

## Motion

- Motion should feel slow, smooth, and deliberate.
- Favor subtle image reveals, restrained fades, gentle transforms, and carefully timed page transitions.
- Product hover behavior may reveal another angle or create slight movement without making the grid unstable.
- Avoid bounce, elastic motion, constant animation, parallax that harms readability, and effects added only for novelty.
- Respect `prefers-reduced-motion`.
- Never delay access to essential content or purchasing controls for animation.

## Content and Voice

- Use concise, confident, emotionally literate language.
- Focus on form, material, craft, meaning, provenance, and the experience of ownership.
- Avoid hype, filler headings, excessive exclamation marks, urgency tactics, and generic luxury clichés.
- Pair evocative campaign copy with concrete product and service information.
- Do not add emojis.

## Accessibility and Usability

Luxury must not come at the expense of clarity.

- Maintain WCAG AA contrast for text and controls.
- Keep body and utility text comfortably readable.
- Provide visible keyboard focus states that fit the monochrome system.
- Use semantic structure, descriptive labels, meaningful alt text, and predictable navigation.
- Make touch targets at least 44 by 44 CSS pixels where practical.
- Do not communicate state through color alone.
- Ensure product selection, cart, checkout, filters, and dialogs work with keyboard and assistive technology.

## Responsive Behavior

- Design mobile layouts intentionally rather than shrinking desktop compositions.
- Preserve image quality, hierarchy, and calm spacing on small screens.
- Stack editorial compositions in narrative order.
- Keep product names, price, selected options, and purchase actions easy to reach.
- Avoid oversized empty areas, clipped typography, inaccessible image overlays, and horizontal scrolling.

## Implementation Rules

- Use existing shadcn/ui components and shared variants before creating new primitives.
- Use semantic theme variables and shared utilities; do not introduce isolated visual systems.
- Keep presentation logic simple and components modular.
- Establish reusable variants for repeated luxury treatments such as eyebrow labels, editorial sections, product media, and monochrome actions.
- Test light and dark surfaces, all responsive breakpoints, long content, empty states, loading states, errors, keyboard navigation, and reduced motion.
- Review the entire page composition after changing an individual component. Local polish must support the overall rhythm.

## Avoid

- Bright promotional colors and permanent sale styling.
- Large orange or saturated accent panels.
- Generic SaaS layouts and dashboard-like cards.
- Excessive rounded containers, floating pills, gradients, glassmorphism, and heavy shadows.
- Decorative icons where text is clearer.
- Dense product grids and information overload.
- Tiny grey copy that appears elegant but is difficult to read.
- Repetitive section templates with no narrative purpose.
- Loud or playful micro-interactions.
- Inconsistent photography, spacing, typography, or control styling between pages.

## Design Review Checklist

Before completing customer-facing UI work, confirm:

- Does the result feel quiet, premium, editorial, and intentional?
- Is the product or story the primary visual focus?
- Does it use the established theme tokens and shared components?
- Is the composition spacious without becoming empty or inefficient?
- Are typography roles and image treatments consistent with nearby pages?
- Is there one clear primary action?
- Are commercial details discoverable and trustworthy?
- Does the design remain elegant and usable on mobile?
- Are contrast, focus, touch targets, motion preferences, and semantics accessible?
- Has unnecessary decoration, copy, and interface chrome been removed?
