import { useState } from 'react';
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

// Pages
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'shop' | 'product'
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleNavigate = (page, product = null) => {
    setCurrentPage(page);
    if (product) setSelectedProduct(product);
  };

  return (
    <>
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
      <main>
        {currentPage === 'home' && (
          <>
            <Hero />
            <Concept />
            <Marquee />
            <Categories />
            <Rituals />
            <BestSellers />
            <AromaExperience />
            <SocialProof />
            <Gifts />
            <Newsletter />
          </>
        )}
        
        {currentPage === 'shop' && (
          <Shop onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'product' && (
          <ProductPage product={selectedProduct} onNavigate={handleNavigate} />
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
