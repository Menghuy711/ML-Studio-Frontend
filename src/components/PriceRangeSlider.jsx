import { useState } from 'react';

/**
 * Reusable dual-handle price range slider.
 *
 * Props:
 *  - min/max:     Overall range boundaries (numbers).
 *  - step:        Slider step (default 1).
 *  - value:       { min, max } current selection.
 *  - onChange:    ({ min, max }) called while the user drags either handle.
 *  - currency:    Symbol shown before values (default "$").
 *  - label:       Heading text (default "Price Range").
 *  - className:   Extra classes appended to the wrapper.
 */
export default function PriceRangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  currency = '$',
  label = 'Price Range',
  hideLabel = false,
  className = '',
}) {
  const [active, setActive] = useState(null);

  const clampedMin = Math.min(value?.min ?? min, max - step);
  const clampedMax = Math.max(value?.max ?? max, min + step);

  const range = max - min;
  const minPct = range > 0 ? ((clampedMin - min) / range) * 100 : 0;
  const maxPct = range > 0 ? ((clampedMax - min) / range) * 100 : 100;

  const handleMinChange = (e) => {
    const next = Math.min(Number(e.target.value), clampedMax - step);
    onChange({ min: next, max: clampedMax });
  };

  const handleMaxChange = (e) => {
    const next = Math.max(Number(e.target.value), clampedMin + step);
    onChange({ min: clampedMin, max: next });
  };

  const handleReset = () => onChange({ min, max });

  return (
    <div className={`price-range ${className}`}>
      <div className={`price-range__header${hideLabel ? ' price-range__header--bare' : ''}`}>
        {!hideLabel && <span className="price-range__label">{label}</span>}
        <button
          type="button"
          className="price-range__reset"
          onClick={handleReset}
          aria-label={`Reset ${label} to $${min} — $${max}`}
        >
          Reset Price
        </button>
      </div>

      <div className="price-range__display">
        <span className="price-range__value">
          {currency}
          {clampedMin}
        </span>
        <span className="price-range__dash">—</span>
        <span className="price-range__value">
          {currency}
          {clampedMax}
        </span>
      </div>

      <div className="price-range__track">
        <div
          className="price-range__fill"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        <input
          type="range"
          className={`price-range__input price-range__input--min${active === 'min' ? ' is-active' : ''}`}
          min={min}
          max={max}
          step={step}
          value={clampedMin}
          onChange={handleMinChange}
          onPointerDown={() => setActive('min')}
          onFocus={() => setActive('min')}
          onBlur={() => setActive(null)}
          aria-label={`Minimum price: ${currency}${clampedMin}`}
        />
        <input
          type="range"
          className={`price-range__input price-range__input--max${active === 'max' ? ' is-active' : ''}`}
          min={min}
          max={max}
          step={step}
          value={clampedMax}
          onChange={handleMaxChange}
          onPointerDown={() => setActive('max')}
          onFocus={() => setActive('max')}
          onBlur={() => setActive(null)}
          aria-label={`Maximum price: ${currency}${clampedMax}`}
        />
      </div>
    </div>
  );
}