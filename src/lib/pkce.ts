
/**
 * @fileOverview High-standard PKCE cryptographic generator for Deriv OAuth 2.0.
 */

function base64UrlEncode(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function generatePkce() {
  // Verifier: 43-128 chars
  const verifier = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)).buffer);
  
  // Challenge: S256
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const challenge = base64UrlEncode(hash);
  
  // State: Random CSRF token
  const state = base64UrlEncode(crypto.getRandomValues(new Uint8Array(16)).buffer);

  return { verifier, challenge, state };
}
