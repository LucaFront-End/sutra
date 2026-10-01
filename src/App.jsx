import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Concept from './components/Concept';
import Marquee from './components/Marquee';
import Categories from './components/Categories';
import Rituals from './components/Rituals';
import BestSellers from './components/BestSellers';
import AromaExperience from './components/AromaExperience';
import SocialProof from './components/SocialProof';
import Gifts from './components/Gifts';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import UserModal from './components/UserModal';
import CartDrawer from './components/CartDrawer';
import FloatingActions from './components/FloatingActions';

// Pages
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Events from './pages/Events';
import Contact from './pages/Contact';
import MysteryBox from './pages/MysteryBox';

export default function App() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Wix Cart context
  const {
    cartItems,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    getItemCount,
    updateQuantity,
  } = useCart();

  const handleNavigate = (page, product = null, category = 'all', subcategory = null) => {
    if (product) setSelectedProduct(product);

    if (page === 'home' || page === '/') {
      navigate('/');
    } else if (page === 'shop' || page === 'tienda') {
      if (category && category !== 'all') {
        if (category === 'accesorios' && subcategory) {
          navigate(`/tienda/accesorios/${subcategory}`);
        } else {
          navigate(`/tienda/${category}`);
        }
      } else {
        navigate('/tienda');
      }
    } else if (page === 'product' || page === 'producto') {
      const slug = product?.slug || product?._wixId || product?.id || 'ritual';
      navigate(`/producto/${slug}`);
    } else if (page === 'about' || page === 'nosotros') {
      navigate('/nosotros');
    } else if (page === 'events' || page === 'eventos') {
      navigate('/eventos');
    } else if (page === 'blog' || page === 'comunidad') {
      navigate('/comunidad');
    } else if (page === 'contact' || page === 'contacto') {
      navigate('/contacto');
    } else if (page === 'mysterybox' || page === 'misterybox' || page === 'suscripcion') {
      navigate('/mysterybox');
    } else {
      navigate(page);
    }
  };

  const handleAddToCart = (product, qty = 1, variant = null) => {
    addToCart(product, qty, variant);
  };

  return (
    <>
      <ScrollToTop />
      <Navbar 
        onNavigate={handleNavigate} 
        onOpenUser={() => setIsUserModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={getItemCount()}
      />

      <main>
        <Routes>
          {/* Home */}
          <Route 
            path="/" 
            element={
              <>
                <Hero />
                <Concept />
                <Marquee />
                <Categories onNavigate={handleNavigate} />
                <Rituals />
                <BestSellers onNavigate={handleNavigate} onAddToCart={handleAddToCart} />
                <AromaExperience onNavigate={handleNavigate} />
                <SocialProof />
                <Gifts onAddToCart={handleAddToCart} />
                <Newsletter />
              </>
            } 
          />

          {/* Tienda & Categorías */}
          <Route 
            path="/tienda" 
            element={<Shop onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/tienda/:category" 
            element={<Shop onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/tienda/:category/:subcategory" 
            element={<Shop onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />

          {/* Product Page con Slug */}
          <Route 
            path="/producto/:slug" 
            element={<ProductPage product={selectedProduct} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/productos/:slug" 
            element={<ProductPage product={selectedProduct} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />

          {/* Nosotros */}
          <Route 
            path="/nosotros" 
            element={<About onNavigate={handleNavigate} />} 
          />

          {/* Eventos */}
          <Route 
            path="/eventos" 
            element={<Events onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />

          {/* Comunidad / Blog */}
          <Route 
            path="/comunidad" 
            element={<Blog onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/comunidad/:slug" 
            element={<BlogPost onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/blog" 
            element={<Blog onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/blog/:slug" 
            element={<BlogPost onNavigate={handleNavigate} />} 
          />

          {/* Contacto */}
          <Route 
            path="/contacto" 
            element={<Contact onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/contact" 
            element={<Contact onNavigate={handleNavigate} />} 
          />

          {/* Mystery Box (Suscripción Bimestral) */}
          <Route 
            path="/mysterybox" 
            element={<MysteryBox onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/misterybox" 
            element={<MysteryBox onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/suscripcion" 
            element={<MysteryBox onNavigate={handleNavigate} />} 
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* User Account Modal */}
      <UserModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
      />

      {/* Shopping Bag Drawer connected to Wix ecom */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onNavigate={handleNavigate}
      />

      {/* Dual Floating Actions: WhatsApp & Wix Inbox Chat */}
      <FloatingActions />
    </>
  );
}
