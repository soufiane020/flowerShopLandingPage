export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  occasion: string;
  description: string;
  image: string;
  stock: boolean;
  featured: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
}

export interface Occasion {
  id: string;
  name: string;
  image: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  fontFamily: 'serif' | 'sans';
}

export interface LandingContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    backgroundImage: string;
  };
  whyChooseUs: {
    title: string;
    features: Array<{ title: string; desc: string; icon: string }>;
  };
  newsletter: {
    enabled: boolean;
    title: string;
    text: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
  deliveryDate?: string;
}

export enum SortOption {
  NEWEST = 'NEWEST',
  PRICE_LOW = 'PRICE_LOW',
  PRICE_HIGH = 'PRICE_HIGH',
}
