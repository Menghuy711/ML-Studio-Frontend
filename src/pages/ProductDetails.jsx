import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import ColorSelector from '../components/ColorSelector';
import ProductCarousel from '../components/ProductCarousel';
import ProductBadge from '../components/ProductBadge';
import { openCartOffcanvas } from '../utils/cart';

const DEFAULT_COLORS = [
  { name: 'Black', swatch: '#2B2B2B' },
  { name: 'River Rock', swatch: '#B0B2B1' },
  { name: 'Ash', swatch: '#C7C8C9' },
  { name: 'Clay', swatch: '#C1653B' },
];

export default function ProductDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const product =
    products.find((p) => p.id === id) ||
    products.find((p) => p.slug === id) ||
    null;

  const [selectedColor, setSelectedColor] = useState(null);

  const related = useMemo(() => {
    if (!product) return [];
    const others = products.filter((p) => p.id !== product.id);
    const sameCategory = others.filter((p) => p.category === product.category);
    const rest = others.filter((p) => p.category !== product.category);
    return [...sameCategory, ...rest].slice(0, 3);
  }, [product]);

  const features = product?.features || [];

  const colors = useMemo(
    () =>
      (product?.colors && product.colors.length
        ? product.colors
        : DEFAULT_COLORS
      ).map((c) => ({ ...c, image: c.image || product?.image })),
    [product]
  );

  const activeColor = selectedColor || colors[0];

  const fromCategory = searchParams.get('from');
  const backToProducts = fromCategory
    ? `/products#${fromCategory}`
    : '/products';

  // Sync the selected color with the ?color= URL param (e.g. clicking a cart item)
  useEffect(() => {
    if (!product) return;
    const colorName = searchParams.get('color');
    const variants =
      product.colors && product.colors.length
        ? product.colors
        : DEFAULT_COLORS;
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
    if (!product) return [];
    const base =
      product.images && product.images.length
        ? product.images
        : [product.image];
    if (colorImage && colorImage !== product.image) {
      return [colorImage, ...base.filter((src) => src !== colorImage)];
    }
    return base;
  }, [product, colorImage]);

  if (!product) {
    return (
      <section className="container py-5 text-center">
        <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
        <h1 className="fw-bold">Product Not Found</h1>
        <p className="text-muted mb-4">
          Sorry, we couldn't find the product you were looking for.
        </p>
        <Link to="/products" className="btn gold-btn">
          ← Back to Products
        </Link>
      </section>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      color: activeColor?.name,
      image: activeColor?.image || product.image,
    });
    openCartOffcanvas();
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

            <button type="button" className="btn green-btn btn-lg mt-3" onClick={handleAddToCart}>
              Add To Cart
            </button>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="container py-5">
        <h2 className="text-center mb-5">Related Products</h2>
        {related.length === 0 ? (
          <p className="text-center text-muted">
            No related products available right now.
          </p>
        ) : (
          <div className="row g-4">
            {related.map((item) => (
              <div className="col-md-4" key={item.id}>
                <Link to={`/products/${item.id}`} className="text-decoration-none text-dark">
                  <div className="card h-100">
                    <img src={item.image} className="card-img-top" alt={item.title} loading="lazy" />
                    <div className="card-body">
                      <ProductBadge product={item} className="mb-2" />
                      <h5>{item.title}</h5>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}