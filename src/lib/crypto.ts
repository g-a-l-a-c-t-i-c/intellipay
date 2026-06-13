// AES-256-GCM field-level encryption using Web Crypto API.
// IV is 12 bytes prepended to ciphertext, base64-encoded together.

async function importKey(hexKey: string): Promise<CryptoKey> {
  const raw = hexToBytes(hexKey.padEnd(64, '0').slice(0, 64));
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

export async function encrypt(plaintext: string, hexKey: string): Promise<string> {
  const key = await importKey(hexKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const combined = new Uint8Array(12 + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), 12);
  return bytesToBase64(combined);
}

export async function decrypt(b64Ciphertext: string, hexKey: string): Promise<string> {
  const key = await importKey(hexKey);
  const combined = base64ToBytes(b64Ciphertext);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(plaintext);
}

export async function hashApiKey(rawKey: string): Promise<string> {
  const encoded = new TextEncoder().encode(rawKey);
  const hash = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateApiKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
