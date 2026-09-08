# AETHER | Next-Gen AI E-Commerce & Multi-Theme Design System

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Themes](https://img.shields.io/badge/UI_Themes-10_Aesthetic_Paradigms-purple?style=for-the-badge)](https://github.com/Sharar12/E-Commerce-UI-Design)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **AETHER** is an avant-garde e-commerce showcase demonstrating how cutting-edge spatial hardware, neural wearables, and ambient studio peripherals can be experienced through **10 distinct design aesthetic paradigms** in both **Light and Dark modes** (20 visual states total) — switchable in real time.

---

## 🌟 Key Highlights

- **10 Dynamic Design Aesthetic Paradigms**: Experience the entire e-commerce store seamlessly transformed into Skeuomorphism, Neomorphism, Glassmorphism, Claymorphism, Minimalism, Maximalism, Brutalism, Liquid Glass, Bento Grid, and Spatial UI.
- **Dual Light & Dark Mode for Every Theme**: Fully calibrated color palettes, shadows, borders, surface tokens, and typography for every single aesthetic in both modes.
- **Draggable & Floating Theme Switcher**: Interactive, dockable floating orb and glass palette controller that can be repositioned across the viewport to switch styles instantly.
- **Full E-Commerce Workflow**:
  - **Slide-Over Cart Drawer** with live quantity management, subtotal calculation, free shipping threshold tracker, promo voucher validation, and simulated checkout flow.
  - **Quick View Modal** featuring detailed technical specifications, color swatch selectors, live stock indicators, and quick-add to cart.
  - **Multi-Currency Engine** supporting dynamic conversion and symbol changes across USD (`$`), EUR (`€`), and JPY (`¥`).
  - **AI Bundle Configurator ("Vibe Matcher")** offering pre-configured hardware bundles with custom discounts and direct theme synchronization.
  - **Live Countdown Flash Deal Banner** ticking down in real time for limited hardware drops.
  - **Catalog Filtering & Sorting** with instant category switching, real-time keyword search, and sorting by featured, price, or rating.
  - **Wishlist Engine** with dynamic badge counts and toast notifications.

---

## 🎨 The 10 Design Aesthetic Paradigms

AETHER showcases how fundamentally different UI styles alter product perception and digital atmosphere:

| # | Theme | Visual Signature | Key Characteristics |
|---|---|---|---|
| 1 | **Skeuomorphism** 🪵 | Physical & Tactile | Warm parchment surfaces, physical brass/wood trim, inset beveled buttons, classic serif typography |
| 2 | **Neomorphism** 🔘 | Soft Extruded 3D | Dual-directional soft drop shadows, monochromatic surfaces, recessed tactile inputs and buttons |
| 3 | **Glassmorphism** 🪟 | Frosted Acrylic | Translucent glass panels, `backdrop-blur-md` filters, specular border highlights, dynamic gradient backdrops |
| 4 | **Claymorphism** 🧸 | Pillowy & Playful | Chunky rounded radii, friendly pastel hues, soft inflated 3D elevations, cheerful visual hierarchy |
| 5 | **Minimalism** ◻️ | Swiss Monochrome | High-contrast black/white palette, razor-thin borders, disciplined typography, zero visual clutter |
| 6 | **Maximalism** ⚡ | High-Voltage Neon | Bold energetic gradients, saturated cyan/fuchsia accents, high-contrast borders, expressive personality |
| 7 | **Brutalism** ⬛ | Raw Neo-Brutalist | Pitch-black 3px solid borders, hard 5px unblurred drop shadows, high-contrast sans & mono typography |
| 8 | **Liquid Glass** 💧 | Dynamic Iridescence | Shifting chromatic gradients, liquid flow animation keyframes, luminous glowing specular borders |
| 9 | **Bento Grid** 🍱 | Modular Architecture | Asymmetric structured bento card hierarchy, subtle divider lines, high-density modular information |
| 10 | **Spatial UI** 🌌 | VisionOS & Holographic | Deep cosmic indigo background, floating frosted glass, pulsing ambient neon glows, spatial hardware aesthetic |

---

## ⚡ Interactive Features

### 1. Draggable Floating Theme Switcher
- Floats over the interface and can be dragged anywhere using pointer events.
- Expands into a rich theme dock displaying icons, descriptions, and active status for all 10 aesthetics.
- Quick-toggle button to effortlessly flip between **Light** and **Dark** modes on the fly.

### 2. Slide-Over Cart Drawer & Checkout Engine
- **Itemized Cart Management**: Increase, decrease, or remove items with real-time total recalculations.
- **Free Shipping Progress**: Dynamic progress bar toward free shipping ($150 target or equivalent in EUR/JPY).
- **Promo Code Engine**: Try codes like **`AETHER2026`**, **`LUMINA`**, or **`VIP20`** to unlock a 20% discount.
- **Simulated Checkout**: Place order button with real-time spinner, soundless feedback, and generated tracking confirmation numbers.

### 3. Quick View Modal
- Accessible directly from any product card.
- High-resolution product showcase, full hardware description, and bulleted engineering specifications.
- Interactive colorway selector that persists when added to cart.
- Live inventory telemetry ("Only X left in stock").

### 4. AI Bundle Configurator ("Vibe Matcher")
- Curated gear bundles paired with matching theme recommendations:
  - **Minimalist Executive**: NovaCore Studio Dock + Zenith Ortho Mechanical Rig (Theme: *Minimalism*)
  - **Cyberpunk Battlestation**: Aetheria Apex Pro + Zenith Ortho Mechanical Rig (Theme: *Maximalism*)
  - **Visionary Spatial Nomad**: Lumina Iris Vision Glasses + Chronos Halo Spatial Ring (Theme: *Spatial UI*)
  - **Acoustic Zen Sanctuary**: Orbital Prism Speaker + Aura Lumina Chrono Display (Theme: *Skeuomorphism*)
- Includes one-click **"Sync Vibe & Theme"** to simultaneously activate the aesthetic and prepare the bundle.

### 5. Multi-Currency Engine
- Switch between **USD ($)**, **EUR (€)**, and **JPY (¥)** in the header.
- Automatically calculates and renders all prices, strike-through original prices, bundle savings, and cart totals in the chosen currency.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack ready)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Fonts**: [Geist Sans & Geist Mono](https://vercel.com/font) via `next/font`
- **Image Handling**: `next/image` with configured remote Unsplash domains
- **Custom Animations**: Pure CSS keyframe animations for floating elements, liquid gradient flows, marquees, and spatial pulse glows

---

## 📂 Project Structure

```text
gemini3.8-high/
├── app/
│   ├── components/
│   │   ├── CartDrawer.tsx            # Slide-over cart with promo engine & checkout
│   │   ├── FloatingThemeSwitcher.tsx # Draggable 10-theme & light/dark dock
│   │   └── QuickViewModal.tsx        # Product quick-view modal with specs & colors
│   ├── favicon.ico                   # App favicon
│   ├── globals.css                   # Tailwind v4 import, keyframe animations & scrollbar
│   ├── layout.tsx                    # Root layout with Geist font configurations & metadata
│   ├── page.tsx                      # Main e-commerce landing page & catalog logic
│   ├── productData.ts                # Catalog, categories, reviews, and AI bundle presets
│   ├── themeData.ts                  # Comprehensive design system tokens for all 10 themes
│   └── types.ts                      # TypeScript interfaces (Theme, Product, CartItem, etc.)
├── public/                           # Static assets
├── eslint.config.mjs                 # ESLint 9 configuration
├── next.config.ts                    # Next.js image domain configuration
├── package.json                      # Dependencies and scripts
├── postcss.config.mjs                # PostCSS config for Tailwind v4
├── tsconfig.json                     # TypeScript compiler configuration
└── README.md                         # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: version `18.18.0` or higher (Node `20+` recommended)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sharar12/E-Commerce-UI-Design.git
   cd E-Commerce-UI-Design/gemini3.8-high
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to explore the store.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server on `localhost:3000` |
| `npm run build` | Builds an optimized production bundle |
| `npm run start` | Runs the compiled production build locally |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |

---

## 🏷️ Demo Promo Codes

Test the checkout promo code engine in the Cart Drawer using any of the following voucher codes:

- **`AETHER2026`** — 20% discount on entire cart
- **`LUMINA`** — 20% discount on entire cart
- **`VIP20`** — 20% discount on entire cart

---

## 🤝 Contributing

Contributions, feedback, and theme suggestions are warmly welcomed!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingTheme`)
3. Commit your Changes (`git commit -m 'Add new Cybernetic Glass theme'`)
4. Push to the Branch (`git push origin feature/AmazingTheme`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
