import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useCart } from './context/CartContext';

function LegacyLandingRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/ciudades/${slug}`} replace />;
}
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';
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
import DiscountPopup from './components/DiscountPopup';

// Pages
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Events from './pages/Events';
import Contact from './pages/Contact';
import MysteryBox from './pages/MysteryBox';
import Account from './pages/Account';
import DynamicLanding from './pages/DynamicLanding';
import Zonas from './pages/Zonas';

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
    if (product && (product.name || product.priceNum !== undefined)) {
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }

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
    } else if (page === 'dynamicLanding') {
      const slug = product?.slug || '';
      navigate(`/ciudades/${slug}`);
    } else if (page === 'dynamicTienda') {
      const slug = product?.slug || '';
      navigate(`/tiendas/${slug}`);
    } else if (page === 'tiendas') {
      navigate('/tienda');
    } else if (page === 'zonas' || page === 'ciudades') {
      navigate('/zonas');
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
        onOpenUser={() => handleNavigate('cuenta')}
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
                <SEO pageKey="home" />
                <Hero onNavigate={handleNavigate} />
                <Concept />
                <Marquee />
                <Categories onNavigate={handleNavigate} />
                <Rituals onNavigate={handleNavigate} />
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
            path="/mystery-box" 
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

          {/* Mi Cuenta / Santuario de Usuario */}
          <Route 
            path="/cuenta" 
            element={<Account onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/mi-cuenta" 
            element={<Account onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/login" 
            element={<Account onNavigate={handleNavigate} onAddToCart={handleAddToCart} />} 
          />

          {/* Hub de Zonas & Cobertura Dinámica (Disponible solo desde Footer) */}
          <Route 
            path="/zonas" 
            element={<Zonas onNavigate={handleNavigate} />} 
          />
          <Route 
            path="/ciudades" 
            element={<Navigate to="/zonas" replace />} 
          />

          {/* Landings Dinámicas SEO por Ciudades (/ciudades/:slug) */}
          <Route 
            path="/ciudades/:slug" 
            element={<DynamicLanding onNavigate={handleNavigate} onAddToCart={handleAddToCart} type="ciudad" />} 
          />

          {/* Landings Dinámicas SEO Tiendas Oficiales (/tiendas/:slug) */}
          <Route 
            path="/tiendas/:slug" 
            element={<DynamicLanding onNavigate={handleNavigate} onAddToCart={handleAddToCart} type="tienda" />} 
          />
          <Route 
            path="/tiendas" 
            element={<Navigate to="/tienda" replace />} 
          />

          {/* Redirecciones de compatibilidad */}
          <Route 
            path="/landing/:slug" 
            element={<LegacyLandingRedirect />} 
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

      {/* Welcome Discount Popup (10% OFF First Purchase) */}
      <DiscountPopup onNavigate={handleNavigate} />
    </>
  );
}
