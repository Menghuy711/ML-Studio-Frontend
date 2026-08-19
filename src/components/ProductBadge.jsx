import { PRODUCT_LABELS, getProductLabels } from '../data/products';

const LABEL_STYLES = {
  'Best Seller': 'product-badge--best-seller',
  'New Arrival': 'product-badge--new-arrival',
  'Trending': 'product-badge--trending',
  'Featured': 'product-badge--featured',
  'Sale': 'product-badge--sale',
  'Limited Edition': 'product-badge--limited',
};

const LABEL_ORDER = PRODUCT_LABELS;

/**
 * Reusable product badge / label display.
 *
 * Props:
 *  - labels:   Array of label strings. Optional — if omitted, the component
 *              reads `product.labels`.
 *  - product:  Product object whose `labels` are shown (when `labels` is absent).
 *  - className: Extra classes appended to the wrapper.
 *
 * Renders nothing when the product has no labels.
 */
export default function ProductBadge({
  labels,
  product,
  className = '',
}) {
  const items = labels || getProductLabels(product);
  if (!items.length) return null;

  const ordered = [...items].sort(
    (a, b) =>
      (LABEL_ORDER.indexOf(a) === -1 ? 99 : LABEL_ORDER.indexOf(a)) -
      (LABEL_ORDER.indexOf(b) === -1 ? 99 : LABEL_ORDER.indexOf(b))
  );

  return (
    <div className={['product-badges', className].filter(Boolean).join(' ')}>
      {ordered.map((label, idx) => (
        <span
          key={idx}
          className={`product-badge ${LABEL_STYLES[label] || 'product-badge--default'}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}