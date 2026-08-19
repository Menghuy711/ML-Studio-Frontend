import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { categories, products, PRODUCT_LABELS, getProductLabels } from '../data/products';
import ProductCard from '../components/ProductCard';
import ProductSearch from '../components/ProductSearch';
import PriceRangeSlider from '../components/PriceRangeSlider';

export default function Products() {
  const { addToCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Price range boundaries for the slider
  const minPrice = 0;
  const maxPrice = 200;

  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });
  const [labelFilter, setLabelFilter] = useState('All');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    label: true,
    category: true,
  });

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleCategory = (id) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const clearAllFilters = () => {
    setPriceRange({ min: minPrice, max: maxPrice });
    setLabelFilter('All');
    setSelectedCategories([]);
    setFiltersOpen(false);
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const inPrice = p.price >= priceRange.min && p.price <= priceRange.max;
        if (!inPrice) return false;
        if (labelFilter !== 'All' && !getProductLabels(p).includes(labelFilter))
          return false;
        if (
          selectedCategories.length &&
          !selectedCategories.includes(p.category)
        )
          return false;
        return true;
      }),
    [priceRange, labelFilter, selectedCategories]
  );

  // Arriving with a category hash (e.g. /products#tote from a product detail
  // page): select that category filter and clear the hash from the URL.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const category = categories.find((c) => c.id === id);
    if (category) {
      setSelectedCategories([id]);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Scroll to the product grid once the category filter has been applied.
  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById('products-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash, selectedCategories]);

  return (
    <>
      {/* banner product */}
      <section className="product-hero">
        <div className="container text-center">
          <h1 className="display-3 fw-bold">Our Collection</h1>
          <p className="lead">10+ Premium Bags Available</p>
        </div>
      </section>

      {/* SECTION */}
      <section className="products-section py-5">
        <div className="container">
          {/* Product Search */}
          <div className="products-search">
            <ProductSearch />
          </div>

          {/* Layout: filter sidebar + product grid */}
          <div className="products-layout">
            {/* Mobile drawer backdrop */}
            <div
              className={`products-sidebar-backdrop${filtersOpen ? ' is-visible' : ''}`}
              onClick={() => setFiltersOpen(false)}
            ></div>

            {/* LEFT — Filters sidebar */}
            <aside className={`products-sidebar${filtersOpen ? ' is-open' : ''}`}>
              <div className="products-sidebar__header">
                <h5 className="mb-0 fw-bold">Filters</h5>
                <button
                  type="button"
                  className="filters-close"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Price Range */}
              <div className="sidebar-section">
                <div className="sidebar-section__title">Price Range</div>
                <div className="sidebar-section__body">
                  <PriceRangeSlider
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                    hideLabel
                  />
                </div>
              </div>

              {/* Product Label */}
              <div className="sidebar-section">
                <button
                  type="button"
                  className="sidebar-section__header"
                  onClick={() => toggleSection('label')}
                  aria-expanded={openSections.label}
                >
                  <span>Product Label</span>
                  <i className={`fa-solid fa-chevron-down${openSections.label ? ' is-open' : ''}`}></i>
                </button>
                {openSections.label && (
                  <div className="sidebar-section__body">
                    <div className="badge-filter badge-filter--vertical">
                      {['All', ...PRODUCT_LABELS].map((label) => (
                        <button
                          key={label}
                          type="button"
                          className={`badge-filter__btn${labelFilter === label ? ' is-active' : ''}`}
                          onClick={() => setLabelFilter(label)}
                          aria-pressed={labelFilter === label}
                        >
                          {label === 'All' ? 'All Products' : label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="sidebar-section">
                <button
                  type="button"
                  className="sidebar-section__header"
                  onClick={() => toggleSection('category')}
                  aria-expanded={openSections.category}
                >
                  <span>Category</span>
                  <i className={`fa-solid fa-chevron-down${openSections.category ? ' is-open' : ''}`}></i>
                </button>
                {openSections.category && (
                  <div className="sidebar-section__body">
                    <ul className="category-filter__list">
                      {categories.map((category) => (
                        <li key={category.id} className="category-filter__item">
                          <label className="category-filter__label">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => toggleCategory(category.id)}
                            />
                            <span>{category.title}</span>
                            <span className="category-filter__count">
                              {products.filter((p) => p.category === category.id).length}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Clear All Filters */}
              <button
                type="button"
                className="sidebar-clear"
                onClick={clearAllFilters}
              >
                <i className="fa-solid fa-rotate-left me-2"></i>
                Clear All Filters
              </button>
            </aside>

            {/* RIGHT — Product grid */}
            <div className="products-main">
              <div className="products-main__header">
                <button
                  type="button"
                  className="filters-toggle"
                  onClick={() => setFiltersOpen(true)}
                >
                  <i className="fa-solid fa-sliders me-2"></i> Filters
                </button>
                <span className="products-main__count">
                  Showing {filteredProducts.length} of {products.length} products
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fa-solid fa-filter fa-3x mb-3"></i>
                  <p className="mb-0">
                    No products found matching the selected filters.
                  </p>
                </div>
              ) : (
                <div className="row g-4" id="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}