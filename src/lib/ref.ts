import { randomInt } from 'node:crypto';

/** Unambiguous alphabet: no I, O, 0 or 1, so a ref read aloud survives. */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * CRS-YYMM-XXXX, e.g. CRS-2609-7K4P.
 * The date segment makes an old ref self-describing on the phone; the random
 * tail is 32^4, which is ample for a business taking single-digit enquiries
 * a week and still collision-checked by a unique index at write time.
 */
export function enquiryRef(now: Date = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  let tail = '';
  for (let i = 0; i < 4; i += 1) {
    tail += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `CRS-${yy}${mm}-${tail}`;
}
