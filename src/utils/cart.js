import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

/**
 * Opens the Bootstrap cart offcanvas drawer.
 */
export function openCartOffcanvas() {
  const offcanvasEl = document.getElementById('cartOffcanvas');
  if (!offcanvasEl) return;
  const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
  offcanvas.show();
}