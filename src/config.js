const BASE = import.meta.env.BASE_URL;

export const img = (path) => `${BASE}${path.startsWith('/') ? path.slice(1) : path}`;
