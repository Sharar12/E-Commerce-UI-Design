"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, ThemeClasses } from "../types";

interface QuickViewModalProps {
  product: Product | null;
  themeClasses: ThemeClasses;
  currencyRate: number;
  currencySymbol: string;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color: string) => void;
}

export default function QuickViewModal({
  product,
  themeClasses,
  currencyRate,
  currencySymbol,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors[0]?.name || "Default"
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentPrice = Math.round(product.price * currencyRate);
  const originalPrice = product.originalPrice
    ? Math.round(product.originalPrice * currencyRate)
    : null;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto ${themeClasses.card} p-6 sm:p-8 transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/20 hover:bg-black/40 text-current transition-colors z-10"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Product Image Showcase */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-lg bg-black/5">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
            {product.badge && (
              <span
                className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase rounded-full ${themeClasses.badge}`}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider opacity-75">
                  {product.category}
                </span>
                <span className="opacity-40">•</span>
                <div className="flex items-center text-amber-500 text-xs font-bold">
                  ★ {product.rating.toFixed(2)} ({product.reviewCount} reviews)
                </div>
              </div>

              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${themeClasses.heading}`}>
                {product.name}
              </h2>
              <p className={`text-sm mb-4 ${themeClasses.textMuted}`}>
                {product.tagline}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-extrabold">
                  {currencySymbol}
                  {currentPrice.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-base line-through opacity-50">
                    {currencySymbol}
                    {originalPrice.toLocaleString()}
                  </span>
                )}
                {originalPrice && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    SAVE {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed mb-5 opacity-90">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="mb-5">
                <label className="block text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
                  Finish: <span className="opacity-75">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColor === c.name
                          ? "ring-2 ring-offset-2 ring-indigo-500 scale-110 border-white"
                          : "border-black/20 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="mb-6 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <span className="block text-xs font-mono uppercase tracking-wider font-bold mb-2">
                  Technical Architecture
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs opacity-85">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span> {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-black/20 dark:border-white/20 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-mono font-bold min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 hover:bg-black/10 dark:hover:bg-white/10 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${themeClasses.buttonPrimary}`}
                >
                  {added ? (
                    <>
                      <span>✓ Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <span>Add to Cart</span>
                      <span>•</span>
                      <span>
                        {currencySymbol}
                        {(currentPrice * quantity).toLocaleString()}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] opacity-70 font-mono">
                <span>⚡ Ships within 24 Hours</span>
                <span>🛡️ 3-Year Warranty Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
