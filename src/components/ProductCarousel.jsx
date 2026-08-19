import { useState, useEffect } from 'react';

/**
 * Product Image Carousel.
 *
 * Props:
 *  - images:         Array of image URLs, or objects: { src, alt }.
 *  - alt:            Base alt text used when an image has no alt (default "Product").
 *  - autoSlide:      Enable auto-rotation (default true).
 *  - interval:       Auto-rotation interval in ms (default 4000).
 *  - showThumbnails: Show the thumbnail strip (default true).
 *  - className:      Extra classes appended to the wrapper.
 */
export default function ProductCarousel({
  images = [],
  alt = 'Product',
  autoSlide = true,
  interval = 4000,
  showThumbnails = true,
  className = '',
}) {
  const items = images.map((img) =>
    typeof img === 'string' ? { src: img, alt: null } : img
  );
  const count = items.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loadedSrcs, setLoadedSrcs] = useState(() => new Set());
  const [errorSrcs, setErrorSrcs] = useState(() => new Set());
  const [thumbErrors, setThumbErrors] = useState({});

  // Preload every carousel image up front so auto-slides switch to an
  // already-loaded image immediately (no loading spinner).
  useEffect(() => {
    const srcs = images
      .map((img) => (typeof img === 'string' ? img : img.src))
      .filter(Boolean);
    let cancelled = false;

    const markLoaded = (src) => {
      if (cancelled) return;
      setLoadedSrcs((prev) => {
        if (prev.has(src)) return prev;
        const next = new Set(prev);
        next.add(src);
        return next;
      });
    };

    const markError = (src) => {
      if (cancelled) return;
      setErrorSrcs((prev) => {
        if (prev.has(src)) return prev;
        const next = new Set(prev);
        next.add(src);
        return next;
      });
    };

    srcs.forEach((src) => {
      const img = new Image();
      img.onload = () => markLoaded(src);
      img.onerror = () => markError(src);
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  // Keep active index in range if the image list changes
  useEffect(() => {
    if (count && activeIndex >= count) setActiveIndex(0);
  }, [activeIndex, count]);

  // Auto-rotation (restarts on every change so each slide lasts one interval)
  useEffect(() => {
    if (!autoSlide || paused || count < 2) return;
    const timer = setInterval(
      () => setActiveIndex((i) => (i + 1) % count),
      interval
    );
    return () => clearInterval(timer);
  }, [autoSlide, paused, interval, count, activeIndex]);

  if (!count) return null;

  const current = items[activeIndex];
  const isLoaded = loadedSrcs.has(current.src);
  const hasError = errorSrcs.has(current.src);

  const handleMainLoad = (src) => {
    setLoadedSrcs((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  const handleMainError = (src) => {
    setErrorSrcs((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  const goTo = (index) => setActiveIndex((index + count) % count);
  const next = () => setActiveIndex((i) => (i + 1) % count);
  const prev = () => setActiveIndex((i) => (i - 1 + count) % count);

  const handleThumbError = (index) =>
    setThumbErrors((prev) => ({ ...prev, [index]: true }));

  return (
    <div
      className={`product-carousel ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Main image */}
      <div className="product-carousel__main">
        {!hasError ? (
          <>
            {!isLoaded && (
              <span className="product-carousel__spinner" aria-hidden="true"></span>
            )}
            <img
              src={current.src}
              alt={current.alt || `${alt} - image ${activeIndex + 1}`}
              className={isLoaded ? 'is-loaded' : ''}
              onLoad={() => handleMainLoad(current.src)}
              onError={() => handleMainError(current.src)}
            />
          </>
        ) : (
          <div
            className="product-carousel__placeholder"
            role="img"
            aria-label={`${alt} image unavailable`}
          >
            <i className="fa-solid fa-image"></i>
            <span>Image unavailable</span>
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              className="product-carousel__nav product-carousel__nav--prev"
              onClick={prev}
              aria-label="Previous image"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              type="button"
              className="product-carousel__nav product-carousel__nav--next"
              onClick={next}
              aria-label="Next image"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && count > 1 && (
        <div className="product-carousel__thumbs" role="group" aria-label="Product images">
          {items.map((item, index) => (
            <button
              key={item.src || index}
              type="button"
              className={`product-carousel__thumb${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              {!thumbErrors[index] ? (
                <img
                  src={item.src}
                  alt=""
                  onError={() => handleThumbError(index)}
                />
              ) : (
                <span className="product-carousel__thumb-fallback" aria-hidden="true">
                  <i className="fa-solid fa-image"></i>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}