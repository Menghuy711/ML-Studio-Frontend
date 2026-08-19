import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import ProductBadge from '../components/ProductBadge';
import HeroSlider from '../components/HeroSlider';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Home() {
  const { addToCart } = useContext(CartContext);

  const handleQuickAdd = (product) => {
    addToCart(product);
    const offcanvasEl = document.getElementById('cartOffcanvas');
    if (offcanvasEl) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      offcanvas.show();
    }
  };

  return (
    <>
      {/* HERO Slideshow */}
      <HeroSlider />

      {/* Featured Products */}
      <section className="featured-products py-5">
        <div className="container">
          <h2 className="text-center mb-5">Featured Bags</h2>
          <div className="row g-3">
            {/* Product 1 */}
            <div className="col-md-6 col-lg-4">
              <div className="card product-card h-100">
                <img src="/images/products/Sling-bags/Carryology-Essentials-Sling/sling-bags-carousel/0.avif" className="card-img-top" alt="sling" />
                <div className="card-body">
                  <ProductBadge product={{ labels: ['Best Seller', 'New Arrival'] }} className="mb-2" />
                  <h5 className="card-title">Carryology Essentials Sling</h5>
                  <p className="card-text">Stylish and durable sling for daily use and keep you confidence.</p>
                  <h4 className="price">$35</h4>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-dark w-50"
                      onClick={() => handleQuickAdd({ id: 'carryology-essentials-sling', title: 'Carryology Essentials Sling', price: 35, image: '/images/products/Sling-bags/Carryology-Essentials-Sling/sling-bags-carousel/0.avif' })}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add
                    </button>
                    <Link to="/products/carryology-essentials-sling" className="btn gold-btn w-50">Details</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="col-md-6 col-lg-4">
              <div className="card product-card h-100">
                <img src="/images/products/Luggage/Lite-Carry-On/luggage-carousel/0.avif" className="card-img-top" alt="Luggage" />
                <div className="card-body">
                  <ProductBadge product={{ labels: ['Best Seller'] }} className="mb-2" />
                  <h5 className="card-title">Lite Carry-On</h5>
                  <p className="card-text">A lightweight travel bag that’s engineered to glide and travel everywhere with you.</p>
                  <h4 className="price">$168</h4>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-dark w-50"
                      onClick={() => handleQuickAdd({ id: 'lite-carry-on', title: 'Lite Carry-On', price: 168, image: '/images/products/Luggage/Lite-Carry-On/luggage-carousel/0.avif' })}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add
                    </button>
                    <Link to="/products/lite-carry-on" className="btn gold-btn w-50">Details</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="col-md-6 col-lg-4">
              <div className="card product-card h-100">
                <img src="/images/products/Travel-bags/Road-Trip-Travel-Set/travel-bags-carousel/0.avif" className="card-img-top" alt="travel-bag" />
                <div className="card-body">
                  <ProductBadge product={{ labels: ['Trending', 'Sale'] }} className="mb-2" />
                  <h5 className="card-title">Road Trip Travel Set</h5>
                  <p className="card-text">The ultimate road trip pair for throwing and going without compromising on function.</p>
                  <h4 className="price">$139</h4>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-dark w-50"
                      onClick={() => handleQuickAdd({ id: 'road-trip-travel-set', title: 'Road Trip Travel Set', price: 139, image: '/images/products/Travel-bags/Road-Trip-Travel-Set/travel-bags-carousel/0.avif' })}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add
                    </button>
                    <Link to="/products/road-trip-travel-set" className="btn gold-btn w-50">Details</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="col-md-6 col-lg-4">
              <div className="card product-card h-100">
                <img src="/images/products/Travel-bags/Venture-Ready-Duffel-55L/travel-bags-carousel/0.avif" className="card-img-top" alt="Duffel Bag" />
                <div className="card-body">
                  <ProductBadge product={{ labels: ['Best Seller', 'Trending'] }} className="mb-2" />
                  <h5 className="card-title">Venture Ready Duffel 55L</h5>
                  <p className="card-text">A rugged take on the traditional weekender, this duffel is ready for outdoor moves.</p>
                  <h4 className="price">$199</h4>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-dark w-50"
                      onClick={() => handleQuickAdd({ id: 'venture-ready-duffel-55l', title: 'Venture Ready Duffel 55L', price: 199, image: '/images/products/Travel-bags/Venture-Ready-Duffel-55L/travel-bags-carousel/0.avif' })}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add
                    </button>
                    <Link to="/products/venture-ready-duffel-55l" className="btn gold-btn w-50">Details</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 5 */}
            <div className="col-md-6 col-lg-4">
              <div className="card product-card h-100">
                <img src="/images/products/Accessories/Laptop-Caddy/accessories-carousel/0.avif" className="card-img-top" alt="Accessory" />
                <div className="card-body">
                  <ProductBadge product={{ labels: ['Featured', 'Best Seller'] }} className="mb-2" />
                  <h5 className="card-title">Laptop Caddy</h5>
                  <p className="card-text">Keep your laptop organized and protected in this sleek, durable caddy.</p>
                  <h4 className="price">$12.99</h4>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-dark w-50"
                      onClick={() => handleQuickAdd({ id: 'laptop-caddy', title: 'Laptop Caddy', price: 12.99, image: '/images/products/Accessories/Laptop-Caddy/accessories-carousel/0.avif' })}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add
                    </button>
                    <Link to="/products/laptop-caddy" className="btn gold-btn w-50">Details</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 6 */}
            <div className="col-md-6 col-lg-4">
              <div className="card product-card h-100">
                <img src="/images/products/Accessories/Tech-Kit/accessories-carousel/0.avif" className="card-img-top" alt="Accessory" />
                <div className="card-body">
                  <ProductBadge product={{ labels: ['Featured', 'Trending'] }} className="mb-2" />
                  <h5 className="card-title">Tech Kit</h5>
                  <p className="card-text">Keep your cables and chargers organized in this compact travel pouch.</p>
                  <h4 className="price">$12.33</h4>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-dark w-50"
                      onClick={() => handleQuickAdd({ id: 'tech-kit', title: 'Tech Kit', price: 12.33, image: '/images/products/Accessories/Tech-Kit/accessories-carousel/0.avif' })}
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add
                    </button>
                    <Link to="/products/tech-kit" className="btn gold-btn w-50">Details</Link>
                  </div>
                </div>
              </div>
            </div>
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
                  <i className="fa-solid fa-star-half fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
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
                  <i className="fa-solid fa-star-half fa-lg" style={{ color: 'rgb(255, 212, 59)' }}></i>
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
