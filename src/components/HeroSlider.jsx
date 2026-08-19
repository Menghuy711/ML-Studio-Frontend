import { img } from "../config";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    image: img('/images/banner-slideshow/banner-01.webp'),
    heading: 'Luxury Bags Collection',
    subtitle: 'Premium Collections Made For Modern Lifestyle',
    buttonText: 'Shop Now',
    objectPosition: 'left center',
  },
  {
    image: img('/images/banner-slideshow/banner-02.avif'),
    heading: 'Travel In Style',
    subtitle: 'Discover premium luggage designed for every journey',
    buttonText: 'Explore Collection',
    objectPosition: 'center 45%',
  },
  {
    image: img('/images/banner-slideshow/banner-03.avif'),
    heading: 'Premium Quality',
    subtitle: 'Designed with style, comfort, and durability in mind',
    buttonText: 'Shop Collection',
    objectPosition: '60% center',
  },
  {
    image: img('/images/banner-slideshow/banner-04.avif'),
    heading: 'Your Style, Your Journey',
    subtitle: 'Find the perfect bag for every destination',
    buttonText: 'Discover More',
    objectPosition: 'right center',
  },
];

const AUTOPLAY_INTERVAL = 5000;

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const count = SLIDES.length;

  const goTo = useCallback(
    (index) => setActiveIndex(((index % count) + count) % count),
    [count]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % count),
    [count]
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + count) % count),
    [count]
  );

  // Autoplay (pauses on hover/focus)
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Featured collection"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slider__track">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.image}
            className={`hero-slider__slide${index === activeIndex ? ' is-active' : ''}`}
            aria-hidden={index !== activeIndex}
            inert={index !== activeIndex ? true : undefined}
          >
            <img
              src={slide.image}
              alt=""
              className="hero-slider__image"
              style={{ objectPosition: slide.objectPosition || 'center' }}
              draggable="false"
            />
            <div className="hero-slider__content">
              <h1>{slide.heading}</h1>
              <p>{slide.subtitle}</p>
              <Link to="/products" className="btn gold-btn btn-lg hero-slider__btn">
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="hero-slider__arrow hero-slider__arrow--prev"
            onClick={prev}
            aria-label="Previous slide"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            type="button"
            className="hero-slider__arrow hero-slider__arrow--next"
            onClick={next}
            aria-label="Next slide"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          <div className="hero-slider__dots" role="tablist" aria-label="Slideshow navigation">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                className={`hero-slider__dot${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              ></button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}