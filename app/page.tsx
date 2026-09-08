"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Theme, Product, CartItem, Currency, ColorMode } from "./types";
import { THEMES } from "./themeData";
import { PRODUCTS, CATEGORIES, REVIEWS, AI_PRESETS } from "./productData";
import FloatingThemeSwitcher from "./components/FloatingThemeSwitcher";
import QuickViewModal from "./components/QuickViewModal";
import CartDrawer from "./components/CartDrawer";

// Currency Conversion Rates and Symbols
const CURRENCY_CONFIG: Record<Currency, { rate: number; symbol: string }> = {
  USD: { rate: 1, symbol: "$" },
  EUR: { rate: 0.92, symbol: "€" },
  JPY: { rate: 154, symbol: "¥" },
};

export default function Home() {
  // Theme and Color Mode state (defaulting to Spatial UI in Dark Mode)
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[9]); // Spatial UI
  const [colorMode, setColorMode] = useState<ColorMode>("dark");

  const themeClasses = currentTheme.modes[colorMode];
  const themeVariables = currentTheme.variables[colorMode];

  const toggleColorMode = () => {
    setColorMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      showToast(`Appearance: ${next === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}`);
      return next;
    });
  };

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["aether-apex-pro"]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters and Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [currency, setCurrency] = useState<Currency>("USD");

  // Interactive Feature States
  const [heroColorIndex, setHeroColorIndex] = useState(0);
  const [activeVibeId, setActiveVibeId] = useState("spatial");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterClaimedCode, setNewsletterClaimedCode] = useState<string | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Live Flash Deal Countdown Timer (Ticks every second)
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currencyRate = CURRENCY_CONFIG[currency].rate;
  const currencySymbol = CURRENCY_CONFIG[currency].symbol;

  // Cart Management Handlers
  const handleAddToCart = (product: Product, quantity = 1, color?: string) => {
    const chosenColor = color || product.colors[0]?.name || "Default";
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === chosenColor
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor: chosenColor }];
    });
    showToast(`Added ${quantity}x "${product.name}" to cart!`);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
    } else {
      setCart((prev) => {
        const updated = [...prev];
        updated[index].quantity = newQty;
        return updated;
      });
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast("Item removed from cart");
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from Wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist ❤️");
        return [...prev, productId];
      }
    });
  };

  // Switch Theme Handler with Toast
  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    showToast(`Active Style: ${theme.name} (${theme.tag})`);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - a.price;
      if (sortOption === "rating") return b.rating - a.rating;
      return 0; // featured
    });
  }, [selectedCategory, searchQuery, sortOption]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Active AI Vibe Preset Data
  const activeVibe = useMemo(() => {
    return AI_PRESETS.find((p) => p.id === activeVibeId) || AI_PRESETS[0];
  }, [activeVibeId]);

  const handleAddVibeBundle = () => {
    activeVibe.products.forEach((name) => {
      const prod = PRODUCTS.find((p) => p.name === name);
      if (prod) {
        handleAddToCart(prod, 1);
      }
    });
    showToast(`Added ${activeVibe.title} Bundle to Cart!`);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes("@")) {
      setNewsletterClaimedCode("VIP-AETHER15");
      showToast("VIP Welcome Pass Unlocked! 15% OFF");
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${themeClasses.pageBg} font-sans relative select-text`}
      style={themeVariables as React.CSSProperties}
    >
      {/* Background Ambient Glow Elements (Active in Glassmorphism, Liquid Glass, Spatial UI) */}
      {(currentTheme.id === "glassmorphism" ||
        currentTheme.id === "liquid-glass" ||
        currentTheme.id === "spatial-ui") && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] animate-pulse" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[140px] animate-pulse [animation-delay:2s]" />
          <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px]" />
        </div>
      )}

      {/* 1. TOP TICKER / MARQUEE ANNOUNCEMENT BAR */}
      <div className="relative z-20 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md text-xs font-mono py-2 px-4 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE
          </span>
          <div className="whitespace-nowrap flex gap-6 text-[11px] opacity-80">
            <span>⚡ FLASH LAUNCH: 25% OFF Spatial Audio with code <strong>AETHER2026</strong></span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">✈️ Free Global Express Shipping on orders over $150</span>
            <span className="hidden lg:inline">•</span>
            <span className="hidden lg:inline">🛡️ 30-Day Risk-Free Studio Trial on all hardware</span>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className="opacity-60 text-[10px]">CURRENCY:</span>
          {(["USD", "EUR", "JPY"] as Currency[]).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                currency === curr
                  ? "bg-black/20 dark:bg-white/20 text-current shadow-sm"
                  : "opacity-50 hover:opacity-100"
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* 2. STICKY HEADER & NAVIGATION */}
      <header className={`sticky top-0 z-40 transition-all ${themeClasses.nav}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
              Λ
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight ${themeClasses.heading}`}>
                AETHER
              </span>
              <span className="block text-[10px] font-mono tracking-widest uppercase opacity-60">
                AI DESIGN LAB
              </span>
            </div>
          </div>

          {/* Nav Categories */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {["All", "Audio", "Wearables", "Computing", "Optics", "Smart Home"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`transition-colors py-1 relative ${
                  selectedCategory === cat
                    ? "font-bold border-b-2 border-current"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {cat}
              </button>
            ))}
            <a
              href="#ai-configurator"
              className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 hover:scale-105 transition-all font-semibold"
            >
              ✨ AI Configurator
            </a>
          </nav>

          {/* Search, Wishlist & Cart Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden sm:block w-48 md:w-64">
              <input
                type="text"
                placeholder="Search neural gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-2 pl-9 pr-8 text-xs ${themeClasses.input}`}
              />
              <span className="absolute left-3 top-2.5 opacity-50 text-xs">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs opacity-50 hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleColorMode}
              className="p-2.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-mono"
              title={`Switch to ${colorMode === "dark" ? "Light" : "Dark"} Mode`}
            >
              <span className="text-lg">{colorMode === "dark" ? "🌙" : "☀️"}</span>
              <span className="hidden md:inline font-bold uppercase text-[10px] opacity-80">{colorMode}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => showToast(`Wishlist contains ${wishlist.length} saved items`)}
              className="relative p-2.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Saved items"
            >
              <span className="text-lg">❤️</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 font-bold text-xs shadow-md transition-all ${themeClasses.buttonPrimary}`}
            >
              <span>🛍️</span>
              <span className="hidden sm:inline">Cart</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-mono">
                {totalCartCount}
              </span>
            </button>

            {/* Current Theme Pill Indicator */}
            <div
              className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold ${themeClasses.badge}`}
              title="Current UI Design Paradigm"
            >
              <span>{currentTheme.icon}</span>
              <span className="truncate max-w-[100px]">{currentTheme.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. IMMERSIVE HERO SECTION */}
      <section className="relative z-10 pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Hero Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <span>{currentTheme.icon}</span>
              <span>Theme: {currentTheme.name}</span>
              <span className="opacity-40">•</span>
              <span className="text-cyan-500 dark:text-cyan-400">Next.js 16 + Tailwind v4</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight ${themeClasses.heading}`}>
              Spatial Hardware Engineered for the <span className="underline decoration-indigo-500 decoration-wavy">Neural Era</span>.
            </h1>

            <p className={`text-base sm:text-lg max-w-2xl leading-relaxed ${themeClasses.textMuted}`}>
              Experience zero-latency head-tracking audio, titanium gesture controllers, and micro-OLED spatial optics. Transformed on-the-fly across 10 authentic visual design systems.
            </p>

            {/* Dual CTAs and Social Proof */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const flagship = PRODUCTS[0];
                  handleAddToCart(flagship, 1);
                }}
                className={`py-3.5 px-8 rounded-xl text-sm font-bold shadow-xl transition-all ${themeClasses.buttonPrimary}`}
              >
                Pre-Order Apex Pro • {currencySymbol}{(499 * currencyRate).toFixed(0)}
              </button>

              <button
                onClick={() => setQuickViewProduct(PRODUCTS[0])}
                className={`py-3.5 px-6 rounded-xl text-sm font-semibold transition-all ${themeClasses.buttonSecondary}`}
              >
                🔍 Inspect Specs
              </button>
            </div>

            {/* Live Social Proof Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-black/10 dark:border-white/10 max-w-lg">
              <div>
                <span className="block text-2xl font-extrabold font-mono">54,200+</span>
                <span className="text-xs opacity-70">Dispatched Globally</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold font-mono text-amber-500">4.96 ★</span>
                <span className="text-xs opacity-70">Over 1,200 Reviews</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold font-mono text-emerald-500">0.4ms</span>
                <span className="text-xs opacity-70">Neural Spatial Latency</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Flagship 3D Card Showcase */}
          <div className="lg:col-span-5">
            <div className={`p-6 sm:p-7 ${themeClasses.card} relative overflow-hidden transition-all group`}>
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-mono font-bold rounded-full uppercase ${themeClasses.badge}`}>
                  FLAGSHIP 2026
                </span>
                <span className="text-xs font-mono opacity-70 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock (14 Units)
                </span>
              </div>

              {/* Showcase Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/10 dark:bg-black/40 border border-black/10 dark:border-white/10 mb-5">
                <Image
                  src={PRODUCTS[0].image}
                  alt={PRODUCTS[0].name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                />

                {/* Floating Telemetry Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs border border-white/20 flex items-center justify-between">
                  <div>
                    <span className="block font-mono text-[10px] text-cyan-300">DSP ENGINE</span>
                    <span className="font-bold">Dual Neural Spatial Core</span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-[10px] text-cyan-300">BATTERY</span>
                    <span className="font-bold">96 Hours</span>
                  </div>
                </div>
              </div>

              {/* Color Swatch Selector for Hero Product */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className={`text-xl font-bold ${themeClasses.heading}`}>
                    {PRODUCTS[0].name}
                  </h3>
                  <p className="text-xs opacity-70">
                    Finish: {PRODUCTS[0].colors[heroColorIndex]?.name}
                  </p>
                </div>

                <div className="flex gap-2">
                  {PRODUCTS[0].colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => setHeroColorIndex(i)}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        heroColorIndex === i
                          ? "ring-2 ring-indigo-500 scale-110 border-white"
                          : "border-black/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Row: Price and Quick Add */}
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                <div>
                  <span className="text-2xl font-black font-mono">
                    {currencySymbol}{(PRODUCTS[0].price * currencyRate).toFixed(0)}
                  </span>
                  <span className="text-xs line-through opacity-50 ml-2 font-mono">
                    {currencySymbol}{(599 * currencyRate).toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={() => handleAddToCart(PRODUCTS[0], 1, PRODUCTS[0].colors[heroColorIndex]?.name)}
                  className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all ${themeClasses.buttonPrimary}`}
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODULAR BENTO CATEGORIES SHOWCASE */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 dark:border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider opacity-60">
              SYSTEM DIVISIONS
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeClasses.heading}`}>
              Explore Hardware Architectures
            </h2>
          </div>
          <span className="text-xs font-mono opacity-70">
            Click any division to filter catalog
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-5 text-left rounded-2xl border transition-all ${themeClasses.card} ${
                  isSelected ? "ring-2 ring-indigo-500 border-indigo-500 scale-[1.02]" : ""
                } hover:-translate-y-1`}
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-sm mb-1">{cat.name}</h3>
                <p className="text-[11px] opacity-70 mb-3 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-black/10 dark:border-white/10">
                  <span className="opacity-60">{cat.count}</span>
                  <span className="font-bold text-indigo-500 dark:text-indigo-400">&rarr;</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. CURATED PRODUCT CATALOG WITH FILTER TABS & SORT */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 dark:border-white/10">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider opacity-60">
              PRECISION CATALOG
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold ${themeClasses.heading}`}>
              Curated Hardware Offerings
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs">
              {["All", "Audio", "Wearables", "Computing", "Optics", "Smart Home"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedCategory === cat
                      ? "bg-white dark:bg-zinc-800 font-bold shadow-sm"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as "featured" | "price-asc" | "price-desc" | "rating")}
              aria-label="Sort products"
              className={`text-xs py-2 px-3 rounded-xl border ${themeClasses.input}`}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <span className="text-4xl block mb-2">🔍</span>
            <h3 className="text-lg font-bold">No hardware items match your query</h3>
            <p className="text-xs opacity-60 mt-1">
              Try clearing your search query or selecting a different division.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 text-xs font-bold rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const currentPrice = Math.round(product.price * currencyRate);
              const originalPrice = product.originalPrice
                ? Math.round(product.originalPrice * currencyRate)
                : null;
              const isWishlisted = wishlist.includes(product.id);

              return (
                <div
                  key={product.id}
                  className={`flex flex-col justify-between p-5 rounded-2xl transition-all group ${themeClasses.card} ${themeClasses.cardHover}`}
                >
                  {/* Top Image Box */}
                  <div>
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/10 dark:bg-white/5 mb-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <span
                          className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full uppercase ${themeClasses.badge}`}
                        >
                          {product.badge}
                        </span>
                      )}

                      {/* Wishlist Heart Toggle */}
                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
                          isWishlisted
                            ? "bg-pink-500 text-white scale-110"
                            : "bg-black/40 text-white/80 hover:text-white hover:scale-110"
                        }`}
                        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      {/* Quick View Hover Button */}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute inset-x-4 bottom-3 py-2 px-3 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/90"
                      >
                        <span>👁️ Quick Inspect</span>
                      </button>
                    </div>

                    {/* Meta and Title */}
                    <div className="flex items-center justify-between text-[11px] opacity-75 font-mono mb-1">
                      <span>{product.category}</span>
                      <span className="text-amber-500 font-bold">
                        ★ {product.rating.toFixed(2)}
                      </span>
                    </div>

                    <h3 className={`font-bold text-base leading-snug mb-1 ${themeClasses.heading}`}>
                      {product.name}
                    </h3>
                    <p className="text-xs opacity-70 line-clamp-2 mb-3 leading-relaxed">
                      {product.tagline}
                    </p>

                    {/* Color Dots */}
                    <div className="flex items-center gap-1.5 mb-4">
                      {product.colors.map((c) => (
                        <span
                          key={c.name}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Price & Add to Cart */}
                  <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black font-mono">
                          {currencySymbol}{currentPrice.toLocaleString()}
                        </span>
                        {originalPrice && (
                          <span className="text-[11px] line-through opacity-50 font-mono">
                            {currencySymbol}{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product, 1)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${themeClasses.buttonPrimary}`}
                    >
                      <span>+ Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. FLASH DEAL LIVE COUNTDOWN BANNER */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`p-8 sm:p-10 rounded-3xl ${themeClasses.promoBanner} flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl`}>
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="inline-block px-3 py-1 text-xs font-mono font-bold rounded-full bg-red-500 text-white animate-pulse">
              LIMITED FLASH DROP
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${themeClasses.heading}`}>
              Quantum Ecosystem Bundle (Save 35%)
            </h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Unlock the Aetheria Apex Pro + Chronos Halo Spatial Ring at exclusive studio pricing. Valid only until the global countdown expires.
            </p>

            {/* Inventory Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span>Reserved Units: 82%</span>
                <span className="text-red-500 font-bold">Only 18 Units Left</span>
              </div>
              <div className="w-full h-2 bg-black/20 dark:bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-[82%]" />
              </div>
            </div>
          </div>

          {/* Countdown Clock and Voucher CTA */}
          <div className="flex flex-col items-center gap-5">
            <div className="flex gap-3 text-center">
              {[
                { label: "HOURS", val: timeLeft.hours },
                { label: "MINUTES", val: timeLeft.minutes },
                { label: "SECONDS", val: timeLeft.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3.5 sm:p-4 rounded-2xl bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/20 min-w-[75px]"
                >
                  <span className="block text-2xl sm:text-3xl font-black font-mono">
                    {String(item.val).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest opacity-70">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText("AETHER2026");
                showToast("Voucher code 'AETHER2026' copied to clipboard!");
              }}
              className={`py-3.5 px-8 rounded-xl font-bold text-sm shadow-xl transition-all ${themeClasses.buttonPrimary}`}
            >
              📋 Copy 35% Voucher: AETHER2026
            </button>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE AI STUDIO / SETUP VIBE CONFIGURATOR */}
      <section id="ai-configurator" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-500 dark:text-indigo-400 font-bold">
            SMART SETUP PAIRING
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mt-1 ${themeClasses.heading}`}>
            AI Spatial Setup Configurator
          </h2>
          <p className="text-sm opacity-70 mt-2 leading-relaxed">
            Select your creative environment to receive calibrated hardware pairings and instant bundle discounts.
          </p>
        </div>

        {/* 4 Vibe Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-4xl mx-auto">
          {AI_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActiveVibeId(preset.id)}
              className={`p-4 rounded-2xl border transition-all text-center ${
                activeVibeId === preset.id
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg scale-105"
                  : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              <span className="text-2xl block mb-1">{preset.icon}</span>
              <span className="text-xs font-bold block">{preset.title}</span>
            </button>
          ))}
        </div>

        {/* Active Vibe Hardware Match Box */}
        <div className={`p-8 rounded-3xl ${themeClasses.card} max-w-4xl mx-auto border transition-all`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-mono text-indigo-500 dark:text-indigo-400 uppercase font-bold">
                RECOMMENDED BUNDLE
              </span>
              <h3 className={`text-2xl font-bold ${themeClasses.heading}`}>
                {activeVibe.title} Studio Rig
              </h3>
              <p className="text-xs opacity-70 max-w-md leading-relaxed">
                {activeVibe.tagline}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                {activeVibe.products.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg bg-black/10 dark:bg-white/10 font-medium"
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center md:text-right shrink-0">
              <div className="text-3xl font-extrabold font-mono mb-1">
                {currencySymbol}{(activeVibe.bundlePrice * currencyRate).toFixed(0)}
              </div>
              <span className="text-xs font-mono text-emerald-500 font-bold block mb-3">
                SAVE {currencySymbol}{(activeVibe.savings * currencyRate).toFixed(0)} WITH BUNDLE
              </span>

              <button
                onClick={handleAddVibeBundle}
                className={`py-3 px-6 rounded-xl text-xs font-bold shadow-lg transition-all ${themeClasses.buttonPrimary}`}
              >
                Add Complete Bundle to Cart ⚡
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TRUST PILLARS & GUARANTEES */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 dark:border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "🌱",
              title: "Carbon-Neutral Global Air",
              desc: "100% offset logistics through certified planetary reforestation partners.",
            },
            {
              icon: "🛡️",
              title: "30-Day Risk-Free Trial",
              desc: "Test hardware in your studio. Full refund if not utterly blown away.",
            },
            {
              icon: "🤖",
              title: "24/7 AI Concierge",
              desc: "Instant firmware diagnosis, audio calibration, and priority replacement.",
            },
            {
              icon: "🔒",
              title: "3-Year Titanium Care",
              desc: "Comprehensive accidental coverage on all titanium and optical glass components.",
            },
          ].map((pillar, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border ${themeClasses.card} text-center space-y-2`}
            >
              <span className="text-3xl block">{pillar.icon}</span>
              <h4 className="font-bold text-sm">{pillar.title}</h4>
              <p className="text-xs opacity-70 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VERIFIED CUSTOMER REVIEWS WALL */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-black/10 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest opacity-60">
            COMMUNITY TESTIMONIALS
          </span>
          <h2 className={`text-3xl font-extrabold mt-1 ${themeClasses.heading}`}>
            Trusted by Creators Across 40+ Nations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between ${themeClasses.card}`}
            >
              <div>
                <div className="flex items-center text-amber-500 text-sm mb-3">
                  {"★".repeat(rev.rating)}
                </div>
                <p className="text-xs leading-relaxed opacity-85 italic mb-6">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black/10 shrink-0">
                  <Image src={rev.avatar} alt={rev.author} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-bold text-xs">{rev.author}</h5>
                    {rev.verified && (
                      <span className="text-cyan-500 text-[10px]" title="Verified Buyer">✓</span>
                    )}
                  </div>
                  <span className="text-[10px] opacity-60 block font-mono">{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. VIP NEWSLETTER SUBSCRIPTION CARD */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className={`p-8 sm:p-12 rounded-3xl text-center border ${themeClasses.card} shadow-xl relative overflow-hidden`}>
          <span className="text-3xl block mb-2">📬</span>
          <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${themeClasses.heading}`}>
            Join the Aether Studio Inner Circle
          </h2>
          <p className="text-xs sm:text-sm opacity-70 max-w-md mx-auto mb-6 leading-relaxed">
            Receive exclusive drops, invite-only firmware alphas, and an instant 15% discount voucher code.
          </p>

          {newsletterClaimedCode ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-sm inline-block animate-in zoom-in-95">
              🎉 VIP Code Unlocked: <strong>{newsletterClaimedCode}</strong> (Use at checkout for 15% off)
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your studio email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className={`flex-1 py-3 px-4 text-xs rounded-xl ${themeClasses.input}`}
              />
              <button
                type="submit"
                className={`py-3 px-6 rounded-xl text-xs font-bold transition-all shrink-0 ${themeClasses.buttonPrimary}`}
              >
                Claim 15% Pass
              </button>
            </form>
          )}

          <span className="block text-[10px] opacity-50 font-mono mt-4">
            Zero spam. Unsubscribe with 1-click anytime.
          </span>
        </div>
      </section>

      {/* 11. RICH COMPREHENSIVE FOOTER */}
      <footer className={`mt-16 border-t transition-all ${themeClasses.footer}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
            {/* Brand Manifesto */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  Λ
                </div>
                <span className="font-extrabold text-lg tracking-tight">AETHER AI</span>
              </div>
              <p className="text-xs opacity-70 max-w-sm leading-relaxed">
                Pioneering spatial hardware interfaces, continuous biometric intelligence, and multi-paradigm reactive design systems.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono pt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Global AI Logistics Operational (100%)</span>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h5 className="text-xs font-mono uppercase tracking-wider font-bold mb-3">Hardware</h5>
              <ul className="space-y-2 text-xs opacity-70">
                <li><button onClick={() => setSelectedCategory("Audio")} className="hover:opacity-100">Neural Audio</button></li>
                <li><button onClick={() => setSelectedCategory("Wearables")} className="hover:opacity-100">Spatial Rings</button></li>
                <li><button onClick={() => setSelectedCategory("Computing")} className="hover:opacity-100">Studio Docks</button></li>
                <li><button onClick={() => setSelectedCategory("Optics")} className="hover:opacity-100">Micro-OLED Optics</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-mono uppercase tracking-wider font-bold mb-3">Paradigms</h5>
              <ul className="space-y-2 text-xs opacity-70">
                <li><button onClick={() => handleThemeChange(THEMES[0])} className="hover:opacity-100">Skeuomorphism</button></li>
                <li><button onClick={() => handleThemeChange(THEMES[1])} className="hover:opacity-100">Neomorphism</button></li>
                <li><button onClick={() => handleThemeChange(THEMES[2])} className="hover:opacity-100">Glassmorphism</button></li>
                <li><button onClick={() => handleThemeChange(THEMES[6])} className="hover:opacity-100">Brutalism</button></li>
                <li><button onClick={() => handleThemeChange(THEMES[9])} className="hover:opacity-100">Spatial UI</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-mono uppercase tracking-wider font-bold mb-3">Security & Legal</h5>
              <ul className="space-y-2 text-xs opacity-70">
                <li><a href="#" className="hover:opacity-100">Privacy Manifesto</a></li>
                <li><a href="#" className="hover:opacity-100">Terms of Service</a></li>
                <li><a href="#" className="hover:opacity-100">Titanium Warranty</a></li>
                <li><a href="#" className="hover:opacity-100">Compliance & FCC</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs opacity-60 font-mono gap-4">
            <div>
              © 2026 AETHER LABS, INC. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>💳 VISA</span>
              <span>💳 MASTERCARD</span>
              <span> APPLE PAY</span>
              <span>₿ BITCOIN</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 12. CIRCULAR MOVABLE FLOATING THEME SWITCHER */}
      <FloatingThemeSwitcher
        currentTheme={currentTheme}
        colorMode={colorMode}
        onSelectTheme={handleThemeChange}
        onToggleColorMode={toggleColorMode}
      />

      {/* 13. QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        themeClasses={themeClasses}
        currencyRate={currencyRate}
        currencySymbol={currencySymbol}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 14. SLIDE-OVER CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        themeClasses={themeClasses}
        currencyRate={currencyRate}
        currencySymbol={currencySymbol}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
      />

      {/* 15. TOAST NOTIFICATION SYSTEM */}
      {toast && toast.visible && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl bg-zinc-950 text-white border border-white/20 shadow-2xl flex items-center gap-3 text-xs font-mono animate-in slide-in-from-bottom-5 duration-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
