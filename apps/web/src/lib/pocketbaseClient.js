import Pocketbase from 'pocketbase';

// Resolution order:
//   1. VITE_POCKETBASE_URL  — explicit override (recommended for prod)
//   2. /hcgi/platform       — sandbox reverse-proxy path (legacy)
//   3. http://127.0.0.1:8090 — local dev default
const POCKETBASE_API_URL =
  import.meta.env.VITE_POCKETBASE_URL ||
  (typeof window !== 'undefined' && window.__POCKETBASE_URL__) ||
  'http://127.0.0.1:8090';

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;
export { pocketbaseClient, POCKETBASE_API_URL };
