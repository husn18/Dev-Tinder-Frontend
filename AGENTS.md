# Dev-Tinder Full-Stack Engineering Guidelines

This document details the architectural rules, styling standards, and interface playbooks for building and expanding **Dev-Tinder**. Use this document as the single source of truth for both backend and frontend additions.

---

## 1. Design System & Aesthetics (Linear Specification)

The visual design is modeled after the **Linear.app** design system: a dense, technical, and quietly luxurious product-focused canvas.

### Colors & Hierarchy
- **Canvas (`#010102`)**: Near-pure black default page background with a faint blue tint.
- **Surface Ladder (Canvas → Surface-1 → Surface-2 → Surface-3 → Surface-4)**:
  - **Surface 1 (`#0f1011`)**: Default card containers, pricing lists, and screenshot panels.
  - **Surface 2 (`#141516`)**: Hovered elements and featured card lifts.
  - **Surface 3 (`#18191a`)**: Sub-navigation, headers, and dropdown menus.
  - **Surface 4 (`#191a1b`)**: lifted popovers.
- **Accent Lavender-Blue (`#5e6ad2`)**: The signature brand color. Used **sparingly** and only for focus states, primary CTA buttons, and the brand mark. Never used decoratively.
- **Lighter Lavender (`#828fff`)**: Hover state for primary buttons.
- **Hairlines (`#23252a`)**: 1px thin borders for cards and divisions.
- **Ink / Text**:
  - **Primary Ink (`#f7f8f8`)**: White/light gray for headlines and focused body copy.
  - **Muted Ink (`#d0d6e0`)**: Secondary descriptions and subheadings.
  - **Subtle Ink (`#8a8f98`)**: Deselected items, labels, and footer grids.
  - **Success Green (`#27a644`)**: Used exclusively for status badges and success actions.

### Typography
- **Families**: Use **Inter** (fallback to standard system sans-serif display) for headlines and body text. Use **Geist Mono** or **JetBrains Mono** for code elements and technical tags.
- **Display Tracking**: Aggressive negative letter-spacing on display type:
  - `-3.0px` at 80px
  - `-1.8px` at 56px
  - `-1.0px` at 40px
- **Eyebrow text**: Uses slight positive tracking (`0.4px` at 13px font size) to contrast with negative display typography.
- **Strict rule**: Loading states and actions must end with the horizontal ellipsis character `…` (Alt+0185 or `…`), never triple periods `...`.

### Border Radii & Spacing
- **Base Spacing Grid**: `4px`
- **Border Radii Scale**:
  - `4px` (`rounded-xs`): Status chips
  - `6px` (`rounded-sm`): Inline stack tags
  - `8px` (`rounded-md`): Buttons and text inputs
  - `12px` (`rounded-lg`): Default cards (User profile cards)
  - `16px` (`rounded-xl`): Outer screenshot containers
  - `9999px` (`rounded-full`): Profile avatars

---

## 2. Frontend Interface Guidelines (Vercel Guidelines)

All UI elements must compile with standard accessibility (a11y), form behaviors, and performance best practices.

### Accessibility (a11y)
- **Buttons vs Links**: Action buttons must use `<button>`, navigation routes must use native react-router `<Link>` or `<a>`. Never bind click handlers to static tags like `<div>` or `<span>`.
- **Keyboard Handlers**: Interactive elements with custom click behaviors must define `onKeyDown` and `onKeyUp` triggers (handling Enter/Space).
- **Labels**: All inputs must be bound to a `<label>` (using `htmlFor`) or define an `aria-label`. Icon-only buttons must define an `aria-label`.
- **Decorative Elements**: Non-essential images or icons must define `aria-hidden="true"` or `alt=""`.

### Focus States
- Interactive elements must show a distinct, high-contrast focus ring: `focus-visible:ring-2 focus-visible:ring-[#5e6ad2]`.
- Never use `outline-none` / `outline: none` without providing an aesthetic `:focus-visible` replacement.

### Forms & Input Security
- **Spellcheck**: Explicitly set `spellCheck={false}` on password fields, email fields, usernames, and code tokens.
- **Paste Triggers**: Never intercept or disable paste behaviors (`onPaste` with `preventDefault()` is blocked).
- **Auto-completes**: Fields must contain explicit `name` and standard `autocomplete` categories (e.g. `email`, `current-password`, `new-password`, `tel`). Non-auth inputs should set `autocomplete="off"` to prevent password managers from populating credentials.
- **Submit States**: Submit buttons must stay active until the request starts, showing a loading spinner during execution.
- **Errors**: Render errors adjacent to the invalid input. Automatically focus the first invalid input when a form submission fails.

### Animation & Layout Safety
- **Layout shift (CLS)**: Every `<img>` tag must declare explicit `width` and `height` dimensions.
- **Motion limits**: Respect `prefers-reduced-motion` settings. Animate `transform` and `opacity` values only, and explicitly list transitioned properties (never use `transition: all`).
- **Content Truncation**: Flex children displaying truncated strings must declare `min-w-0` to guarantee text layout truncation is handled correctly.
- **Empty States**: Never display empty wrappers or broken borders when data arrays are empty. Always render fallback descriptions or CTA redirects.

---

## 3. Tailwind CSS v4 Directives

Dev-Tinder uses **Tailwind CSS v4** alongside `@tailwindcss/vite` and **daisyUI v5**.

- **CSS Directives**: The layout loads theme configurations directly within CSS using `@theme` definitions in [index.css](file:///f:/CODING/Dev-tinder/Frontend/src/index.css):
  ```css
  @import "tailwindcss";
  @plugin "daisyui";
  ```
- **Gotchas**:
  - Utility prefixes and responsive states do not require custom configurations in a tailwind config file anymore. Override them directly in the CSS layer using native variables.
  - Important prefixes are placed at the end of utility classes (e.g., `bg-slate-900!`) rather than at the start.

---

## 4. Backend Engineering Patterns (Express.js & Node.js)

### Routing & Controllers
- **Separation of Concerns**: Keep Express routes lean. Business logic must be separated into service layers or model methods (e.g., helper schema methods like `toJWT()` or `toValidatePassword()` in [user.js (Model)](file:///f:/CODING/Dev-tinder/Backend/Dev-Tinder/src/models/user.js)).
- **Response Structure**: Maintain a standardized API response layout:
  ```json
  {
    "message": "Human-readable confirmation text",
    "data": {},
    "error": "Developer details (optional)"
  }
  ```

### Authentication & Sessions
- **Password Protection**: Always hash passwords using bcrypt (minimum cost factor of 10) before saving to the database.
- **Session Tokens**: Pass token state inside `httpOnly` secure cookies. Set `sameSite: 'lax'` (or `'none'` in production) and `secure: true` (production only).
- **Auth Middleware**: [userAuth.js](file:///f:/CODING/Dev-tinder/Backend/Dev-Tinder/src/middlewares/userAuth.js) checks incoming bearer tokens or cookie keys. Set correct 401 statuses for expiration (`TokenExpiredError`) and signatures (`JsonWebTokenError`).

### Inputs & Configurations
- **Sanitizers**: Express routers must validate incoming request bodies. Cast numbers (`age`), stringify phone patterns, and clean arrays (`skills`, `lookingFor`, `projects`) during ingestion.
- **Environment Handling**: Load configurations natively on newer Node.js processes using `process.loadEnvFile()` instead of external script loaders.
- **CORS origins**: Explicitly whitelist origins using an environment array. Never set wildcard `*` headers.
- **Graceful Shutdown**: Listen to process triggers (`SIGTERM`, `SIGINT`) to close database hooks and clean connections.
