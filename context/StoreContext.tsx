import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ThemeSettings, LandingContent, Review, Occasion, CartItem } from '../types';

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  theme: ThemeSettings;
  setTheme: React.Dispatch<React.SetStateAction<ThemeSettings>>;
  content: LandingContent;
  setContent: React.Dispatch<React.SetStateAction<LandingContent>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  occasions: Occasion[];
  setOccasions: React.Dispatch<React.SetStateAction<Occasion[]>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, date?: string) => void;
  removeFromCart: (id: string) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: '1', name: 'Velvet Romance', price: 89, category: 'Bouquets', occasion: 'Love', description: 'Deep red roses mixed with eucalyptus for a passionate gesture.', image: 'https://picsum.photos/id/102/500/500', stock: true, featured: true },
  { id: '2', name: 'Spring Whisper', price: 65, category: 'Vase Arrangements', occasion: 'Birthday', description: 'A delicate mix of tulips and daisies bringing the joy of spring.', image: 'https://picsum.photos/id/306/500/500', stock: true, featured: true },
  { id: '3', name: 'White Serenity', price: 120, category: 'Luxury', occasion: 'Sympathy', description: 'Pure white lilies and orchids arranged in a premium glass vase.', image: 'https://picsum.photos/id/152/500/500', stock: true, featured: false },
  { id: '4', name: 'Golden Hour', price: 75, category: 'Bouquets', occasion: 'Friendship', description: 'Sunflowers and yellow roses to brighten anyone\'s day.', image: 'https://picsum.photos/id/625/500/500', stock: true, featured: true },
  { id: '5', name: 'Pastel Dream', price: 95, category: 'Boxed', occasion: 'Wedding', description: 'Soft pinks and creams in a luxury hatbox.', image: 'https://picsum.photos/id/360/500/500', stock: true, featured: false },
  { id: '6', name: 'Rustic Charm', price: 55, category: 'Dried', occasion: 'Decoration', description: 'Dried lavender and wheat in a rustic arrangement.', image: 'https://picsum.photos/id/512/500/500', stock: false, featured: false },
];

const initialContent: LandingContent = {
  hero: {
    headline: "Emotions Blooming in Every Petal",
    subheadline: "Hand-crafted arrangements for life's most precious moments.",
    ctaText: "Shop Collection",
    backgroundImage: "https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=2832&auto=format&fit=crop",
  },
  whyChooseUs: {
    title: "Why Bloom & Ethereal?",
    features: [
      { title: "Farm Fresh", desc: "Sourced directly from sustainable growers daily.", icon: "Leaf" },
      { title: "Artisan Design", desc: "Crafted by award-winning floral artists.", icon: "Palette" },
      { title: "Same Day Delivery", desc: "Order by 2 PM for delivery today.", icon: "Truck" },
    ]
  },
  newsletter: {
    enabled: true,
    title: "Join Our Garden",
    text: "Subscribe for exclusive offers and floral care tips.",
  }
};

const initialTheme: ThemeSettings = {
  primaryColor: '#D15F6A',
  secondaryColor: '#F3E5E6',
  darkMode: false,
  fontFamily: 'serif',
};

const initialReviews: Review[] = [
  { id: '1', name: 'Sarah J.', rating: 5, text: 'Absolutely stunning arrangement. Delivered on time and looked even better than the photos.' },
  { id: '2', name: 'Michael B.', rating: 4, text: 'Great service, beautiful packaging. The roses lasted for over a week.' },
  { id: '3', name: 'Emily R.', rating: 5, text: 'My mother cried tears of joy. Thank you for making her birthday so special.' },
];

const initialOccasions: Occasion[] = [
  { id: '1', name: 'Love & Romance', image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&q=80&w=500' },
  { id: '2', name: 'Birthday', image: 'https://images.unsplash.com/photo-1463043254199-7a3efd782ad7?auto=format&fit=crop&q=80&w=500' },
  { id: '3', name: 'Sympathy', image: 'https://images.unsplash.com/photo-1494336956603-10dfd8590193?auto=format&fit=crop&q=80&w=500' },
  { id: '4', name: 'Wedding', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=500' },
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [theme, setTheme] = useState<ThemeSettings>(initialTheme);
  const [content, setContent] = useState<LandingContent>(initialContent);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [occasions, setOccasions] = useState<Occasion[]>(initialOccasions);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    // Simple dark mode toggle for demo
    if (theme.darkMode) {
        root.style.setProperty('--surface', '#1f2937');
        root.style.setProperty('--text', '#f9fafb');
    } else {
        root.style.setProperty('--surface', '#ffffff');
        root.style.setProperty('--text', '#1f2937');
    }
  }, [theme]);

  const addToCart = (product: Product, quantity: number, date?: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { ...product, quantity, deliveryDate: date }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const loginAdmin = (password: string) => {
    if (password === 'admin') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdminLoggedIn(false);

  return (
    <StoreContext.Provider value={{
      products, setProducts,
      theme, setTheme,
      content, setContent,
      reviews, setReviews,
      occasions, setOccasions,
      cart, addToCart, removeFromCart,
      isAdminLoggedIn, loginAdmin, logoutAdmin
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};