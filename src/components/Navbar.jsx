import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ onOpenLogin, onOpenRegister }) {
  const location = useLocation();
  const path = location.pathname;
  const { cartCount } = useContext(CartContext);
  const { isLoggedIn, currentUser, logout } = useContext(AuthContext);

  const renderCartButton = (className) => (
    <button
      className={`btn btn-link text-white position-relative ${className}`}
      data-bs-toggle="offcanvas"
      data-bs-target="#cartOffcanvas"
      aria-controls="cartOffcanvas"
      style={{ textDecoration: 'none' }}
    >
      <i className="fa-solid fa-cart-shopping fa-lg"></i>
      {cartCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
          {cartCount}
          <span className="visually-hidden">items in cart</span>
        </span>
      )}
    </button>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex justify-content-center align-items-center" to="/"
          style={{ width: '200px', height: '90px' }}>
          {/* BagStore */}
          <img src="/images/logo/ML-Studio-Logo.png" alt="logo-ml-studio" />
        </Link>

        {/* Mobile Cart + Toggle Button */}
        <div className="d-flex align-items-center d-lg-none">
          {renderCartButton('nav-cart-mobile')}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Menu Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${path === '/' ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${path.startsWith('/products') ? 'active' : ''}`} to="/products">Product</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${path === '/about' ? 'active' : ''}`} to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${path === '/contact' ? 'active' : ''}`} to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Login, Register, and Cart */}
          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <span className="fw-bold me-2 text-white" style={{ fontSize: '0.95rem' }}>
                  <i className="fa-solid fa-user me-1 text-warning"></i>
                  {currentUser.name}
                </span>
                <span className="nav-separator" aria-hidden="true"></span>
                <label
                  className="btn-open-login"
                  onClick={logout}
                  style={{ cursor: 'pointer', background: '#6c757d' }}
                >
                  Logout
                </label>
              </>
            ) : (
              <>
                {/* Login button */}
                <label className="btn-open-login" onClick={onOpenLogin} style={{ cursor: 'pointer' }}>Login</label>

                {/* Line separator */}
                <span className="nav-separator" aria-hidden="true"></span>

                {/* Register button */}
                <label className="btn-open-register" onClick={onOpenRegister} style={{ cursor: 'pointer' }}>Register</label>
              </>
            )}

            {/* Cart Icon (desktop) */}
            {renderCartButton('nav-cart')}
          </div>
        </div>
      </div>
    </nav>
  );
}
