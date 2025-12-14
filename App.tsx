import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import AdminPage from './pages/AdminPage';

// Simple cart placeholder
const CartPage = () => (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center min-h-[60vh]">
        <h1 className="font-serif text-4xl mb-6">Your Cart</h1>
        <p className="text-gray-500 mb-8">Items in your cart appear here.</p>
        <div className="bg-gray-50 p-12 rounded-xl border border-dashed border-gray-300">
            <p>Checkout functionality coming soon...</p>
        </div>
    </div>
);

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </StoreProvider>
  );
};

export default App;
