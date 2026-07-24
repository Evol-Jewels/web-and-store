# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Design Direction

- Read and follow [`DESIGN.md`](./DESIGN.md) before creating or changing any customer-facing UI.
- Treat `DESIGN.md` as the source of truth for the storefront's luxury aesthetic, visual language, composition, interaction, responsive behavior, and design-review criteria.
- Keep every new page, section, and component consistent with that system. Extend the existing design language instead of introducing one-off colors, spacing, typography, shapes, or interaction patterns.

## Coding Guidelines

- Keep code simple, with a focus on proper type definitions and best practices for production
- Keep structure modular- limit lines in a file (anything above 300 is a sign of a large or complex file) and reuse utils/helpers wherever possible
- Use less react hooks (useState and uesEffect) and try to ask if the data already exists in a state, reuse and try to derive before introducing a new state
- Write simple react, keep it clean, no complex logic inside components, generic logic outside the components and ideally in a reusable utility function and specific func outside the component that remains same across re-renders.
- Use shadcn/ui components; do not recreate components unless required
- Keep theme in mind while making design changes; don't mess with global theme, focus on making items clean, aligned, and well-spaced throughout, use existing theme variables and components for consistency, don't hardcode colors or styles
- Don't mess with types; avoid using `any`, avoid complicated types - there's always a simple and better solution; search and find for the simplest
- Do not add emojis or unnecessary content or headings; keep things simple, use already installed icon library for icons
- Use pnpm as the package manager for installs and builds
- Avoid adding comments unless explicitly requested
