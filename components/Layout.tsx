import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Flower, Instagram, Facebook, Twitter, Mail, MapPin, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { cart, content } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isHome && window.scrollY < 50 ? 'bg-transparent text-white' : 'bg-surface/90 backdrop-blur-md text-text border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Flower className={`h-8 w-8 ${isHome ? 'text-white' : 'text-primary'}`} />
              <span className={`font-serif text-2xl font-bold tracking-wide ${isHome ? 'text-white' : 'text-text'}`}>
                Bloom & Ethereal
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-primary transition-colors font-medium">Home</Link>
              <Link to="/shop" className="hover:text-primary transition-colors font-medium">Shop</Link>
              <Link to="/admin" className="hover:text-primary transition-colors font-medium">Admin</Link>
              
              <Link to="/cart" className="relative p-2 hover:bg-gray-100/10 rounded-full transition-colors">
                <ShoppingBag className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100/10 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface absolute w-full border-b border-gray-100 shadow-lg text-text">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-primary">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-primary">Shop</Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-primary">
                Cart ({cart.reduce((a,b)=>a+b.quantity, 0)})
              </Link>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary hover:text-primary">Admin Panel</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary/30 pt-16 pb-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <Flower className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-bold">Bloom & Ethereal</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed">
                Crafting moments of joy with nature's finest artworks. Sustainability and beauty in every petal.
              </p>
            </div>
            
            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/shop" className="hover:text-primary">Shop Collection</Link></li>
                <li><Link to="/about" className="hover:text-primary">Our Story</Link></li>
                <li><Link to="/delivery" className="hover:text-primary">Delivery Info</Link></li>
                <li><Link to="/faq" className="hover:text-primary">FAQs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> 123 Floral Ave, New York, NY</li>
                <li className="flex items-center"><Mail className="h-4 w-4 mr-2" /> hello@bloomethereal.com</li>
                <li className="flex items-center"><Clock className="h-4 w-4 mr-2" /> Mon-Sat: 9am - 6pm</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:text-primary transition-all"><Instagram className="h-5 w-5" /></a>
                <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:text-primary transition-all"><Facebook className="h-5 w-5" /></a>
                <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:text-primary transition-all"><Twitter className="h-5 w-5" /></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2025 Bloom & Ethereal. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
