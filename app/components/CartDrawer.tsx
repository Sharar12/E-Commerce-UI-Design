"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CartItem, ThemeClasses } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  themeClasses: ThemeClasses;
  currencyRate: number;
  currencySymbol: string;
  onClose: () => void;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  items,
  themeClasses,
  currencyRate,
  currencySymbol,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("892104");

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const subtotal = Math.round(rawSubtotal * currencyRate);
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const freeShippingThreshold = Math.round(150 * currencyRate);
  const isFreeShipping = subtotal >= freeShippingThreshold || items.length === 0;
  const shippingCost = isFreeShipping ? 0 : Math.round(25 * currencyRate);
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === "AETHER2026" || cleanCode === "LUMINA" || cleanCode === "VIP20") {
      setDiscountPercent(20);
      setPromoMessage({ text: "20% VIP Discount Applied!", isError: false });
    } else if (cleanCode === "") {
      setPromoMessage({ text: "Please enter a promo voucher", isError: true });
    } else {
      setPromoMessage({ text: "Invalid code. Try 'AETHER2026'", isError: true });
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setOrderNumber(String(Math.floor(100000 + Math.random() * 900000)));
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      setTimeout(() => {
        onClearCart();
        setOrderComplete(false);
        onClose();
      }, 2500);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen max-w-md ${themeClasses.card} rounded-none border-l shadow-2xl flex flex-col justify-between`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛍️</span>
              <h2 className={`text-xl font-bold ${themeClasses.heading}`}>
                Your Shopping Cart
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              title="Close cart"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>🎉</span>
                <span>You unlocked Free Global Express Shipping!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between font-mono mb-1">
                  <span>Add {currencySymbol}{(freeShippingThreshold - subtotal).toLocaleString()} for Free Shipping</span>
                  <span>{Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl animate-bounce">
                  ✓
                </div>
                <h3 className="text-xl font-bold">Order Confirmed!</h3>
                <p className="text-xs opacity-70">
                  Your neural order #AETH-{orderNumber} has been processed. Dispatching within 24 hours.
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 opacity-60">
                <span className="text-5xl">🛒</span>
                <p className="font-semibold text-base">Your cart is currently empty</p>
                <p className="text-xs max-w-xs">
                  Explore our curated spatial audio, biometric wearables, and studio compute gear.
                </p>
              </div>
            ) : (
              items.map((item, index) => {
                const itemPrice = Math.round(item.product.price * currencyRate);
                return (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${index}`}
                    className="flex gap-4 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/10 shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm leading-tight pr-4">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-xs opacity-40 hover:opacity-100 hover:text-red-500 transition-opacity"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                        <span className="text-[11px] opacity-70 font-mono">
                          Color: {item.selectedColor}
                        </span>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-black/20 dark:border-white/20 rounded-lg overflow-hidden text-xs">
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                            className="px-2 py-0.5 hover:bg-black/10 dark:hover:bg-white/10 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 font-mono font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="px-2 py-0.5 hover:bg-black/10 dark:hover:bg-white/10 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-mono font-bold text-sm">
                          {currencySymbol}
                          {(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Calculations and Checkout */}
          {items.length > 0 && !orderComplete && (
            <div className="p-6 border-t border-black/10 dark:border-white/10 space-y-4 bg-black/5 dark:bg-white/5">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code: AETHER2026"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={`flex-1 px-3.5 py-2 text-xs uppercase font-mono ${themeClasses.input}`}
                />
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold rounded-xl ${themeClasses.buttonSecondary}`}
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <div
                  className={`text-xs font-mono ${
                    promoMessage.isError ? "text-red-500" : "text-emerald-500"
                  }`}
                >
                  {promoMessage.text}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between opacity-75">
                  <span>Subtotal</span>
                  <span className="font-mono">{currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>VIP Voucher (20%)</span>
                    <span className="font-mono">-{currencySymbol}{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between opacity-75">
                  <span>Estimated Shipping</span>
                  <span className="font-mono">
                    {shippingCost === 0 ? "FREE" : `${currencySymbol}${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-black/10 dark:border-white/10 flex justify-between text-base font-bold">
                  <span>Total Due</span>
                  <span className="font-mono">{currencySymbol}{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${themeClasses.buttonPrimary}`}
              >
                {isCheckingOut ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>Processing Neural Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <span>•</span>
                    <span className="font-mono">{currencySymbol}{total.toLocaleString()}</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] opacity-60 font-mono">
                🔒 256-Bit SSL Encrypted & Express Dispatch
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
