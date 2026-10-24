// Telegram Order API service
// Sends orders to the Express backend which forwards them to Telegram

const API_BASE = 'http://localhost:3001';

/**
 * Send an order to the backend → Telegram
 * @param {Object} order - The order data
 * @param {Object} order.customer - { name, phone, address }
 * @param {Array}  order.items    - Cart items array
 * @param {number} order.total    - Order total
 * @param {string} order.orderNumber - Generated order number
 * @returns {Promise<{ success: boolean, orderNumber: string }>}
 */
export async function submitOrder(order) {
  const response = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit order');
  }

  return response.json();
}
