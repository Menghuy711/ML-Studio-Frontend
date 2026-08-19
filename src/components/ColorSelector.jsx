import { useState, useEffect } from 'react';

/**
 * Reusable product color / variant selector.
 *
 * Props:
 *  - colors:       Array of variants. Each item can be a string (color name)
 *                  or an object: { name, image, swatch }.
 *                  `image`  -> thumbnail of the product in that color
 *                  `swatch` -> hex color used when no image is provided
 *  - label:        Text shown next to ":" (default "Color")
 *  - value:        Controlled selection (color name). Omit to use internal state.
 *  - defaultValue: Initial selection for the uncontrolled version.
 *  - onChange:     (color, index) called when a color is clicked. Use this to
 *                  update the main product image/variant in the parent.
 *  - className:    Extra classes appended to the wrapper.
 */
export default function ColorSelector({
  colors = [],
  label = 'Color',
  value,
  defaultValue,
  onChange,
  className = '',
}) {
  const isControlled = value !== undefined;

  const findIndex = (name) => {
    if (name === undefined || name === null) return -1;
    return colors.findIndex((c) => (typeof c === 'string' ? c : c?.name) === name);
  };

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const i = findIndex(defaultValue ?? value);
    return i === -1 ? 0 : i;
  });

  useEffect(() => {
    if (isControlled) {
      const i = findIndex(value);
      setSelectedIndex(i === -1 ? 0 : i);
    }
  }, [value, isControlled, colors]);

  const activeIndex = isControlled
    ? (() => {
        const i = findIndex(value);
        return i === -1 ? 0 : i;
      })()
    : selectedIndex;

  if (!colors.length) return null;

  const handleSelect = (color, index) => {
    if (!isControlled) setSelectedIndex(index);
    onChange?.(color, index);
  };

  return (
    <div className={`color-selector ${className}`}>
      <span className="color-selector__label">{label}:</span>
      <div className="color-selector__options" role="group" aria-label={label}>
        {colors.map((color, index) => {
          const name = typeof color === 'string' ? color : color.name;
          const image = typeof color === 'object' ? color.image : undefined;
          const swatch = typeof color === 'object' ? color.swatch : undefined;
          const isActive = index === activeIndex;

          return (
            <button
              type="button"
              key={name || index}
              className={`color-selector__option${isActive ? ' is-active' : ''}`}
              onClick={() => handleSelect(color, index)}
              aria-label={`${label} ${name}`}
              aria-pressed={isActive}
              title={name}
            >
              <span className="color-selector__thumb">
                {image ? (
                  <img src={image} alt={`${name} ${label.toLowerCase()}`} />
                ) : (
                  <span
                    className="color-selector__swatch"
                    style={swatch ? { backgroundColor: swatch } : undefined}
                  />
                )}
              </span>
              <span className="color-selector__name">{name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
