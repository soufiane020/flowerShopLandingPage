import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Filter, X, Check, ShoppingBag, Calendar } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types';

const ShopPage: React.FC = () => {
  const { products, occasions, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  
  // Detail View State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('');

  // Categories derivation
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const occasionNames = ['All', ...occasions.map(o => o.name)];

  // Initialize filters from URL
  useEffect(() => {
    const occ = searchParams.get('occasion');
    if (occ) setSelectedOccasion(occ);
    
    const id = searchParams.get('id');
    if (id) {
        const prod = products.find(p => p.id === id);
        if (prod) setSelectedProduct(prod);
    }
  }, [searchParams, products]);

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesOccasion = selectedOccasion === 'All' || product.occasion === selectedOccasion;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesOccasion && matchesPrice;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSearchParams({ id: product.id });
    setQuantity(1);
    setDeliveryDate('');
  };

  const closeDetail = () => {
    setSelectedProduct(null);
    setSearchParams({});
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, quantity, deliveryDate);
      closeDetail();
      // Could show a toast here
      alert(`Added ${quantity} ${selectedProduct.name}(s) to cart!`);
    }
  };

  // Render Product Modal
  if (selectedProduct) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDetail}></div>
        <div className="bg-surface w-full max-w-5xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-fade-in-up">
            <button onClick={closeDetail} className="absolute top-4 right-4 z-10 p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
                <X className="h-6 w-6" />
            </button>
            
            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gray-100">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="mb-2">
                    <span className="text-primary font-bold tracking-widest text-xs uppercase">{selectedProduct.category}</span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">{selectedProduct.name}</h2>
                <p className="text-2xl font-light text-gray-700 mb-6">${selectedProduct.price}</p>
                
                <p className="text-gray-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
                    {selectedProduct.description}
                </p>

                <div className="space-y-6">
                    {/* Controls */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                        <div className="flex items-center border border-gray-300 rounded-lg w-max">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
                            <span className="px-4 py-2 font-medium">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
                        </div>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date (Optional)</label>
                         <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input 
                                type="date" 
                                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary focus:outline-none"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                            />
                         </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={handleAddToCart}
                            disabled={!selectedProduct.stock}
                            className={`w-full py-4 px-6 rounded-xl flex items-center justify-center space-x-2 font-bold text-lg transition-all ${selectedProduct.stock ? 'bg-primary text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
                        >
                            <ShoppingBag className="h-6 w-6" />
                            <span>{selectedProduct.stock ? 'Add to Cart' : 'Out of Stock'}</span>
                        </button>
                    </div>

                     <div className="text-sm text-gray-500 pt-4 flex space-x-4">
                        <span className="flex items-center"><Check className="h-4 w-4 mr-1 text-green-500" /> Secure Checkout</span>
                        <span className="flex items-center"><Check className="h-4 w-4 mr-1 text-green-500" /> Freshness Guarantee</span>
                     </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search flowers..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <div>
                    <h3 className="font-serif text-lg font-bold mb-3">Categories</h3>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={selectedCategory === cat} 
                                    onChange={() => setSelectedCategory(cat)}
                                    className="text-primary focus:ring-primary" 
                                />
                                <span className={selectedCategory === cat ? 'text-primary font-medium' : 'text-gray-600'}>{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-serif text-lg font-bold mb-3">Occasion</h3>
                    <div className="space-y-2">
                        {occasionNames.map(occ => (
                            <label key={occ} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={selectedOccasion === occ} 
                                    onChange={() => setSelectedOccasion(occ)}
                                    className="text-primary focus:ring-primary" 
                                />
                                <span className={selectedOccasion === occ ? 'text-primary font-medium' : 'text-gray-600'}>{occ}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-serif text-lg font-bold mb-3">Price Range: ${priceRange[1]}</h3>
                    <input 
                        type="range" 
                        min="0" 
                        max="300" 
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full accent-primary"
                    />
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="font-serif text-3xl font-bold">All Products</h1>
                    <span className="text-gray-500 text-sm">{filteredProducts.length} results</span>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No blooms found matching your criteria.</p>
                        <button onClick={() => { setSelectedCategory('All'); setSelectedOccasion('All'); setSearchTerm(''); }} className="mt-4 text-primary hover:underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(product => (
                             <div key={product.id} className="group cursor-pointer" onClick={() => handleProductClick(product)}>
                                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mb-4">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    {!product.stock && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium">Sold Out</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-serif text-xl font-medium group-hover:text-primary transition-colors">{product.name}</h3>
                                        <span className="font-medium text-gray-900">${product.price}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ShopPage;
