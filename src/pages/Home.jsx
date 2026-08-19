import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';

const FEATURED_IDS = [
  'carryology-essentials-sling',
  'lite-carry-on',
  'road-trip-travel-set',
  'venture-ready-duffel-55l',
  'laptop-caddy',
  'tech-kit',
];

export default function Home() {
  const { addToCart } = useContext(CartContext);
  const featured = FEATURED_IDS.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  return (
    <>
      {/* HERO Slideshow */}
      <HeroSlider />

      {/* Featured Products */}
      <section className="featured-products py-5">
        <div className="container">
          <h2 className="text-center mb-5">Featured Bags</h2>
          <div className="row g-3">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                className="col-md-6 col-lg-4"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5" style={{ backgroundColor: '#10361F', color: 'white' }}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <h4>Premium Quality</h4>
              <p>High-quality materials and craftsmanship.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h4>Free Shipping</h4>
              <p>Fast and reliable delivery service.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h4>Secure Payment</h4>
              <p>Safe and trusted payment methods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="testimonials py-5">
        <div className="container">
          <h2 className="text-center mb-5">What Our Customers Say</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card testimonial-card h-100">
                <div className="card-body text-center">
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star-half-stroke fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-regular fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <p className="pt-3">"Excellent quality and very stylish bags. Highly recommended!"</p>
                  <h6>- Lor Menghuy</h6>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card testimonial-card h-100">
                <div className="card-body text-center">
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <p className="pt-3">"Fast delivery and good customer service."</p>
                  <h6>- Peter Parker</h6>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card testimonial-card h-100">
                <div className="card-body text-center">
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <i className="fa-solid fa-star-half-stroke fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
                  <p className="pt-3">"The best bag store I've found online!"</p>
                  <h6>- Chhim BunChhun</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
