import { Link } from 'react-router-dom';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ProductBadge from './ProductBadge';

export default function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = () => {
    onAddToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
    const offcanvasEl = document.getElementById('cartOffcanvas');
    if (offcanvasEl) {
      const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      offcanvas.show();
    }
  };

  return (
    <div className="col-12 col-sm-6 col-lg-6 col-xl-4">
      <div className="card product-card h-100">
        <img src={product.image} className="card-img-top" alt={product.title} />
        <div className="card-body">
          <ProductBadge product={product} className="mb-2" />
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.desc}</p>
          <h4 className="price">${product.price}</h4>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-dark w-50"
              onClick={handleAddToCart}
            >
              <i className="fa-solid fa-cart-plus"></i> Add
            </button>
            <Link
              to={`/products/${product.id}?from=${product.category}`}
              className="btn gold-btn w-50"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
