import { img } from "../config";
import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import ColorSelector from '../components/ColorSelector';
import ProductCarousel from '../components/ProductCarousel';
import ProductBadge from '../components/ProductBadge';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

const DEFAULT_COLORS = [
  { name: 'Black', swatch: '#2B2B2B' },
  { name: 'River Rock', swatch: '#B0B2B1' },
  { name: 'Ash', swatch: '#C7C8C9' },
  { name: 'Clay', swatch: '#C1653B' },
];

const CATEGORY_IMAGES = {
  backpacks: [
    'backpack-01.avif',
    'backpack-02.avif',
    'backpack-03.png',
    'backpack-04.png',
    'backpack-05.avif',
    'backpack-06.avif',
    'backpack-07.avif',
  ].map((f) => img(`/images/products/Backpacks/${f}`)),
  luggage: [
    'luggage-01.avif',
    'luggage-02.avif',
    'luggage-03.avif',
    'luggage-04.avif',
  ].map((f) => img(`/images/products/Luggage/${f}`)),
  travelbag: [
    'travel-bag-01.avif',
    'travel-bag-02.avif',
    'travel-bag-03.avif',
    'travel-bag-04.avif',
    'travel-bag-05.avif',
  ].map((f) => img(`/images/products/Travel-bags/${f}`)),
  sling: [
    'sling-01.avif',
    'sling-02.avif',
    'sling-03.avif',
    'sling-04.avif',
    'sling-05.avif',
    'sling-06.avif',
    'sling-07.avif',
  ].map((f) => img(`/images/products/Sling-bags/${f}`)),
  tote: [
    'tote-bag-01.avif',
    'tote-bag-02.avif',
    'tote-bag-03.avif',
    'tote-bag-04.avif',
    'tote-bag-05.avif',
    'tote-bag-06.avif',
  ].map((f) => img(`/images/products/Tote-bags/${f}`)),
  accessories: [
    'accessories-01.avif',
    'accessories-02.avif',
    'accessories-03.avif',
    'accessories-04.avif',
  ].map((f) => img(`/images/products/Accessories/${f}`)),
};

export default function ProductDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const product =
    products.find((p) => p.id === id) ||
    products.find((p) => p.slug === id) ||
    products[0];

  const [selectedColor, setSelectedColor] = useState(null);

  const related = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const features = product.features || [];

  const colors = (product.colors && product.colors.length ? product.colors : DEFAULT_COLORS).map(
    (c) => ({ ...c, image: c.image || product.image })
  );

  const activeColor = selectedColor || colors[0];

  const fromCategory = searchParams.get('from');
  const backToProducts = fromCategory
    ? `/products#${fromCategory}`
    : '/products';

  // Sync the selected color with the ?color= URL param (e.g. clicking a cart item)
  useEffect(() => {
    const colorName = searchParams.get('color');
    const variants =
      product.colors && product.colors.length ? product.colors : DEFAULT_COLORS;
    const match = colorName
      ? variants.find(
          (c) =>
            (typeof c === 'string' ? c : c?.name)?.toLowerCase() ===
            colorName.toLowerCase()
        )
      : undefined;
    setSelectedColor(match || null);
  }, [product, searchParams]);

  const colorImage = activeColor?.image;

  const galleryImages = useMemo(() => {
    const base =
      product.images && product.images.length
        ? product.images
        : [product.image, ...(CATEGORY_IMAGES[product.category] || []).filter((src) => src !== product.image)];
    if (colorImage && colorImage !== product.image) {
      return [colorImage, ...base.filter((src) => src !== colorImage)];
    }
    return base;
  }, [product, colorImage]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    // Add the product with the selected color variant to cart
    addToCart({
      ...product,
      color: activeColor?.name,
      image: activeColor?.image || product.image,
    });
    // Open the cart offcanvas
    const offcanvasEl = document.getElementById('cartOffcanvas');
    if (offcanvasEl) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      offcanvas.show();
    }
  };

  return (
    <>
      {/* Product detail */}
      <section className="container py-5">
        {/* Back to Products */}
        <div className="mb-4">
          <Link to={backToProducts} className="btn gold-btn">
            ← Back to Products
          </Link>
        </div>

        <div className="row g-4 g-md-5 g-lg-5">
          {/* Product Image */}
          <div className="col-lg-6">
            <ProductCarousel
              key={colorImage && colorImage !== product.image ? colorImage : 'default'}
              images={galleryImages}
              alt={product.title}
              autoSlide
              interval={4000}
            />
          </div>

          {/* Product Information */}
          <div className="col-lg-6">

            <h1 className="fw-bold mb-3">{product.title}</h1>

            <h3 style={{ color: '#D4AF37', fontWeight: 700 }} className="mb-4">
              ${product.price}
            </h3>
            
            <p className="lead">{product.desc}</p>

            <ColorSelector
              label="Color"
              colors={colors}
              value={activeColor?.name}
              onChange={(color) => setSelectedColor(color)}
            />
            <p className="small text-muted mt-2 mb-0">
              Selected:{' '}
              <span className="fw-semibold text-dark">{activeColor?.name}</span>
            </p>

            <h5 className="mt-4">Features</h5>
            <ul>
              {features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <a href="#" className="btn green-btn btn-lg mt-3" onClick={handleAddToCart}>
              Add To Cart
            </a>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="container py-5">
        <h2 className="text-center mb-5">Related Products</h2>
        <div className="row g-4">
          {related.map((item) => (
            <div className="col-md-4" key={item.id}>
              <Link to={`/products/${item.id}`} className="text-decoration-none text-dark">
                <div className="card h-100">
                  <img src={item.image} className="card-img-top" alt={item.title} />
<div className="card-body">
                  <ProductBadge product={item} className="mb-2" />
                  <h5>{item.title}</h5>
                </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
