import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { products as allProducts, categories as allCategories } from '../data/products';
import ProductBadge from './ProductBadge';

const SEARCH_DEBOUNCE = 250;
const CLOSE_MS = 180;

function highlight(text, term) {
  const t = term.trim().toLowerCase();
  if (!t || !text) return text;
  const idx = String(text).toLowerCase().indexOf(t);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + t.length)}</mark>
      {text.slice(idx + t.length)}
    </>
  );
}

export default function ProductSearch({
  products = allProducts,
  categories = allCategories,
  placeholder = 'Search bags, categories, keywords…',
  className = '',
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [value, setValue] = useState('');
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const categoryTitle = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.title])),
    [categories]
  );

  const results = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return [];
    return products.filter((p) => {
      const haystack = [
        p.title,
        p.category,
        categoryTitle[p.category],
        p.desc,
        ...(Array.isArray(p.tags) ? p.tags : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(t);
    });
  }, [products, term, categoryTitle]);

  useEffect(() => {
    const trimmed = value.trim();
    const timer = setTimeout(() => {
      setTerm(trimmed);
      if (trimmed) {
        setClosing(false);
        setOpen(true);
      } else {
        setOpen(false);
      }
    }, SEARCH_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length, term]);

  const closeDropdown = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    setClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_MS);
  }, []);

  const openDropdown = useCallback(() => {
    clearTimeout(closeTimerRef.current);
    setClosing(false);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [closeDropdown]);

  useEffect(() => {
    setOpen(false);
    setClosing(false);
  }, [location.pathname]);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  const runSearch = (trimmed) => {
    setTerm(trimmed);
    if (trimmed) {
      setClosing(false);
      setOpen(true);
      setActiveIndex(0);
    } else {
      setOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(value.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!results.length) return;
      e.preventDefault();
      openDropdown();
      setActiveIndex((i) => {
        if (e.key === 'ArrowDown') return (i + 1) % results.length;
        return (i - 1 + results.length) % results.length;
      });
    } else if (e.key === 'Enter') {
      if (open && results.length) {
        e.preventDefault();
        const p = results[activeIndex];
        if (p) {
          navigate(`/products/${p.id}`);
          setValue('');
          setTerm('');
          setOpen(false);
          setClosing(false);
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  };

  const handleSelect = (p) => {
    navigate(`/products/${p.id}`);
    setValue('');
    setTerm('');
    setActiveIndex(0);
    setOpen(false);
    setClosing(false);
  };

  const handleClear = () => {
    setValue('');
    setTerm('');
    setActiveIndex(0);
    setOpen(false);
    setClosing(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={`product-search ${className}`}>
      <form role="search" onSubmit={handleSubmit}>
        <div className="product-search__input-group">
          <i
            className="fa-solid fa-magnifying-glass product-search__icon"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            className={`product-search__input${value ? ' has-value' : ''}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => value.trim() && openDropdown()}
            aria-label="Search products"
            role="combobox"
            aria-expanded={open}
            aria-controls="product-search-results"
            aria-autocomplete="list"
            autoComplete="off"
          />
          {value && (
            <button
              type="button"
              className="product-search__clear-btn"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          )}
          <button
            type="submit"
            className="product-search__search-btn"
            aria-label="Search products"
          >
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          </button>
        </div>
      </form>

      {open && (
        <div
          id="product-search-results"
          role="listbox"
          aria-label="Search results"
          className={`product-search__dropdown${closing ? ' is-closing' : ' is-open'}`}
        >
          {results.length === 0 ? (
            <div className="product-search__empty">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" /> No
              products found
            </div>
          ) : (
            results.map((p, i) => (
              <button
                type="button"
                key={p.id}
                role="option"
                aria-selected={i === activeIndex}
                className={`product-search__result${i === activeIndex ? ' is-active' : ''}`}
                onClick={() => handleSelect(p)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <img src={p.image} alt="" />
                <span className="product-search__result-info">
                  <span className="product-search__result-name">
                    {highlight(p.title, term)}
                  </span>
                  <span className="product-search__result-meta">
                    {categoryTitle[p.category] || p.category}
                  </span>
                  <ProductBadge product={p} className="product-search__result-badges" />
                </span>
                <span className="product-search__result-price">${p.price}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}