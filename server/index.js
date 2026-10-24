import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
// Public base URL of the deployed site – used to turn relative image paths
// into absolute URLs that the Telegram API can fetch.
const SITE_URL = (process.env.SITE_URL || 'https://menghuy711.github.io/ML-Studio-Frontend').replace(/\/+$/, '');

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Telegram helpers ─────────────────────────────────────────

/** Resolve a possibly-relative image path to a full public URL. */
function resolveImageUrl(imagePath) {
  if (!imagePath) return null;
  // Already absolute
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  // Relative – prepend the site URL
  const clean = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${SITE_URL}${clean}`;
}

/** Send a plain HTML text message. */
async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description}`);
  }

  return data;
}

/** Send a single photo with an optional HTML caption. */
async function sendTelegramPhoto(photoUrl, caption = '') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      photo: photoUrl,
      caption,
      parse_mode: 'HTML',
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    console.warn(`⚠️  sendPhoto failed for ${photoUrl}: ${data.description}`);
  }

  return data;
}

/** Send multiple photos as an album (media group). */
async function sendTelegramMediaGroup(mediaItems) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      media: mediaItems,
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    console.warn(`⚠️  sendMediaGroup failed: ${data.description}`);
  }

  return data;
}

// ── Format order text message ────────────────────────────────
function formatOrderMessage(order) {
  const { customer, items, total, orderNumber } = order;
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Phnom_Penh',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const lines = [];

  // ── Header ──
  lines.push(`🧾 <b>NEW ORDER</b>  •  <code>#${orderNumber}</code>`);
  lines.push(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);

  // ── Customer Details ──
  lines.push(``);
  lines.push(`👤  <b>Customer Info</b>`);
  lines.push(`┌───────────────────`);
  lines.push(`│  🏷  ${customer.name}`);
  lines.push(`│  📞  ${customer.phone}`);
  lines.push(`│  📍  ${customer.address}`);
  lines.push(`└───────────────────`);

  // ── Order Items ──
  lines.push(``);
  lines.push(`🛒  <b>Order Items</b>`);
  lines.push(`┌───────────────────`);
  items.forEach((item, i) => {
    const colorTag = item.color ? `  ·  <i>${item.color}</i>` : '';
    const subtotal = (item.quantity * item.price).toFixed(2);
    lines.push(`│`);
    lines.push(`│  ${i + 1}️⃣  <b>${item.title}</b>${colorTag}`);
    lines.push(`│      ${item.quantity} × $${item.price}  ➜  <b>$${subtotal}</b>`);
  });
  lines.push(`└───────────────────`);

  // ── Summary ──
  lines.push(``);
  lines.push(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);
  lines.push(`💰  <b>TOTAL:  $${total.toFixed(2)}</b>`);
  lines.push(`🕐  ${timestamp}`);
  lines.push(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`);

  return lines.join('\n');
}

// ── Send product photos to Telegram ──────────────────────────
async function sendOrderPhotos(items) {
  // Collect items that have valid images
  const photoItems = items
    .map((item, i) => {
      const url = resolveImageUrl(item.image);
      if (!url) return null;
      const colorLabel = item.color ? ` (${item.color})` : '';
      return {
        url,
        caption: `${i + 1}️⃣  <b>${item.title}</b>${colorLabel}\n${item.quantity} × $${item.price}`,
      };
    })
    .filter(Boolean);

  if (photoItems.length === 0) return;

  if (photoItems.length === 1) {
    // Single photo → sendPhoto with caption
    await sendTelegramPhoto(photoItems[0].url, photoItems[0].caption);
  } else {
    // Multiple photos → send as an album (media group)
    const media = photoItems.map((p, i) => ({
      type: 'photo',
      media: p.url,
      caption: p.caption,
      parse_mode: 'HTML',
      // Telegram media group: only the first item's caption is shown on some clients,
      // but most modern clients show per-photo captions.
      ...(i === 0 ? {} : {}),
    }));
    await sendTelegramMediaGroup(media);
  }
}

// ── POST /api/orders ─────────────────────────────────────────
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total, orderNumber } = req.body;

    // Basic validation
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ error: 'Customer name, phone, and address are required.' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item.' });
    }

    // 1) Send product photos first (non-blocking failure — order text still sends)
    try {
      await sendOrderPhotos(items);
    } catch (photoErr) {
      console.warn('⚠️  Photo send failed (continuing with text):', photoErr.message);
    }

    // 2) Send the text order summary
    const message = formatOrderMessage({ customer, items, total, orderNumber });
    await sendTelegramMessage(message);

    console.log(`✅ Order ${orderNumber} sent to Telegram`);
    res.json({ success: true, orderNumber });
  } catch (error) {
    console.error('❌ Failed to send order:', error.message);
    res.status(500).json({ error: 'Failed to send order to Telegram. Please try again.' });
  }
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 ML Studio Order Server running on http://localhost:${PORT}`);

  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'your_bot_token_here') {
    console.log('⚠️  TELEGRAM_BOT_TOKEN is not set! Edit server/.env to add your bot token.');
  }
  if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === 'your_chat_id_here') {
    console.log('⚠️  TELEGRAM_CHAT_ID is not set! Edit server/.env to add your chat ID.');
  }
});
