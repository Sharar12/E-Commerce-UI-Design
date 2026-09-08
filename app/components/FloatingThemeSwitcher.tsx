"use client";

import React, { useState, useEffect, useRef } from "react";
import { Theme, ColorMode } from "../types";
import { THEMES } from "../themeData";

interface FloatingThemeSwitcherProps {
  currentTheme: Theme;
  colorMode: ColorMode;
  onSelectTheme: (theme: Theme) => void;
  onToggleColorMode: () => void;
}

export default function FloatingThemeSwitcher({
  currentTheme,
  colorMode,
  onSelectTheme,
  onToggleColorMode,
}: FloatingThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const orbRef = useRef<HTMLDivElement>(null);

  // Initialize position to bottom right once mounted in browser
  useEffect(() => {
    const defaultX = Math.max(16, window.innerWidth - 86);
    const defaultY = Math.max(16, window.innerHeight - 96);
    const frameId = requestAnimationFrame(() => {
      setPosition({ x: defaultX, y: defaultY });
    });

    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        return {
          x: Math.min(window.innerWidth - 86, Math.max(16, prev.x)),
          y: Math.min(window.innerHeight - 96, Math.max(16, prev.y)),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Pointer drag listeners
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartPosRef.current = {
      x: e.clientX - (position?.x || 0),
      y: e.clientY - (position?.y || 0),
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const newX = e.clientX - dragStartPosRef.current.x;
    const newY = e.clientY - dragStartPosRef.current.y;

    const dist = Math.hypot(
      e.clientX - (dragStartPosRef.current.x + (position?.x || 0)),
      e.clientY - (dragStartPosRef.current.y + (position?.y || 0))
    );
    if (dist > 4) {
      hasMovedRef.current = true;
    }

    const clampedX = Math.max(12, Math.min(window.innerWidth - 80, newX));
    const clampedY = Math.max(12, Math.min(window.innerHeight - 80, newY));
    setPosition({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    if (!hasMovedRef.current) {
      setIsOpen((prev) => !prev);
    }
  };

  if (!position) return null;

  return (
    <>
      {/* Movable Circular Floating Launcher */}
      <div
        ref={orbRef}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title="Drag anywhere or click to switch UI themes & light/dark mode"
        className="fixed top-0 left-0 z-50 select-none cursor-grab active:cursor-grabbing group"
      >
        <div className="relative flex items-center justify-center">
          {/* Animated Ambient Outer Pulse Ring */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-300 animate-spin [animation-duration:8s]" />

          {/* Main 64px Circular Button */}
          <div className="relative w-16 h-16 rounded-full bg-zinc-950 text-white border-2 border-white/40 shadow-2xl flex flex-col items-center justify-center p-1 transition-transform group-hover:scale-105 active:scale-95">
            <span className="text-2xl leading-none">{currentTheme.icon}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] font-mono tracking-tighter uppercase font-bold text-cyan-300">
                {colorMode === "dark" ? "🌙 DARK" : "☀️ LIGHT"}
              </span>
            </div>

            {/* Small Drag / Mode Indicator Dot */}
            <div
              className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-zinc-950 animate-pulse ${
                colorMode === "dark" ? "bg-cyan-400" : "bg-amber-400"
              }`}
            />
          </div>

          {/* Floating Helper Pill */}
          <div className="absolute right-full mr-3 px-3 py-1 rounded-full bg-zinc-900/95 text-white border border-white/20 text-xs font-mono whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
            🎨 Drag anywhere • Click to switch 10 UI themes & Light/Dark
          </div>
        </div>
      </div>

      {/* Theme Selection Modal Backdrop & Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 text-white rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Light/Dark Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-zinc-800 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono uppercase font-bold">
                    Interactive Design Engine
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    10 Paradigms • Dual Mode
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Switch Visual Paradigm & Appearance
                </h2>
                <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                  Each design adapts its shadow physics, contrast, tactile buttons, and materials for both Light and Dark modes.
                </p>
              </div>

              {/* Mode Toggle Button & Close */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Light/Dark Mode Switch */}
                <button
                  onClick={onToggleColorMode}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-xs font-mono font-bold transition-all shadow-md"
                  title={`Switch to ${colorMode === "dark" ? "Light" : "Dark"} Mode`}
                >
                  <span className="text-base">{colorMode === "dark" ? "🌙" : "☀️"}</span>
                  <span>{colorMode === "dark" ? "Dark Mode" : "Light Mode"}</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                    TOGGLE
                  </span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-700 transition-colors"
                  title="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 10 Theme Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
              {THEMES.map((theme) => {
                const isActive = theme.id === currentTheme.id;
                const accent = theme.accentColor[colorMode];
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onSelectTheme(theme);
                      setIsOpen(false);
                    }}
                    className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                      isActive
                        ? "bg-zinc-850 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] ring-2 ring-cyan-400/50"
                        : "bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
                    }`}
                  >
                    {/* Active Check Indicator */}
                    {isActive && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[11px] font-mono font-bold">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ACTIVE
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl p-2 rounded-xl bg-zinc-800/90 border border-zinc-700 flex items-center justify-center">
                          {theme.icon}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {theme.name}
                            </h3>
                          </div>
                          <span className="inline-block text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {theme.tag}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {theme.subtitle}
                      </p>
                    </div>

                    {/* Mini Visual Preview Pill */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-mono text-[11px] flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                          style={{ backgroundColor: accent }}
                        />
                        {colorMode.toUpperCase()} ACCENT: <span style={{ color: accent }}>{accent}</span>
                      </span>
                      <span className="text-xs text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Select Style &rarr;
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Status bar */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  Current active mode: <strong>{colorMode.toUpperCase()}</strong> • Draggable launcher position persisted
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onToggleColorMode}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs border border-zinc-700 transition-colors"
                >
                  Toggle {colorMode === "dark" ? "☀️ Light" : "🌙 Dark"} Mode
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
                >
                  Close Switcher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
