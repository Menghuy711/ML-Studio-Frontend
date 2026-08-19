import { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function LoginModal({ activeModal, setActiveModal }) {
  const { login } = useContext(AuthContext);
  const isLoginOpen = activeModal === 'login';
  const isRegisterOpen = activeModal === 'register';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [registerInfo, setRegisterInfo] = useState('');
  const [register, setRegister] = useState({ username: '', email: '', password: '' });

  const loginUsernameRef = useRef(null);
  const registerUsernameRef = useRef(null);

  const isAnyOpen = isLoginOpen || isRegisterOpen;

  const handleClose = useCallback(() => {
    setActiveModal(null);
    setError('');
    setRegisterInfo('');
    setUsername('');
    setPassword('');
    setRegister({ username: '', email: '', password: '' });
  }, [setActiveModal]);

  // Move focus into the visible modal and close on Escape.
  useEffect(() => {
    if (isLoginOpen) loginUsernameRef.current?.focus();
    if (isRegisterOpen) registerUsernameRef.current?.focus();
  }, [isLoginOpen, isRegisterOpen]);

  useEffect(() => {
    if (!isAnyOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isAnyOpen, handleClose]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!register.username || !register.email || !register.password) return;
    setRegisterInfo(
      'This demo store has only one account. Please use the Login form with the demo account.'
    );
  };

  return (
    <>
      {/* Login/Register checkboxes & modals (must be siblings for CSS ~ selector) */}
      <input type="checkbox" id="login-toggle" checked={isLoginOpen} readOnly style={{ display: 'none' }} />
      <input type="checkbox" id="register-toggle" checked={isRegisterOpen} readOnly style={{ display: 'none' }} />

      {/* Login Overlay + Modal */}
      <div
        className="modal-overlay login-overlay"
        inert={isLoginOpen ? undefined : true}
        aria-hidden={!isLoginOpen}
      >
        <label onClick={handleClose} style={{ position: 'absolute', inset: '0', cursor: 'default' }} aria-label="Close"></label>

        <div className="modal-card">
          {/* Left */}
          <div className="modal-left">
            <h2>Hello,<br />Welcome!</h2>
            <p>Don't have an account?</p>
            <a href="#" className="btn-register-link" onClick={(e) => { e.preventDefault(); setActiveModal('register'); }}>
              Register
            </a>
          </div>

          {/* Right */}
          <div className="modal-right">
            <label className="btn-close-modal" onClick={handleClose} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </label>

            <h3>Login</h3>

            <form onSubmit={handleLoginSubmit}>
              <div className="field-wrap">
                <input
                  ref={loginUsernameRef}
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <i className="bi bi-person field-icon"></i>
              </div>

              <div className="field-wrap">
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="bi bi-lock field-icon"></i>
              </div>

              <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>

              {error && <p className="text-danger small mb-2">{error}</p>}

              <button className="btn-login" type="submit">Login</button>
            </form>

            <p className="social-divider">or login with social platforms</p>

            <div className="social-buttons">
              <a href="#" className="social-btn google" title="Google" onClick={(e) => e.preventDefault()}> <i className="bi bi-google"></i> </a>
              <a href="#" className="social-btn facebook" title="Facebook" onClick={(e) => e.preventDefault()}> <i className="bi bi-facebook"></i> </a>
              <a href="#" className="social-btn apple" title="Apple" onClick={(e) => e.preventDefault()}> <i className="bi bi-apple"></i> </a>
              <a href="#" className="social-btn tiktok" title="Tiktok" onClick={(e) => e.preventDefault()}> <i className="bi bi-tiktok"></i> </a>
            </div>
          </div>
        </div>
      </div>

      {/* Register Overlay + Modal */}
      <div
        className="modal-overlay register-overlay"
        inert={isRegisterOpen ? undefined : true}
        aria-hidden={!isRegisterOpen}
      >
        <label onClick={handleClose} style={{ position: 'absolute', inset: '0', cursor: 'default' }} aria-label="Close"></label>

        <div className="modal-card">
          {/* Left */}
          <div className="modal-left">
            <h2>Join Us<br />Today!</h2>
            <p>Already have an account?</p>
            <a href="#" className="btn-register-link" onClick={(e) => { e.preventDefault(); setActiveModal('login'); }}>
              Login
            </a>
          </div>

          {/* Right */}
          <div className="modal-right">
            <label className="btn-close-modal" onClick={handleClose} aria-label="Close">
              <i className="bi bi-x-lg"></i>
            </label>

            <h3>Register</h3>

            <form onSubmit={handleRegisterSubmit}>
              <div className="field-wrap">
                <input
                  ref={registerUsernameRef}
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  value={register.username}
                  onChange={(e) => setRegister((r) => ({ ...r, username: e.target.value }))}
                />
                <i className="bi bi-at field-icon"></i>
              </div>

              <div className="field-wrap">
                <input
                  type="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  value={register.email}
                  onChange={(e) => setRegister((r) => ({ ...r, email: e.target.value }))}
                />
                <i className="bi bi-envelope field-icon"></i>
              </div>

              <div className="field-wrap">
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={register.password}
                  onChange={(e) => setRegister((r) => ({ ...r, password: e.target.value }))}
                />
                <i className="bi bi-lock field-icon"></i>
              </div>

              {registerInfo && <p className="text-info small mb-2">{registerInfo}</p>}

              <button className="btn-register" type="submit">Create Account</button>
            </form>

            <p className="social-divider">or register with social platforms</p>

            <div className="social-buttons">
              <a href="#" className="social-btn google" title="Google" onClick={(e) => e.preventDefault()}> <i className="bi bi-google"></i> </a>
              <a href="#" className="social-btn facebook" title="Facebook" onClick={(e) => e.preventDefault()}> <i className="bi bi-facebook"></i> </a>
              <a href="#" className="social-btn apple" title="Apple" onClick={(e) => e.preventDefault()}> <i className="bi bi-apple"></i> </a>
              <a href="#" className="social-btn tiktok" title="Tiktok" onClick={(e) => e.preventDefault()}> <i className="bi bi-tiktok"></i> </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}