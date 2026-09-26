// iphash.mjs — privacy-preserving IP field for ailog: entries (worker
// hardening, finding #5). The old `ip.slice(0, 8) + '***'` kept most of
// an IPv4. This is sha256(ip | UTC date | pepper) truncated to 12 hex
// chars: the same IP still correlates within a day (enough to spot one
// client hammering the box) but not across days, and the stored value is
// not the address. Uses WebCrypto (crypto.subtle), available in Workers
// and in Node >= 20.
//
// NOTE: without a pepper the daily salt is public knowledge, so anyone
// holding the KV data could still brute-force the IPv4 space. Pass a
// secret (env.AILOG_PEPPER) to close that; it's optional so nothing
// breaks when it isn't set.

export const IP_HASH_LEN = 12;

export async function hashIp(ip, now = new Date(), pepper = '') {
  const day = now.toISOString().slice(0, 10);
  const input = `${ip == null ? '' : String(ip)}|${day}|${pepper || ''}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  let hex = '';
  for (const b of new Uint8Array(buf)) hex += b.toString(16).padStart(2, '0');
  return hex.slice(0, IP_HASH_LEN);
}
