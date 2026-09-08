export type ThemeId =
  | "skeuomorphism"
  | "neomorphism"
  | "glassmorphism"
  | "claymorphism"
  | "minimalism"
  | "maximalism"
  | "brutalism"
  | "liquid-glass"
  | "bento-grid"
  | "spatial-ui";

export type ColorMode = "light" | "dark";

export interface ThemeClasses {
  pageBg: string;
  nav: string;
  card: string;
  cardHover: string;
  buttonPrimary: string;
  buttonSecondary: string;
  badge: string;
  input: string;
  heading: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  promoBanner: string;
  footer: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  subtitle: string;
  icon: string;
  tag: string;
  accentColor: {
    light: string;
    dark: string;
  };
  variables: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  modes: {
    light: ThemeClasses;
    dark: ThemeClasses;
  };
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: "Audio" | "Wearables" | "Computing" | "Optics" | "Smart Home";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  specs: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  stockLeft: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export type Currency = "USD" | "EUR" | "JPY";

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  productName: string;
  verified: boolean;
}
