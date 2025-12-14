import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { generateProductDescription } from '../services/gemini';
import { 
  LayoutDashboard, Package, Palette, FileText, Settings, 
  Plus, Trash2, Edit2, Upload, Sparkles, LogOut, Save, X
} from 'lucide-react';
import { Product } from '../types';

const AdminPage: React.FC = () => {
  const { 
    isAdminLoggedIn, loginAdmin, logoutAdmin, 
    products, setProducts, 
    theme, setTheme,
    content, setContent
  } = useStore();

  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'content' | 'theme'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="font-serif text-3xl font-bold mb-6 text-center text-gray-900">Admin Portal</h2>
          <form onSubmit={(e) => { e.preventDefault(); if(!loginAdmin(password)) alert('Invalid password (try "admin")'); }}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
              Access Dashboard
            </button>
            <p className="text-center text-gray-400 mt-4 text-xs">Hint: password is 'admin'</p>
          </form>
        </div>
      </div>
    );
  }

  // Handlers
  const handleSaveProduct = () => {
    if (!editingProduct) return;
    if (editingProduct.id) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct as Product : p));
    } else {
      const newProduct = { ...editingProduct, id: Math.random().toString(36).substr(2, 9) } as Product;
      setProducts([...products, newProduct]);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const generateDescription = async () => {
    if (!editingProduct?.name || !editingProduct?.category) {
        alert("Please enter a name and category first.");
        return;
    }
    setIsGeneratingAI(true);
    const desc = await generateProductDescription(editingProduct.name, editingProduct.category);
    setEditingProduct({ ...editingProduct, description: desc });
    setIsGeneratingAI(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="p-6">
          <h2 className="font-serif text-xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Package className="h-5 w-5" />
            <span>Products</span>
          </button>
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'content' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <FileText className="h-5 w-5" />
            <span>Content</span>
          </button>
          <button onClick={() => setActiveTab('theme')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'theme' ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Palette className="h-5 w-5" />
            <span>Theme & Style</span>
          </button>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <button onClick={logoutAdmin} className="w-full flex items-center space-x-2 text-red-500 hover:bg-red-50 px-4 py-3 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 pt-24">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                <button onClick={() => setEditingProduct({ name: '', price: 0, category: 'Bouquets', stock: true, featured: false, image: 'https://picsum.photos/500', description: '' })} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90">
                    <Plus className="h-5 w-5" /> Add Product
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4"><img src={product.image} className="w-12 h-12 rounded object-cover" alt="" /></td>
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4 text-sm text-gray-500">{product.category}</td>
                                <td className="p-4">${product.price}</td>
                                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${product.stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.stock ? 'In Stock' : 'Out'}</span></td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:text-blue-800 mr-3"><Edit2 className="h-4 w-4" /></button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="max-w-2xl">
             <h1 className="text-2xl font-bold text-gray-800 mb-8">Landing Page Content</h1>
             
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                <h3 className="text-lg font-bold border-b pb-2">Hero Section</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <input type="text" className="w-full p-2 border rounded" value={content.hero.headline} onChange={(e) => setContent({...content, hero: {...content.hero, headline: e.target.value}})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
                    <textarea className="w-full p-2 border rounded" value={content.hero.subheadline} onChange={(e) => setContent({...content, hero: {...content.hero, subheadline: e.target.value}})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
                    <input type="text" className="w-full p-2 border rounded" value={content.hero.backgroundImage} onChange={(e) => setContent({...content, hero: {...content.hero, backgroundImage: e.target.value}})} />
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6 mt-6">
                <h3 className="text-lg font-bold border-b pb-2">Newsletter</h3>
                 <div className="flex items-center gap-2">
                    <input type="checkbox" checked={content.newsletter.enabled} onChange={(e) => setContent({...content, newsletter: {...content.newsletter, enabled: e.target.checked}})} className="h-5 w-5 text-primary" />
                    <label className="text-sm font-medium text-gray-700">Enable Newsletter Section</label>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" className="w-full p-2 border rounded" value={content.newsletter.title} onChange={(e) => setContent({...content, newsletter: {...content.newsletter, title: e.target.value}})} />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Theme Customization</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center gap-4">
                        <input type="color" className="h-12 w-24 p-1 rounded cursor-pointer" value={theme.primaryColor} onChange={(e) => setTheme({...theme, primaryColor: e.target.value})} />
                        <span className="text-gray-500 font-mono">{theme.primaryColor}</span>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color (Background accents)</label>
                    <div className="flex items-center gap-4">
                        <input type="color" className="h-12 w-24 p-1 rounded cursor-pointer" value={theme.secondaryColor} onChange={(e) => setTheme({...theme, secondaryColor: e.target.value})} />
                        <span className="text-gray-500 font-mono">{theme.secondaryColor}</span>
                    </div>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Appearance</label>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setTheme({...theme, darkMode: false})} className={`px-4 py-2 rounded-lg border ${!theme.darkMode ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}`}>Light Mode</button>
                        <button onClick={() => setTheme({...theme, darkMode: true})} className={`px-4 py-2 rounded-lg border ${theme.darkMode ? 'bg-gray-800 text-white' : 'bg-white border-gray-200'}`}>Dark Mode</button>
                    </div>
                 </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                Theme changes are applied in real-time. Check the public site to see updates.
            </div>
          </div>
        )}
      </main>

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                    <button onClick={() => setEditingProduct(null)}><X className="h-5 w-5" /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                        <input type="text" className="w-full border rounded p-2" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select className="w-full border rounded p-2" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}>
                                <option value="Bouquets">Bouquets</option>
                                <option value="Vase Arrangements">Vase Arrangements</option>
                                <option value="Boxed">Boxed</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Dried">Dried</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Occasion</label>
                            <select className="w-full border rounded p-2" value={editingProduct.occasion} onChange={(e) => setEditingProduct({...editingProduct, occasion: e.target.value})}>
                                <option value="Love">Love</option>
                                <option value="Birthday">Birthday</option>
                                <option value="Sympathy">Sympathy</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Friendship">Friendship</option>
                                <option value="Decoration">Decoration</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Price ($)</label>
                        <input type="number" className="w-full border rounded p-2" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
                         <input type="text" className="w-full border rounded p-2" value={editingProduct.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} />
                         {editingProduct.image && <img src={editingProduct.image} className="mt-2 h-20 rounded object-cover" alt="Preview" />}
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                             <label className="block text-sm font-bold text-gray-700">Description</label>
                             <button 
                                onClick={generateDescription}
                                disabled={isGeneratingAI}
                                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200 transition-colors"
                             >
                                <Sparkles className="h-3 w-3" />
                                {isGeneratingAI ? 'Thinking...' : 'Generate with AI'}
                             </button>
                        </div>
                        <textarea className="w-full border rounded p-2 h-24" value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} />
                    </div>
                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="h-4 w-4 text-primary rounded" checked={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.checked})} />
                            <span className="text-sm font-medium">In Stock</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="h-4 w-4 text-primary rounded" checked={editingProduct.featured} onChange={(e) => setEditingProduct({...editingProduct, featured: e.target.checked})} />
                            <span className="text-sm font-medium">Featured</span>
                        </label>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={handleSaveProduct} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-medium">Save Product</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;