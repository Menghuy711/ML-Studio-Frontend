import { img } from "../config";
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function CartOffcanvas() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useContext(CartContext);
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [step, setStep] = useState('cart'); // 'cart' | 'loginRequired' | 'checkout' | 'confirmation'
  const [orderNumber, setOrderNumber] = useState('');

  // Reset flow whenever the offcanvas is closed
  useEffect(() => {
    const el = document.getElementById('cartOffcanvas');
    const handler = () => {
      setStep('cart');
      setOrderNumber('');
    };
    el?.addEventListener('hidden.bs.offcanvas', handler);
    return () => el?.removeEventListener('hidden.bs.offcanvas', handler);
  }, []);

  const handleProceed = () => {
    setStep(isLoggedIn ? 'checkout' : 'loginRequired');
  };

  const handlePlaceOrder = () => {
    setOrderNumber(`ML-${Date.now().toString().slice(-6)}`);
    clearCart();
    setStep('confirmation');
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="cartOffcanvas"
      aria-labelledby="cartOffcanvasLabel"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title fw-bold" id="cartOffcanvasLabel">
          {step === 'confirmation' ? 'Order Confirmed' : 'Your Cart'}
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body d-flex flex-column">
        {step === 'confirmation' ? (
          <div className="text-center my-auto">
            <i className="fa-solid fa-circle-check text-success fa-3x mb-3"></i>
            <h5 className="fw-bold">Thank you for your order!</h5>
            <p className="text-muted mb-1">Your order has been placed successfully.</p>
            <p className="mb-0">
              Order Number: <span className="fw-bold">{orderNumber}</span>
            </p>
            <button
              className="btn gold-btn w-100 py-2 fw-bold mt-4"
              data-bs-dismiss="offcanvas"
            >
              Continue Shopping
            </button>
          </div>
        ) : step === 'loginRequired' ? (
          <div className="text-center my-auto">
            <i className="fa-solid fa-lock text-warning fa-3x mb-3"></i>
            <h5 className="fw-bold">Login required</h5>
            <p className="text-muted mb-1">
              You need an account to place an order.
            </p>
            <p className="text-muted mb-4">
              Log in and we will keep your order safe.
            </p>
            <button
              className="btn btn-outline-secondary w-100 py-2 fw-bold mt-2"
              onClick={() => setStep('cart')}
            >
              Back to Cart
            </button>
          </div>
        ) : step === 'checkout' ? (
          <>
            <div className="mb-3">
              <p className="mb-1 text-muted small">
                Logged in as <span className="fw-bold text-dark">{currentUser?.name}</span>
              </p>
            </div>
            <div className="grow overflow-auto">
              {cartItems.map((item) => (
                <div key={item.variantKey} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid rounded"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = img('/images/products/Backpacks/Lite-Travel-Pack-30L/backpacks-carousel/0.avif');
                    }}
                  />
                  <div className="ms-3 grow">
                    <h6 className="mb-0 small">{item.title}</h6>
                    {item.color && (
                      <p className="mb-0 small text-muted">Color: {item.color}</p>
                    )}
                    <p className="mb-0 small text-muted">
                      {item.quantity} x ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto border-top pt-3">
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0 fw-bold">Total</h5>
                <h5 className="mb-0 fw-bold">${cartTotal}</h5>
              </div>
              <button className="btn gold-btn w-100 py-2 fw-bold" onClick={handlePlaceOrder}>
                Place Order
              </button>
              <button
                className="btn btn-outline-secondary w-100 py-2 fw-bold mt-2"
                onClick={() => setStep('cart')}
              >
                Back to Cart
              </button>
            </div>
          </>
        ) : (
          <>
            {cartItems.length === 0 ? (
              <div className="text-center my-5 text-muted">
                <i className="fa-solid fa-cart-arrow-down fa-3x mb-3"></i>
                <p>Your cart is currently empty.</p>
              </div>
            ) : (
              <div className="grow overflow-auto">
                {cartItems.map((item) => (
                  <div key={item.variantKey} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = img('/images/products/Backpacks/Lite-Travel-Pack-30L/backpacks-carousel/0.avif');
                      }}
                    />
                    <div className="ms-3 grow">
                      <Link
                        to={`/products/${item.id}${item.color ? `?color=${encodeURIComponent(item.color)}` : ''}`}
                        className="text-decoration-none text-dark"
                      >
                        <h6 className="mb-0">{item.title}</h6>
                      </Link>
                      {item.color && (
                        <p className="mb-0 small text-muted">Color: {item.color}</p>
                      )}
                      <p className="mb-0 text-muted">${item.price}</p>

                      <div className="d-flex align-items-center mt-2">
                        <div className="btn-group btn-group-sm" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.variantKey, -1)}
                          >
                            -
                          </button>
                          <button type="button" className="btn btn-outline-secondary" disabled>
                            {item.quantity}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => updateQuantity(item.variantKey, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => removeFromCart(item.variantKey)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto border-top pt-3">
              {!isLoggedIn && (
                <p className="text-muted small mb-2">
                  <i className="fa-solid fa-lock me-1"></i>
                  You must be logged in to place an order.
                </p>
              )}
              <div className="d-flex justify-content-between mb-3">
                <h5 className="mb-0 fw-bold">Total</h5>
                <h5 className="mb-0 fw-bold">${cartTotal}</h5>
              </div>
              <button
                className="btn gold-btn w-100 py-2 fw-bold"
                disabled={cartItems.length === 0}
                onClick={handleProceed}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}