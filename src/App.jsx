import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function PageLoader() {
  return (
    <div className="text-center py-5">
      <span className="spinner-border text-secondary" role="status" aria-hidden="true"></span>
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;