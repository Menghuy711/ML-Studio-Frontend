import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { currentUser, updateProfile, changePassword, logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+855 12 345 678',
    bio: currentUser?.bio || 'Product designer & ML enthusiast',
    address: currentUser?.address || 'Street 271, Phnom Penh, Cambodia',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Security tab state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [securityError, setSecurityError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    showToast('Profile updated successfully!');
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm((prev) => ({ ...prev, [name]: value }));
    setSecurityError('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityError('New passwords do not match.');
      return;
    }
    if (securityForm.newPassword.length < 4) {
      setSecurityError('Password must be at least 4 characters.');
      return;
    }
    const result = changePassword(securityForm.currentPassword, securityForm.newPassword);
    if (!result.success) {
      setSecurityError(result.error);
      return;
    }
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password changed successfully!');
  };

  // Demo order data
  const demoOrders = [
    { id: 'ORD-10234', date: '2026-10-15', items: 3, total: '$249.00', status: 'Delivered' },
    { id: 'ORD-10198', date: '2026-09-28', items: 1, total: '$89.50', status: 'Shipped' },
    { id: 'ORD-10112', date: '2026-09-10', items: 2, total: '$175.00', status: 'Processing' },
  ];

  const statusBadge = (status) => {
    const map = {
      Delivered: 'bg-success',
      Shipped: 'bg-primary',
      Processing: 'bg-warning text-dark',
      Cancelled: 'bg-danger',
    };
    return map[status] || 'bg-secondary';
  };

  return (
    <div className="profile-container py-5">
      <div className="container">
        {/* Header */}
        <div className="profile-header mb-4">
          <h2 className="fw-bold mb-1">My Account</h2>
          <p className="text-muted mb-0">Manage your personal information, address, and security settings.</p>
        </div>

        {/* Toast notification */}
        {toastMessage && (
          <div className={`alert alert-${toastType} alert-dismissible fade show`} role="alert">
            <i className={`bi ${toastType === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}></i>
            {toastMessage}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setToastMessage('')}></button>
          </div>
        )}

        <div className="row g-4">
          {/* ── Sidebar ── */}
          <div className="col-lg-3">
            <div className="profile-sidebar card shadow-sm border-0 rounded-4 p-3">
              {/* Avatar + name block */}
              <div className="text-center py-3 border-bottom">
                <div className="avatar-wrapper mb-3 position-relative d-inline-block">
                  <div className="avatar-circle d-flex align-items-center justify-content-center mx-auto">
                    {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <h5 className="mb-0 fw-bold">{currentUser?.name}</h5>
                <small className="text-muted">{currentUser?.email}</small>
              </div>

              {/* Nav links */}
              <div className="list-group list-group-flush pt-3">
                <button
                  type="button"
                  className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2"></i> Profile Details
                </button>
                <button
                  type="button"
                  className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <i className="bi bi-bag-check me-2"></i> Order History
                </button>
                <button
                  type="button"
                  className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-shield-lock me-2"></i> Security
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action border-0 rounded-3 text-danger mt-2"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="col-lg-9">
            <div className="profile-content card shadow-sm border-0 rounded-4 p-4">

              {/* ─── Profile Details Tab ─── */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSave}>
                  <h4 className="fw-bold mb-4">
                    <i className="bi bi-pencil-square me-2 text-primary"></i>
                    Edit Profile
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Shipping Address</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Bio / Notes</label>
                      <textarea
                        name="bio"
                        rows="3"
                        className="form-control"
                        value={formData.bio}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-dark mt-4 px-4 py-2 rounded-3">
                    <i className="bi bi-check-lg me-1"></i> Save Changes
                  </button>
                </form>
              )}

              {/* ─── Order History Tab ─── */}
              {activeTab === 'orders' && (
                <div>
                  <h4 className="fw-bold mb-4">
                    <i className="bi bi-receipt me-2 text-primary"></i>
                    Order History
                  </h4>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demoOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="fw-semibold">{order.id}</td>
                            <td>{order.date}</td>
                            <td>{order.items}</td>
                            <td>{order.total}</td>
                            <td>
                              <span className={`badge rounded-pill ${statusBadge(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── Security Tab ─── */}
              {activeTab === 'security' && (
                <div>
                  <h4 className="fw-bold mb-4">
                    <i className="bi bi-shield-check me-2 text-primary"></i>
                    Security Settings
                  </h4>
                  <p className="text-muted mb-4">Change your password below.</p>

                  <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '480px' }}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        value={securityForm.currentPassword}
                        onChange={handleSecurityChange}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        value={securityForm.newPassword}
                        onChange={handleSecurityChange}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityChange}
                        autoComplete="new-password"
                        required
                      />
                    </div>

                    {securityError && (
                      <p className="text-danger small mb-2">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        {securityError}
                      </p>
                    )}

                    <button type="submit" className="btn btn-dark px-4 py-2 rounded-3">
                      <i className="bi bi-key me-1"></i> Update Password
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
