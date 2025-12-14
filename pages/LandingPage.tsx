import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Star, Leaf, Palette, Truck } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { content, products, reviews, occasions } = useStore();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Leaf': return <Leaf className="h-8 w-8 text-primary" />;
      case 'Palette': return <Palette className="h-8 w-8 text-primary" />;
      case 'Truck': return <Truck className="h-8 w-8 text-primary" />;
      default: return <Star className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src={content.hero.backgroundImage} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
            {content.hero.headline}
          </h1>
          <p className="text-lg md:text-2xl mb-10 font-light opacity-90 max-w-2xl mx-auto">
            {content.hero.subheadline}
          </p>
          <Link to="/shop" className="inline-flex items-center px-8 py-4 bg-primary text-white text-lg font-medium rounded-full hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
            {content.hero.ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Occasions Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4">Shop by Occasion</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {occasions.map((occ) => (
            <Link key={occ.id} to={`/shop?occasion=${occ.name}`} className="group relative overflow-hidden rounded-2xl aspect-square shadow-md cursor-pointer">
              <img src={occ.image} alt={occ.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-8">
                <span className="text-white text-xl font-medium tracking-wide">{occ.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-2">Featured Blooms</h2>
              <p className="text-gray-600">Hand-picked favorites of the season</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {!product.stock && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">Out of Stock</div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                     <Link to={`/shop?id=${product.id}`} className="block w-full text-center bg-white/90 backdrop-blur text-gray-900 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors">
                        Quick View
                     </Link>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="font-serif text-xl font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">${product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
             <Link to="/shop" className="inline-flex items-center text-primary font-medium hover:underline">
              View All Collections <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
           <h2 className="font-serif text-4xl font-bold mb-4">{content.whyChooseUs.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.whyChooseUs.features.map((feature, idx) => (
            <div key={idx} className="text-center p-6 rounded-2xl hover:bg-secondary/10 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/30 mb-6">
                {getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold">Love Notes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                <div className="text-primary mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
                <p className="font-bold text-gray-900 font-serif">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      {content.newsletter.enabled && (
        <section className="py-24 px-4 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1558230635-c54d37532f83?q=80&w=2000')] bg-cover bg-center"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold mb-4">{content.newsletter.title}</h2>
            <p className="text-gray-300 mb-8 text-lg">{content.newsletter.text}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-6 py-4 rounded-full text-gray-900 w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-white hover:text-primary transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
