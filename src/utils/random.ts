import { randomBytes } from 'crypto';

export function rand(min = 0, max = 0x7FFFFFFF) {
    const diff = max - min;
    const bytes = randomBytes(4).readInt32LE(0);
    const fp = (bytes & 0x7FFFFFFF) / 2147483647.0;
    return Math.round(fp * diff) + min;
}
